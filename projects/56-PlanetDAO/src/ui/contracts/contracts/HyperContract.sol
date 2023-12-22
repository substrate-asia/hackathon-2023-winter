// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity >=0.6.11;
import "./precompiles/InterchainAccountRouter.sol";
import "./precompiles/InterchainGasPaymaster.sol";
import {CallLib} from "./precompiles/libs/Call.sol";

contract HyperContract {
    bytes32 public lastMessageID ;
    function sendTransaction(
        uint32 ethereumDomain,
        address routerAddress,
        address toAddress,
        uint256 value,
        bytes memory data
    ) public {
        IInterchainAccountRouter router = IInterchainAccountRouter(
            routerAddress
        );
        lastMessageID = router.callRemote(
            ethereumDomain,
            (toAddress),
            value,
            data
        );
    }

 function processMessage(
        uint32 ethereumDomain,
        address igpAddress,
        uint256 gasAmount
    ) public payable {
      
        // The testnet DefaultIsmInterchainGasPaymaster
        IInterchainGasPaymaster igp = IInterchainGasPaymaster(igpAddress);
        igp.payForGas{value: msg.value}(
            // The ID of the message
            lastMessageID,
            // Destination domain
            ethereumDomain,
            // The total gas amount. This should be the
            // overhead gas amount + gas used by the call being made
            gasAmount,
            // Refund the msg.sender
            msg.sender
        );
    }

    
}
