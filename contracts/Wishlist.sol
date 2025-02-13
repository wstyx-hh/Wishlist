// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Wishlist {
    IERC20 public token;
    address public owner;

    struct WishModel{
        uint256 id;
        string title;
        string description;
        uint256 goalAmount;
        uint256 currentAmount;
        address wisher;
        bool isFundable;
    }

    struct WishFunderModel{
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

    constructor(address _tokenAddress) {
        token = IERC20(_tokenAddress);

        wishes.push(WishModel({
            id: 0,
            title: "Buy a new car",
            description: "I want to buy a new car",
            goalAmount: 100000 * (10 ** 18),
            currentAmount: 0,
            wisher: msg.sender,
            isFundable: true
        }));
    }

    // Регистрирует пользователя
    // function registerUser(string memory _name) public {
    //     require(!isUserAthorized(msg.sender), "User is already authorized");
    //     users[msg.sender] = _name;
    //     emit UserRegistered(msg.sender, _name);
    // }


    // Проверяет авторизован ли пользователь
    // function isUserAuthorized(address account) public view returns(bool){
    //     return (bytes(users[account]).length > 0 ? true : false);
    // }

    function getUsername(address account) public view returns(string memory){
        return users[account];
    }


    // Добавляет желание в список желаний
    function createWish(string memory _title, string memory _description, uint256 _goalAmount) public {
        // require(isUserAuthorized(account), "User is not authorized");
        require(_goalAmount > 0, "Goal amount should be greater than 0");

        wishes.push(WishModel({
            id: wishes.length,
            title: _title,
            description: _description,
            goalAmount: _goalAmount * (10 ** 18),
            currentAmount: 0,
            wisher: msg.sender,
            isFundable: true
        }));

        emit WishCreated(wishes.length - 1, _title, _description, _goalAmount, msg.sender);
    }

    // Сохраняет отправленные деньги в главном счете контракта и сохраняет всех отправителей
    function fundWish(uint256 _wishId, uint256 _amount) public {
        // require(isUserAuthorized(account), "User is not authorized");
        require(_amount > 0, "Amount should be greater than 0");
        require(_wishId > 0 && _wishId < wishes.length, "Invalid wish id");
        require(wishes[_wishId].isFundable, "Wish is not fundable");

        WishModel storage wish = wishes[_wishId];

        token.transferFrom(msg.sender, owner, _amount);
        wish.currentAmount += _amount;
        wishFunders[_wishId].push(WishFunderModel({
            wishId: _wishId,
            funder: msg.sender,
            amount: _amount
        }));


        emit WishFunded(_wishId, wish.title, wish.currentAmount, wish.wisher, msg.sender, _amount);
    }

    // Закрывает желание от сбора денег, но не отправляет деньги юзеру
    // Для отправки денег юзеру, нужно вызвать функцию withdrawFunds
    function closeWish(uint256 _wishId) public{
        // require(isUserAuthorized(account), "User is not authorized");
        WishModel storage wish = wishes[_wishId];
        require(wish.isFundable, "Wish is not fundable to close");
        require(msg.sender == wish.wisher, "You are not the owner of the wish");

        wish.isFundable = false;
        emit WishClosed(_wishId, wish.title, wish.wisher, wish.currentAmount);
    }


    // Отправляет по запросу все желания
    function getWishes() public view returns(WishModel[] memory) {
        return wishes;
    }

    // Юзер закрывает желание и забирает деньги
    function withdrawFunds(uint256 _id) public{
        // require(isUserAuthorized(account), "User is not authorized");
        require(_id > 0 && _id < wishes.length, "Invalid wish id");
        require(msg.sender == wishes[_id].wisher, "You are not the owner of the wish");

        token.transferFrom(owner, msg.sender, wishes[_id].currentAmount);
        wishes[_id].isFundable = false;
        emit WishWithdrawn(_id, wishes[_id].title, msg.sender, wishes[_id].currentAmount);
    }
    

    // Возможность донатеру вернуть деньги
    function refundWish(address account, uint256 _id) public{
        // require(isUserAuthorized(account), "User is not authorized");
        require(_id > 0 && _id < wishes.length, "Invalid wish id");
        require(wishes[_id].isFundable, "Wish is not fundable to refund");

        WishModel storage wish = wishes[_id];
        WishFunderModel[] memory wishFunder = wishFunders[_id];
        for(uint256 i = 0; i < wishFunder.length; i++){
            if(wishFunder[i].funder == account){
                token.transferFrom(owner, msg.sender, wishFunder[i].amount);
                wish.currentAmount -= wishFunder[i].amount;
                emit WishRefunded(_id, wish.title, wish.wisher, msg.sender, wishFunder[i].amount);
            }
        }
    }
}