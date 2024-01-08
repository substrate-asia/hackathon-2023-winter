// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


import "./OFTToken.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";


contract MultiChainToken is OFTToken {

    constructor(uint256 _initialSupply, address _lzEndpoint)
        OFTToken("Whale Finance Token", "WHALE", _lzEndpoint)
        Ownable(msg.sender)
    {
        _mint(msg.sender, _initialSupply);
    }

    function decimals() public view virtual override returns (uint8) {
        return 18;
    }

    function mint(address _to, uint256 _amount) public {
        _mint(_to, _amount);
    }

    // The functions below are overrides required by Solidity

}