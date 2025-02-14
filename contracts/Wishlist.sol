// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Wishlist {
    address public owner;

    struct WishModel {
        uint256 id;
        string title;
        string description;
        uint256 goalAmount;
        uint256 currentAmount;
        address wisher;
        bool isFundable;
    }

    struct WishFunderModel {
        uint256 wishId;
        address funder;
        uint256 amount;
    }

    WishModel[] public wishes;
    mapping(address => string) public users;
    mapping(uint256 => WishFunderModel[]) wishFunders;

    event WishCreated(uint256 id, string title, string description, uint256 goalAmount, address wisher);
    event WishFunded(uint256 id, string title, uint256 currentAmount, address wisher, address donater, uint256 donationAmount);
    event WishClosed(uint256 id, string title, address wisher, uint256 currentAmount);
    event WishWithdrawn(uint256 id, string title, address wisher, uint256 currentAmount);
    event WishRefunded(uint256 id, string title, address wisher, address donater, uint256 refundAmount);
    event UserRegistered(address user, string name);

    constructor() {
        owner = msg.sender;

        wishes.push(WishModel({
            id: 0,
            title: "Buy a new car",
            description: "I want to buy a new car",
            goalAmount: 100 ether,
            currentAmount: 0,
            wisher: msg.sender,
            isFundable: true
        }));
    }

    function createWish(string memory _title, string memory _description, uint256 _goalAmount) public {
        require(_goalAmount > 0, "Goal amount should be greater than 0");

        wishes.push(WishModel({
            id: wishes.length,
            title: _title,
            description: _description,
            goalAmount: _goalAmount,
            currentAmount: 0,
            wisher: msg.sender,
            isFundable: true
        }));

        emit WishCreated(wishes.length - 1, _title, _description, _goalAmount, msg.sender);
    }

    function fundWish(uint256 _wishId) public payable {
        require(msg.value > 0, "Amount should be greater than 0");
        require(_wishId < wishes.length, "Invalid wish id");
        require(wishes[_wishId].isFundable, "Wish is not fundable");

        WishModel storage wish = wishes[_wishId];
        wish.currentAmount += msg.value;
        wishFunders[_wishId].push(WishFunderModel({
            wishId: _wishId,
            funder: msg.sender,
            amount: msg.value
        }));

        emit WishFunded(_wishId, wish.title, wish.currentAmount, wish.wisher, msg.sender, msg.value);
    }

    function closeWish(uint256 _wishId) public {
        WishModel storage wish = wishes[_wishId];
        require(wish.isFundable, "Wish is not fundable to close");
        require(msg.sender == wish.wisher, "You are not the owner of the wish");

        wish.isFundable = false;
        emit WishClosed(_wishId, wish.title, wish.wisher, wish.currentAmount);
    }

    function withdrawFunds(uint256 _wishId) public {
        WishModel storage wish = wishes[_wishId];
        require(!wish.isFundable, "Wish is still fundable");
        require(msg.sender == wish.wisher, "You are not the owner of the wish");

        uint256 amount = wish.currentAmount;
        wish.currentAmount = 0;
        payable(wish.wisher).transfer(amount);

        emit WishWithdrawn(_wishId, wish.title, wish.wisher, amount);
    }

    function getWish(uint256 _id) public view returns (uint256, string memory, string memory, uint256, uint256, address, bool) {
        require(_id < wishes.length, "Invalid wish id");
        WishModel memory wish = wishes[_id];
        return (wish.id, wish.title, wish.description, wish.goalAmount, wish.currentAmount, wish.wisher, wish.isFundable);
    }

    function getWishes() public view returns (WishModel[] memory) {
        return wishes;
    }

    function getWishCount() public view returns (uint256) {
        return wishes.length;
    }

    function refundWish(uint256 _wishId) public {
        require(_wishId < wishes.length, "Invalid wish id");
        require(wishes[_wishId].isFundable, "Wish is not fundable to refund");

        WishModel storage wish = wishes[_wishId];
        WishFunderModel[] storage wishFunder = wishFunders[_wishId];
        for (uint256 i = 0; i < wishFunder.length; i++) {
            if (wishFunder[i].funder == msg.sender) {
                uint256 amount = wishFunder[i].amount;
                wish.currentAmount -= amount;
                payable(msg.sender).transfer(amount);
                emit WishRefunded(_wishId, wish.title, wish.wisher, msg.sender, amount);
            }
        }
    }
}