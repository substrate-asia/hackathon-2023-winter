// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.19;

import { SafeMath } from "openzeppelin/utils/math/SafeMath.sol";

abstract contract SharesTokenBase {
    using SafeMath for uint256;

    event Approval(address indexed owner, address indexed spender, uint256 value);

    event Transfer(address indexed from, address indexed to, uint256 value);

    string internal _sharesName;
    string internal _sharesSymbol;
    uint256 internal _sharesTotalSupply;
    mapping(address => uint256) internal _sharesBalances;
    mapping(address => mapping(address => uint256)) internal _sharesAllowances;

    // EXTERNAL FUNCTIONS

    /// @dev Standard implementation of ERC20's approve(). Can be overridden.
    function approve(address _spender, uint256 _amount) public virtual returns (bool) {
        __approve(msg.sender, _spender, _amount);
        return true;
    }

    /// @dev Standard implementation of ERC20's transfer(). Can be overridden.
    function transfer(address _recipient, uint256 _amount) public virtual returns (bool) {
        __transfer(msg.sender, _recipient, _amount);
        return true;
    }

    /// @dev Standard implementation of ERC20's transferFrom(). Can be overridden.
    function transferFrom(address _sender, address _recipient, uint256 _amount) public virtual returns (bool) {
        __transfer(_sender, _recipient, _amount);
        __approve(
            _sender,
            msg.sender,
            _sharesAllowances[_sender][msg.sender].sub(_amount, "ERC20: transfer amount exceeds allowance")
        );
        return true;
    }

    // EXTERNAL FUNCTIONS - VIEW

    /// @dev Standard implementation of ERC20's allowance(). Can be overridden.
    function allowance(address _owner, address _spender) public view virtual returns (uint256) {
        return _sharesAllowances[_owner][_spender];
    }

    /// @dev Standard implementation of ERC20's balanceOf(). Can be overridden.
    function balanceOf(address _account) public view virtual returns (uint256) {
        return _sharesBalances[_account];
    }

    /// @dev Standard implementation of ERC20's decimals(). Can not be overridden.
    function decimals() public pure returns (uint8) {
        return 18;
    }

    /// @dev Standard implementation of ERC20's name(). Can be overridden.
    function name() public view virtual returns (string memory) {
        return _sharesName;
    }

    /// @dev Standard implementation of ERC20's symbol(). Can be overridden.
    function symbol() public view virtual returns (string memory) {
        return _sharesSymbol;
    }

    /// @dev Standard implementation of ERC20's totalSupply(). Can be overridden.
    function totalSupply() public view virtual returns (uint256) {
        return _sharesTotalSupply;
    }

    // INTERNAL FUNCTIONS

    /// @dev Helper for approve(). Can be overridden.
    function __approve(address _owner, address _spender, uint256 _amount) internal virtual {
        require(_owner != address(0), "ERC20: approve from the zero address");
        require(_spender != address(0), "ERC20: approve to the zero address");

        _sharesAllowances[_owner][_spender] = _amount;
        emit Approval(_owner, _spender, _amount);
    }

    /// @dev Helper to burn tokens from an account. Can be overridden.
    function __burn(address _account, uint256 _amount) internal virtual {
        require(_account != address(0), "ERC20: burn from the zero address");

        _sharesBalances[_account] = _sharesBalances[_account].sub(_amount, "ERC20: burn amount exceeds balance");
        _sharesTotalSupply = _sharesTotalSupply.sub(_amount);
        emit Transfer(_account, address(0), _amount);
    }

    /// @dev Helper to mint tokens to an account. Can be overridden.
    function __mint(address _account, uint256 _amount) internal virtual {
        require(_account != address(0), "ERC20: mint to the zero address");

        _sharesTotalSupply = _sharesTotalSupply.add(_amount);
        _sharesBalances[_account] = _sharesBalances[_account].add(_amount);
        emit Transfer(address(0), _account, _amount);
    }

    /// @dev Helper to transfer tokens between accounts. Can be overridden.
    function __transfer(address _sender, address _recipient, uint256 _amount) internal virtual {
        require(_sender != address(0), "ERC20: transfer from the zero address");
        require(_recipient != address(0), "ERC20: transfer to the zero address");

        _sharesBalances[_sender] = _sharesBalances[_sender].sub(_amount, "ERC20: transfer amount exceeds balance");
        _sharesBalances[_recipient] = _sharesBalances[_recipient].add(_amount);
        emit Transfer(_sender, _recipient, _amount);
    }
}
