// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@upgradeable/contracts/access/OwnableUpgradeable.sol";
import "@upgradeable/contracts/proxy/utils/Initializable.sol";
import "@upgradeable/contracts/token/ERC20/ERC20Upgradeable.sol";



contract QuotaToken is ERC20Upgradeable, OwnableUpgradeable{

    address public fundsFactory;
    uint256 public openInvestimentTimestamp;

    constructor() {
        _disableInitializers();
    }

    function initialize(string calldata _symbol, address _minter, uint256 _openInvestiments)  
     initializer public {
        __ERC20_init(_symbol, _symbol); 
        // __Ownable_init(); --- not sure if this is needed
        fundsFactory = _minter;
        openInvestimentTimestamp = _openInvestiments;
    }

    function mint(address _to, uint256 _amount) public {
        require(msg.sender == fundsFactory, "You are not alowed to mint");
        _mint(_to, _amount);
    }

    function burn(uint256 _amount) public {
        require(msg.sender == fundsFactory, "You are not alowed to burn");
        _burn(msg.sender, _amount);
    }

    function _msgData() internal view virtual override  returns (bytes calldata){
        return msg.data;
    }

    function _msgSender()  internal view virtual override  returns (address sender){
        return msg.sender;
    }
}