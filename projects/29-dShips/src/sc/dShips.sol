// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

contract TrackingContract {

    enum ShipmentState { unassigned, assigned, picked, underway, delivered, canceled }

    struct Shipment {
        address sender;
        address recipient;
        address carrier;
        string trackingNumber;
        string point;
        ShipmentState state;
        string from;
         string deliveryCode;
    }

    mapping(string => Shipment) public shipments;
    mapping(address => bool) public validCarriers;
    string[] public shipmentIds;

    event ShipmentCreated(string trackingNumber, address sender, address recipient);
    event CarrierAssigned(string trackingNumber, address carrier);
    event Delivered(string trackingNumber);

    modifier onlyCarrier(string memory trackingNumber) {
        require(validCarriers[msg.sender], "You are not a valid carrier");
        require(shipments[trackingNumber].carrier == msg.sender, "You are not the carrier");
        _;
    }

    modifier onlyReceiver(string memory trackingNumber) {
        require(msg.sender == shipments[trackingNumber].recipient, "Only the receiver can access the delivery code.");
        _;
    }

    function isVerifiedCarrier() public view returns (bool) {
        return validCarriers[msg.sender];
    }

    function becomeValidCarrier() payable public {
        validCarriers[msg.sender] = true;
    }

    function createShipment(string memory trackingNumber, address recipient, string memory point, string memory from, string memory deliveryCode) external {
        require(shipments[trackingNumber].sender == address(0), "Existing shipment");
        address sender = msg.sender;
        shipments[trackingNumber] = Shipment(sender, recipient, address(0), trackingNumber, point, ShipmentState.unassigned, from, deliveryCode);
        shipmentIds.push(trackingNumber);
        emit ShipmentCreated(trackingNumber, sender, recipient);
    }

    function assignCarrier(string memory trackingNumber) public {
        Shipment storage shipment = shipments[trackingNumber];
        require(shipment.carrier == address(0), "The ship have a carrier.");
        require(validCarriers[msg.sender], "You are not a valid carrier.");
        shipment.carrier = msg.sender;
        shipment.state = ShipmentState.assigned;
    }

    function markPicked(string memory trackingNumber) public onlyCarrier(trackingNumber){
        Shipment storage shipment = shipments[trackingNumber];
        shipment.state = ShipmentState.picked;
    }

    function transferOwnership(string memory trackingNumber, address newCarrier) public onlyCarrier(trackingNumber){
        Shipment storage shipment = shipments[trackingNumber];
        require(shipment.state != ShipmentState.delivered, "The ship is delivered.");
        shipment.carrier = newCarrier;
    }

    function markUnderway(string memory trackingNumber) public onlyCarrier(trackingNumber){
        Shipment storage shipment = shipments[trackingNumber];
        require(shipment.state == ShipmentState.picked, "The shipment isn't 'assigned'");
        shipment.state = ShipmentState.underway;
    }

    function markDelivered(string memory trackingNumber, string memory deliveryCode) public onlyCarrier(trackingNumber) {
        Shipment storage shipment = shipments[trackingNumber];
        require(keccak256(bytes(deliveryCode)) == keccak256(bytes(shipment.deliveryCode)), "Incorrect delivery code.");
        shipment.state = ShipmentState.delivered;
    }
    
    function getDeliveryCode(string memory trackingNumber) public onlyReceiver(trackingNumber) view returns (string memory) {
        Shipment storage shipment = shipments[trackingNumber];
        return shipment.deliveryCode;
    }

    function getShipmentDetails(string memory trackingNumber) public view returns (
        address sender,
        address recipient,
        address carrier,
        string memory point,
        ShipmentState state,
        string memory from
    ) {
        Shipment storage shipment = shipments[trackingNumber];
        return (
            shipment.sender,
            shipment.recipient,
            shipment.carrier,
            shipment.point,
            shipment.state,
            shipment.from
        );
    }

    function getAllShipments() public view returns (string[] memory) {
        return shipmentIds;
    }

}