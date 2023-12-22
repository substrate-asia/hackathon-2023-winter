// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

contract IWETH9 {
    string public name     = "Wrapped Zeniq";
    string public symbol   = "WZENIQ";
    uint8  public decimals = 18;

    event  Approval(address indexed src, address indexed guy, uint wad);
    event  Transfer(address indexed src, address indexed dst, uint wad);
    event  Deposit(address indexed dst, uint wad);
    event  Withdrawal(address indexed src, uint wad);

    function deposit() public payable {

        emit Deposit(msg.sender, msg.value);
    }
    
}