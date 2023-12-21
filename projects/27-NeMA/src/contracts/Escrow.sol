// SPDX-License-Identifier: MIT
pragma solidity >= 0.4.15 < 0.9.0;

contract Escrow {
    address public buyer;
    address public seller;
    address public arbiter; // 可选，可以是一个仲裁者地址
    uint public amount;
    bool public buyerConfirmed;
    bool public sellerConfirmed;

    enum State { Created, BuyerDeposited, SellerNotified, SellerDeposited, BuyerConfirmed, SellerConfirmed, Completed }
    State public state;

    event BuyerDeposited(address indexed buyer, uint amount);
    event SellerNotified(address indexed seller);
    event SellerDeposited(address indexed seller);
    event BuyerConfirmed(address indexed buyer);
    event SellerConfirmed(address indexed seller);
    event Completed(address indexed buyer, address indexed seller);

    modifier onlyBuyer() {
        require(msg.sender == buyer, "Only buyer can call this function");
        _;
    }

    modifier onlySeller() {
        require(msg.sender == seller, "Only seller can call this function");
        _;
    }

    modifier inState(State _state) {
        require(state == _state, "Invalid state");
        _;
    }

    constructor(address _seller, address _arbiter) {
        buyer = msg.sender;
        seller = _seller;
        arbiter = _arbiter;
        state = State.Created;
    }

    function deposit() external payable onlyBuyer inState(State.Created) {
        require(msg.value > 0, "Deposit amount must be greater than 0");
        amount = msg.value;
        state = State.BuyerDeposited;
        emit BuyerDeposited(buyer, amount);
    }

    function notifySeller() external onlyBuyer inState(State.BuyerDeposited) {
        state = State.SellerNotified;
        emit SellerNotified(seller);
    }

    function depositToEscrow() external payable onlySeller inState(State.SellerNotified) {
        require(msg.value == amount, "Deposit amount must match buyer's deposit");
        state = State.SellerDeposited;
        emit SellerDeposited(seller);
    }

    function confirmByBuyer() external onlyBuyer inState(State.SellerDeposited) {
        buyerConfirmed = true;
        emit BuyerConfirmed(buyer);
        checkCompleted();
    }

    function confirmBySeller() external onlySeller inState(State.BuyerConfirmed) {
        sellerConfirmed = true;
        emit SellerConfirmed(seller);
        checkCompleted();
    }

    function checkCompleted() internal {
        if (buyerConfirmed && sellerConfirmed) {
            state = State.Completed;
            emit Completed(buyer, seller);
            // Transfer assets to the seller
            payable(seller).transfer(amount);
        } else if (buyerConfirmed) {
            state = State.BuyerConfirmed;
        }
    }

    function claimByArbiter() external onlySeller inState(State.BuyerConfirmed) {
        // 可选：使用仲裁员实施争议解决机制
        require(arbiter != address(0), "Arbiter address not set");
        state = State.Completed;
        emit Completed(buyer, seller);
        // 将资产转让给卖方
        payable(seller).transfer(amount);
    }

    function refundByArbiter() external onlyBuyer inState(State.SellerDeposited) {
        // 可选：使用仲裁者实施争议解决机制
        require(arbiter != address(0), "Arbiter address not set");
        state = State.Completed;
        emit Completed(buyer, seller);
        // 退还买方
        payable(buyer).transfer(amount);
    }
}
