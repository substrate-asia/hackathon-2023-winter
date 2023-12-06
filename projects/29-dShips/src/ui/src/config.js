export const ADDRESS = "0x0486c85c1355A23FEDdc67f335674aa55Ba06eF6";
export const ABI = [
  {
    inputs: [
      {
        internalType: "string",
        name: "trackingNumber",
        type: "string",
      },
    ],
    name: "assignCarrier",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "becomeValidCarrier",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "string",
        name: "trackingNumber",
        type: "string",
      },
      {
        indexed: false,
        internalType: "address",
        name: "carrier",
        type: "address",
      },
    ],
    name: "CarrierAssigned",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "trackingNumber",
        type: "string",
      },
      {
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        internalType: "string",
        name: "point",
        type: "string",
      },
      {
        internalType: "string",
        name: "from",
        type: "string",
      },
      {
        internalType: "string",
        name: "deliveryCode",
        type: "string",
      },
    ],
    name: "createShipment",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "string",
        name: "trackingNumber",
        type: "string",
      },
    ],
    name: "Delivered",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "trackingNumber",
        type: "string",
      },
      {
        internalType: "string",
        name: "deliveryCode",
        type: "string",
      },
    ],
    name: "markDelivered",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "trackingNumber",
        type: "string",
      },
    ],
    name: "markPicked",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "trackingNumber",
        type: "string",
      },
    ],
    name: "markUnderway",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "string",
        name: "trackingNumber",
        type: "string",
      },
      {
        indexed: false,
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "recipient",
        type: "address",
      },
    ],
    name: "ShipmentCreated",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "trackingNumber",
        type: "string",
      },
      {
        internalType: "address",
        name: "newCarrier",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getAllShipments",
    outputs: [
      {
        internalType: "string[]",
        name: "",
        type: "string[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "trackingNumber",
        type: "string",
      },
    ],
    name: "getDeliveryCode",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "trackingNumber",
        type: "string",
      },
    ],
    name: "getShipmentDetails",
    outputs: [
      {
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        internalType: "address",
        name: "carrier",
        type: "address",
      },
      {
        internalType: "string",
        name: "point",
        type: "string",
      },
      {
        internalType: "enum TrackingContract.ShipmentState",
        name: "state",
        type: "uint8",
      },
      {
        internalType: "string",
        name: "from",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "isVerifiedCarrier",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "shipmentIds",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    name: "shipments",
    outputs: [
      {
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        internalType: "address",
        name: "carrier",
        type: "address",
      },
      {
        internalType: "string",
        name: "trackingNumber",
        type: "string",
      },
      {
        internalType: "string",
        name: "point",
        type: "string",
      },
      {
        internalType: "enum TrackingContract.ShipmentState",
        name: "state",
        type: "uint8",
      },
      {
        internalType: "string",
        name: "from",
        type: "string",
      },
      {
        internalType: "string",
        name: "deliveryCode",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "validCarriers",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];
