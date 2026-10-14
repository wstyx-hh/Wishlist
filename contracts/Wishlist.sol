// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Wishlist {
    struct Wish {
        uint256 id;
        address owner;
        string title;
        string description;
        uint256 goalAmount;    // in wei
        uint256 currentAmount; // total raised, in wei
        bool isClosed;
        bool isWithdrawn;
    }

    mapping(uint256 => Wish) public wishes;
    uint256 public wishCount;

    // Event for wish creation
    event WishCreated(uint256 indexed wishId, address indexed owner, string title, uint256 goalAmount);
    // Event for funding a wish
    event WishFunded(uint256 indexed wishId, address indexed funder, uint256 amount);
    // Event for closing a wish
    event WishClosed(uint256 indexed wishId);
    // Event for withdrawing the raised funds
    event FundsWithdrawn(uint256 indexed wishId, address indexed owner, uint256 amount);

    modifier wishExists(uint256 wishId) {
        require(wishId > 0 && wishId <= wishCount, "Wish does not exist.");
        _;
    }

    modifier onlyWishOwner(uint256 wishId) {
        require(wishes[wishId].owner == msg.sender, "Only the wish owner can do this.");
        _;
    }

    // Function to create a new wish
    function createWish(string memory title, string memory description, uint256 goalAmount) public {
        require(bytes(title).length > 0, "Title is required.");
        require(goalAmount > 0, "Goal amount must be greater than zero.");

        wishCount++;
        wishes[wishCount] = Wish(wishCount, msg.sender, title, description, goalAmount, 0, false, false);
        emit WishCreated(wishCount, msg.sender, title, goalAmount);
    }

    // Returns all wishes. Gas grows linearly with wishCount, so for big lists use getWishes.
    function getAllWishes() public view returns (Wish[] memory) {
        return getWishes(0, wishCount);
    }

    // Paginated read: up to `limit` wishes starting from position `offset` (0-based)
    function getWishes(uint256 offset, uint256 limit) public view returns (Wish[] memory) {
        if (offset >= wishCount) {
            return new Wish[](0);
        }
        if (limit > wishCount - offset) {
            limit = wishCount - offset;
        }
        uint256 end = offset + limit;
        Wish[] memory page = new Wish[](end - offset);
        for (uint256 i = offset; i < end; i++) {
            page[i - offset] = wishes[i + 1];
        }
        return page;
    }

    // Function to fund a wish using Ether
    function fundWish(uint256 wishId) public payable wishExists(wishId) {
        require(!wishes[wishId].isClosed, "Wish is closed.");
        require(msg.value > 0, "Must send Ether to fund the wish.");

        wishes[wishId].currentAmount += msg.value;
        emit WishFunded(wishId, msg.sender, msg.value);

        // Automatically close the wish if the goal amount is reached
        if (wishes[wishId].currentAmount >= wishes[wishId].goalAmount) {
            _closeWish(wishId);
        }
    }

    // Function to close a wish manually (only by its owner)
    function closeWish(uint256 wishId) public wishExists(wishId) onlyWishOwner(wishId) {
        require(!wishes[wishId].isClosed, "Wish is already closed.");
        _closeWish(wishId);
    }

    // Function to withdraw the funds raised for a wish (only by its owner, only once).
    // Withdrawing also closes the wish, so no more funds can arrive after it.
    function withdrawWish(uint256 wishId) public wishExists(wishId) onlyWishOwner(wishId) {
        Wish storage wish = wishes[wishId];
        require(!wish.isWithdrawn, "Funds already withdrawn.");
        require(wish.currentAmount > 0, "Nothing to withdraw.");

        // Checks-effects-interactions: update state before sending Ether
        uint256 amount = wish.currentAmount;
        wish.isWithdrawn = true;
        if (!wish.isClosed) {
            _closeWish(wishId);
        }
        emit FundsWithdrawn(wishId, msg.sender, amount);

        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Transfer failed.");
    }

    function _closeWish(uint256 wishId) private {
        wishes[wishId].isClosed = true;
        emit WishClosed(wishId);
    }
}
