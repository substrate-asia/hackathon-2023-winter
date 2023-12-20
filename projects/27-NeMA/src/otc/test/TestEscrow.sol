// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Escrow.sol";

contract TestEscrow {

    Escrow escrow;
    address buyer = address(0x01);
    address seller = address(0x02);
    address arbiter = address(0x03);

    function beforeEach() public {
        escrow = new Escrow(seller, arbiter);
    }

    function testBuyerDeposits() public {
        Assert.equal(address(escrow).balance, 0, "Initial balance should be 0");

        escrow.deposit{value: 10}();
        Assert.equal(address(escrow).balance, 10, "Balance should be 10 after buyer deposit");

        Assert.equal(escrow.amount(), 10, "Escrow amount should be 10");
        Assert.equal(escrow.state(), uint(Escrow.State.BuyerDeposited), "State should be BuyerDeposited");
    }

    function testNotifySeller() public {
        escrow.deposit{value: 10}();
        escrow.notifySeller();

        Assert.equal(escrow.state(), uint(Escrow.State.SellerNotified), "State should be SellerNotified");
    }

    function testSellerDeposits() public {
        escrow.deposit{value: 10}();
        escrow.notifySeller();
        escrow.depositToEscrow{value: 10}();

        Assert.equal(escrow.state(), uint(Escrow.State.SellerDeposited), "State should be SellerDeposited");
    }

    function testConfirmByBuyer() public {
        escrow.deposit{value: 10}();
        escrow.notifySeller();
        escrow.depositToEscrow{value: 10}();
        escrow.confirmByBuyer();

        Assert.equal(escrow.state(), uint(Escrow.State.BuyerConfirmed), "State should be BuyerConfirmed");
        Assert.equal(escrow.buyerConfirmed(), true, "BuyerConfirmed should be true");
    }

    function testConfirmBySeller() public {
        escrow.deposit{value: 10}();
        escrow.notifySeller();
        escrow.depositToEscrow{value: 10}();
        escrow.confirmByBuyer();
        escrow.confirmBySeller();

        Assert.equal(escrow.state(), uint(Escrow.State.Completed), "State should be Completed");
        Assert.equal(address(escrow).balance, 0, "Balance should be 0 after completion");
        Assert.equal(escrow.sellerConfirmed(), true, "SellerConfirmed should be true");
    }

    function testClaimByArbiter() public {
        escrow.deposit{value: 10}();
        escrow.notifySeller();
        escrow.depositToEscrow{value: 10}();
        escrow.confirmByBuyer();
        escrow.claimByArbiter();

        Assert.equal(escrow.state(), uint(Escrow.State.Completed), "State should be Completed");
        Assert.equal(address(escrow).balance, 0, "Balance should be 0 after completion");
    }

    function testRefundByArbiter() public {
        escrow.deposit{value: 10}();
        escrow.notifySeller();
        escrow.depositToEscrow{value: 10}();
        escrow.refundByArbiter();

        Assert.equal(escrow.state(), uint(Escrow.State.Completed), "State should be Completed");
        Assert.equal(address(escrow).balance, 0, "Balance should be 0 after completion");
    }
}
