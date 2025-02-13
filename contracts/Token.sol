// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract WishToken is ERC20 {
    constructor() ERC20 ("WishToken", "WSH"){
        _mint(msg.sender, 10000);
    }

    function balanceOf(address account) public view override returns (uint256) {
        uint256 balance = super.balanceOf(account);
        return balance > 0 ? balance : 0;
    }
}
