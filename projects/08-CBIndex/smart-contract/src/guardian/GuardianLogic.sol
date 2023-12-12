// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.19;

import { Initializable } from "openzeppelin/proxy/utils/Initializable.sol";
import { SafeMath } from "openzeppelin/utils/math/SafeMath.sol";
import { ERC20 } from "openzeppelin/token/ERC20/ERC20.sol";
import { SafeERC20 } from "openzeppelin/token/ERC20/utils/SafeERC20.sol";
import { IGlobalShared }from "../utils/IGlobalShared.sol";
import { AddressArrayLib } from "../utils/AddressArrayLib.sol";
import { IGuardianLogic } from "./IGuardianLogic.sol";
import { IVaultLogic } from "../vault/IVaultLogic.sol";
import { IValueEvaluator } from "../value-evaluator/IValueEvaluator.sol";
import { IExtension } from "../extensions/IExtension.sol";
import { IVaultFactory } from "../vault-factory/IVaultFactory.sol";

contract GuardianLogic is IGuardianLogic, Initializable {
    using AddressArrayLib for address[];
    using SafeMath for uint256;
    using SafeERC20 for ERC20;


    event VaultProxySet(address vaultProxy);

    event SharesBought(address indexed buyer, uint256 investmentAmount, uint256 sharesPrev, uint256 sharesReceived);

    event PreRedeemSharesHookFailed(bytes indexed failureReturnData, address indexed redeemer, uint256 sharesAmount);

    event SharesRedeemed(
        address indexed redeemer,
        address indexed recipient,
        uint256 sharesAmount,
        address[] receivedAssets,
        uint256[] receivedAssetAmounts
    );

    // gloabalShared
    address internal _gloabalShared;
    // constants
    uint256 private constant _ONE_HUNDRED_PERCENT = 10000;
    uint256 private constant _SHARES_UNIT = 10 ** 18;
    address private constant _SPECIFIC_ASSET_REDEMPTION_DUMMY_FORFEIT_ADDRESS =
        0x000000000000000000000000000000000000aaaa;
    // Pseudo-constants (can only be set once)
    address internal _denominationAsset;
    address internal _vaultProxy;

    // A reverse-mutex, granting atomic permission for particular contracts to make vault calls
    bool internal _permissionedVaultActionAllowed;
    // A mutex to protect against reentrancy
    bool internal _reentranceLocked;
    // A timelock after the last time shares were bought for an account
    // that must expire before that account transfers or redeems their shares
    uint256 internal _sharesActionTimelock;
    mapping(address => uint256) internal _acctToLastSharesBoughtTimestamp;

    // MODIFIERS

    modifier allowsPermissionedVaultAction() {
        __assertPermissionedVaultActionNotAllowed();
        _permissionedVaultActionAllowed = true;
        _;
        _permissionedVaultActionAllowed = false;
    }

    modifier locksReentrance() {
        __assertNotReentranceLocked();
        _reentranceLocked = true;
        _;
        _reentranceLocked = false;
    }

    modifier onlyVaultFactory() {
        __assertIsVaultFactory();
        _;
    }

    modifier onlyOwner() {
        __assertIsOwner(msg.sender);
        _;
    }

    modifier onlyOwnerNotRelayable() {
        __assertIsOwner(msg.sender);
        _;
    }

    // ASSERTION HELPERS

    function __assertIsVaultFactory() private view {
        require(msg.sender == IGlobalShared(getGlobalShared()).getVaultFactory(), "Only VaultFactory callable");
    }

    function __assertIsOwner(address _who) private view {
        require(_who == IVaultLogic(getVaultProxy()).getOwner(), "Only vault owner callable");
    }

    function __assertNotReentranceLocked() private view {
        require(!_reentranceLocked, "Re-entrance");
    }

    function __assertPermissionedVaultActionNotAllowed() private view {
        require(!_permissionedVaultActionAllowed, "Vault action re-entrance");
    }

    function __assertSharesActionNotTimelocked(address _account) private view {
        uint256 lastSharesBoughtTimestamp = getLastSharesBoughtTimestampForAccount(_account);

        require(
            lastSharesBoughtTimestamp == 0
                || block.timestamp.sub(lastSharesBoughtTimestamp) >= getSharesActionTimelock(),
            "Shares action timelocked"
        );
    }

    /// @notice Calls a specified action on an Extension
    /// @param _extension The Extension contract to call
    /// @param _actionId An ID representing the action to take on the extension (see extension)
    /// @param _callArgs The encoded data for the call
    /// @dev Used to route arbitrary calls, so that msg.sender is the GuardianProxy
    function callOnExtension(address _extension, uint256 _actionId, bytes calldata _callArgs)
        external
        override
        locksReentrance
        allowsPermissionedVaultAction
    {
        require( _extension == IGlobalShared(getGlobalShared()).getIntegrationManager(),"callOnExtension: _extension invalid"
        );

        IExtension(_extension).receiveCallFromGuardian(msg.sender, _actionId, _callArgs);
    }

    // PERMISSIONED VAULT ACTIONS

    /// @notice Makes a permissioned, state-changing call on the VaultProxy contract
    /// @param _action The enum representing the VaultAction to perform on the VaultProxy
    /// @param _actionData The call data for the action to perform
    function permissionedVaultAction(IVaultLogic.VaultAction _action, bytes calldata _actionData) external override {

        // Validate action as needed
        if (_action == IVaultLogic.VaultAction.RemoveTrackedAsset) {
            require(
                abi.decode(_actionData, (address)) != getDenominationAsset(),
                "permissionedVaultAction: Cannot untrack denomination asset"
            );
        }

        IVaultLogic(getVaultProxy()).receiveValidatedVaultAction(_action, _actionData);
    }

    // Ordered by execution in the lifecycle of a vault

    /// @notice Initializes the GuardianProxy state
    /// @param globalShared_ The GlobalShared contract
    /// @param denominationAsset_ The denomination asset
    /// @param sharesActionTimelock_ The timelock after the last time shares were bought for an account
    function initialize(address globalShared_, address denominationAsset_, uint256 sharesActionTimelock_) external initializer {
        _gloabalShared = globalShared_;
        _sharesActionTimelock = sharesActionTimelock_;
        _denominationAsset = denominationAsset_;
    }

    /// @notice set the vault proxy
    /// @param vaultProxy_ The vault proxy
    function setVaultProxy(address vaultProxy_) external onlyVaultFactory {
        require(vaultProxy_ != address(0), "setVaultProxy: _vaultProxy cannot be empty");

        _vaultProxy = vaultProxy_;
        emit VaultProxySet(_vaultProxy);
    }

    /// @notice Runs atomic logic after a GuardianProxy has become its vaultProxy's `accessor` 
    /// @dev No need to assert anything beyond VaultFactory access.
    function activate() external override onlyVaultFactory() {
        address vaultProxyCopy = getVaultProxy();

        IVaultLogic(vaultProxyCopy).addTrackedAsset(getDenominationAsset());
    }

    // ACCOUNTING HELPERS

    /// @notice Calculates the aum of the vault
    /// @return aum_ The vault's aum
    function calcAum() public override view returns (uint256 aum_) {
        address vaultProxyCopy = getVaultProxy();

        address[] memory trackedAssets = IVaultLogic(vaultProxyCopy).getTrackedAssets();

        if (trackedAssets.length == 0 ) {
            return 0;
        }

        uint256[] memory balances = new uint256[](trackedAssets.length);
        for (uint256 i; i < trackedAssets.length; i++) {
            balances[i] = ERC20(trackedAssets[i]).balanceOf(vaultProxyCopy);
        }
        aum_ = IValueEvaluator(IGlobalShared(getGlobalShared()).getValueEvaluator()).calcCanonicalAssetsTotalValue(
            trackedAssets, balances, getDenominationAsset()
        );
        return aum_;
    }

    /// @notice Calculates the gross value of 1 unit of shares in the vault's denomination asset
    /// @return nav_ The amount of the denomination asset per share
    /// @dev Does not account for any fees outstanding.
    function calcNav() external override view returns (uint256 nav_) {
        uint256 aum = calcAum();

        nav_ = __calcNav(
            aum, ERC20(getVaultProxy()).totalSupply(), 10 ** uint256(ERC20(getDenominationAsset()).decimals())
        );

        return nav_;
    }

    
    /// @dev Helper for calculating the net assets value of a vault
    function __calcNav(uint256 _aum, uint256 _sharesSupply, uint256 _denominationAssetUnit)
        private
        pure
        returns (uint256 grossShareValue_)
    {
        if (_sharesSupply == 0) {
            return _denominationAssetUnit;
        }

        return _aum.mul(_SHARES_UNIT).div(_sharesSupply);
    }

    // SHARES ACTIONS

    /// @notice Buy shares
    /// @param _investmentAmount The amount of the denomination asset to invest
    /// @param _minSharesQuantity The minimum quantity of shares to buy
    /// @return sharesReceived_ The quantity of shares received
    function buyShares(uint256 _investmentAmount, uint256 _minSharesQuantity)
        external
        returns (uint256 sharesReceived_)
    {
        address canonicalSender = msg.sender;

        return __buyShares(
            canonicalSender, _investmentAmount, _minSharesQuantity, false, canonicalSender
        );
    }

    /// @dev Helper for buy shares logic
    function __buyShares(
        address _buyer,
        uint256 _investmentAmount,
        uint256 _minSharesQuantity,
        bool _hasSharesActionTimelock,
        address _canonicalSender
    ) private locksReentrance returns (uint256 sharesReceived_) {
        require(_buyer != address(0), "__buyShares: _buyer cannot be empty");
        require(_minSharesQuantity > 0, "__buyShares: _minSharesQuantity must be >0");

        address vaultProxyCopy = getVaultProxy();
        require(
            !_hasSharesActionTimelock,
            "__buyShares: action locked by time lock"
        );

        uint256 aum = calcAum();

        // Transfer the investment asset to the vault.
        // Does not follow the checks-effects-interactions pattern, but it is necessary to
        // do this delta balance calculation before calculating shares to mint.
        uint256 receivedInvestmentAmount = __transferFromWithReceivedAmount(
            getDenominationAsset(), _canonicalSender, vaultProxyCopy, _investmentAmount
        );

        // Calculate the amount of shares to issue with the investment amount
        uint256 sharePrice = __calcNav(
            aum, ERC20(vaultProxyCopy).totalSupply(), 10 ** uint256(ERC20(getDenominationAsset()).decimals())
        );
        uint256 sharesIssued = receivedInvestmentAmount.mul(_SHARES_UNIT).div(sharePrice);

        // Mint shares to the buyer
        uint256 prevBuyerShares = ERC20(vaultProxyCopy).balanceOf(_buyer);
        IVaultLogic(vaultProxyCopy).mintShares(_buyer, sharesIssued);

        require(sharesIssued >= _minSharesQuantity, "__buyShares: Shares received < _minSharesQuantity");

        if (_hasSharesActionTimelock) {
            _acctToLastSharesBoughtTimestamp[_buyer] = block.timestamp;
        }

        emit SharesBought(_buyer, receivedInvestmentAmount, prevBuyerShares, sharesIssued);

        return sharesIssued;
    }

    /// @dev Helper to execute ERC20.transferFrom() while calculating the actual amount received
    function __transferFromWithReceivedAmount(
        address _asset,
        address _sender,
        address _recipient,
        uint256 _transferAmount
    ) private returns (uint256 receivedAmount_) {
        uint256 preTransferRecipientBalance = ERC20(_asset).balanceOf(_recipient);

        ERC20(_asset).safeTransferFrom(_sender, _recipient, _transferAmount);

        return ERC20(_asset).balanceOf(_recipient).sub(preTransferRecipientBalance);
    }

    /// @notice Redeems a specified amount of the sender's shares for specified asset proportions
    /// @param _recipient The account that will receive the specified assets
    /// @param _sharesQuantity The quantity of shares to redeem
    /// @param _payoutAssets The assets to payout
    /// @param _payoutAssetPercentages The percentage of the owed amount to pay out in each asset
    /// @return payoutAmounts_ The amount of each asset paid out to the _recipient
    function redeemSharesForSpecificAssets(
        address _recipient,
        uint256 _sharesQuantity,
        address[] calldata _payoutAssets,
        uint256[] calldata _payoutAssetPercentages
    ) external locksReentrance returns (uint256[] memory payoutAmounts_) {
        address canonicalSender = msg.sender;
        require(_payoutAssets.length == _payoutAssetPercentages.length, "redeemSharesForSpecificAssets: Unequal arrays");
        require(_payoutAssets.isUniqueSet(), "redeemSharesForSpecificAssets: Duplicate payout asset");

        uint256 aum = calcAum();

        IVaultLogic vaultProxyContract = IVaultLogic(getVaultProxy());
        (uint256 sharesToRedeem, uint256 sharesSupply) =
            __redeemSharesSetup(vaultProxyContract, canonicalSender, _sharesQuantity);

        payoutAmounts_ = __payoutSpecifiedAssetPercentages(
            vaultProxyContract,
            _recipient,
            _payoutAssets,
            _payoutAssetPercentages,
            aum.mul(sharesToRedeem).div(sharesSupply)
        );
        
        emit SharesRedeemed(canonicalSender, _recipient, sharesToRedeem, _payoutAssets, payoutAmounts_);

        return payoutAmounts_;
    }

    /// @dev Helper to execute common pre-shares redemption logic
    function __redeemSharesSetup(
        IVaultLogic vaultProxyContract,
        address _redeemer,
        uint256 _sharesQuantityInput
    ) private returns (uint256 sharesToRedeem_, uint256 sharesSupply_) {
        __assertSharesActionNotTimelocked(_redeemer);

        ERC20 sharesContract = ERC20(address(vaultProxyContract));

        uint256 preFeesRedeemerSharesBalance = sharesContract.balanceOf(_redeemer);

        if (_sharesQuantityInput == type(uint256).max) {
            sharesToRedeem_ = preFeesRedeemerSharesBalance;
        } else {
            sharesToRedeem_ = _sharesQuantityInput;
        }
        require(sharesToRedeem_ > 0, "__redeemSharesSetup: No shares to redeem");

        // Update the redemption amount if fees were charged (or accrued) to the redeemer
        uint256 postFeesRedeemerSharesBalance = sharesContract.balanceOf(_redeemer);
        if (_sharesQuantityInput == type(uint256).max) {
            sharesToRedeem_ = postFeesRedeemerSharesBalance;
        } else if (postFeesRedeemerSharesBalance < preFeesRedeemerSharesBalance) {
            sharesToRedeem_ = sharesToRedeem_.sub(preFeesRedeemerSharesBalance.sub(postFeesRedeemerSharesBalance));
        }

        // Destroy the shares after getting the shares supply
        sharesSupply_ = sharesContract.totalSupply();
        vaultProxyContract.burnShares(_redeemer, sharesToRedeem_);

        return (sharesToRedeem_, sharesSupply_);
    }

    /// @dev Helper to payout specified asset percentages during redeemSharesForSpecificAssets()
    function __payoutSpecifiedAssetPercentages(
        IVaultLogic vaultProxyContract,
        address _recipient,
        address[] calldata _payoutAssets,
        uint256[] calldata _payoutAssetPercentages,
        uint256 _owedGav
    ) private returns (uint256[] memory payoutAmounts_) {
        address denominationAssetCopy = getDenominationAsset();
        uint256 percentagesTotal;
        payoutAmounts_ = new uint256[](_payoutAssets.length);
        for (uint256 i; i < _payoutAssets.length; i++) {
            percentagesTotal = percentagesTotal.add(_payoutAssetPercentages[i]);

            // Used to explicitly specify less than 100% in total _payoutAssetPercentages
            if (_payoutAssets[i] == _SPECIFIC_ASSET_REDEMPTION_DUMMY_FORFEIT_ADDRESS) {
                continue;
            }

            payoutAmounts_[i] = IValueEvaluator(IGlobalShared(getGlobalShared()).getValueEvaluator()).calcCanonicalAssetValue(
                denominationAssetCopy,
                _owedGav.mul(_payoutAssetPercentages[i]).div(_ONE_HUNDRED_PERCENT),
                _payoutAssets[i]
            );
            // Guards against corner case of primitive-to-derivative asset conversion that floors to 0,
            // or redeeming a very low shares amount and/or percentage where asset value owed is 0
            require(payoutAmounts_[i] > 0, "__payoutSpecifiedAssetPercentages: Zero amount for asset");

            vaultProxyContract.withdrawAssetTo(_payoutAssets[i], _recipient, payoutAmounts_[i]);
        }

        require(percentagesTotal == _ONE_HUNDRED_PERCENT, "__payoutSpecifiedAssetPercentages: Percents must total 100%");

        return payoutAmounts_;
    }


    // STATE GETTERS

    /// @notice Get the global shared state
    /// @return globalShared_ The global shared state
    function getGlobalShared() public view returns (address globalShared_) {
        return _gloabalShared;
    }

    /// @notice Get the denomination asset
    /// @return denominationAsset_ The denomination asset
    function getDenominationAsset() public view override returns (address denominationAsset_) {
        return _denominationAsset;
    }

    /// @notice Get the vault proxy
    /// @return vaultProxy_ The vault proxy
    function getVaultProxy() public view override returns (address vaultProxy_) {
        return _vaultProxy;
    }

    /// @notice Get the shares action timelock
    /// @return sharesActionTimelock_ The shares action timelock
    function getSharesActionTimelock() public view returns (uint256 sharesActionTimelock_) {
        return _sharesActionTimelock;
    }

    /// @notice Get the last shares bought timestamp for an account
    /// @param account_ The account
    /// @return lastSharesBoughtTimestamp_ The last shares bought timestamp for the account
    function getLastSharesBoughtTimestampForAccount(address account_) public view returns (uint256 lastSharesBoughtTimestamp_) {
        return _acctToLastSharesBoughtTimestamp[account_];
    }
}