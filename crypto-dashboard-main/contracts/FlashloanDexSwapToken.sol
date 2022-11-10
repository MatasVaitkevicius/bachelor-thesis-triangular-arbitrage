// SPDX-License-Identifier: agpl-3.0
pragma solidity 0.6.12;

contract FlashloanDexSwapToken {
    string public name = "Matas Token";
    string public symbol = "MT";

    uint256 public totalSupply = 1000000;

    address public owner;

    mapping(address => uint256) balances;

    constructor() public {
        balances[msg.sender] = totalSupply;
        owner = msg.sender;
    }

    function transfer(address to, uint256 amount) external {
        require(balances[msg.sender] >= amount, "Not enough tokens");

        balances[msg.sender] -= amount;
        balances[to] += amount;
    }

    function balanceOf(address account) external view returns (uint256) {
        return balances[account];
    }
}
