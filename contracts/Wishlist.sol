// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Wishlist {
    struct Wish {
        string title;
        string description;
        uint256 goalAmount;
        uint256 currentAmount;
        bool isClosed;
    }

    mapping(uint256 => Wish) public wishes;
    uint256 public wishCount;

    // Event for wish creation
    event WishCreated(uint256 wishId, string title, uint256 goalAmount);
    // Event for funding a wish
    event WishFunded(uint256 wishId, uint256 amount);
    // Event for closing a wish
    event WishClosed(uint256 wishId);

    // Function to create a new wish
    function createWish(string memory title, string memory description, uint256 goalAmount) public {
        wishCount++;
        wishes[wishCount] = Wish(title, description, goalAmount, 0, false);
        emit WishCreated(wishCount, title, goalAmount);
    }

    function getAllWishes() public view returns (Wish[] memory) {
    Wish[] memory allWishes = new Wish[](wishCount);
    for (uint256 i = 1; i <= wishCount; i++) {
        allWishes[i - 1] = wishes[i];
    }
    return allWishes;
    }


    // Function to fund a wish using Ether
    function fundWish(uint256 wishId) public payable {
        require(wishId > 0 && wishId <= wishCount, "Wish does not exist.");
        require(!wishes[wishId].isClosed, "Wish is closed.");
        require(msg.value > 0, "Must send Ether to fund the wish.");

        wishes[wishId].currentAmount += msg.value;
        emit WishFunded(wishId, msg.value);

        // Automatically close the wish if the goal amount is reached
        if (wishes[wishId].currentAmount >= wishes[wishId].goalAmount) {
            closeWish(wishId);
        }
    }

    // Function to close a wish if it reaches its goal amount
    function closeWish(uint256 wishId) public {
        require(wishId > 0 && wishId <= wishCount, "Wish does not exist.");
        require(!wishes[wishId].isClosed, "Wish is already closed.");

        wishes[wishId].isClosed = true;
        emit WishClosed(wishId);
    }

    // Function to withdraw the funds (only for contract owner or specific permissions)
    function withdraw() public {
        // Add necessary access control here (e.g., only the contract owner can withdraw)
        payable(msg.sender).transfer(address(this).balance);
    }
}
