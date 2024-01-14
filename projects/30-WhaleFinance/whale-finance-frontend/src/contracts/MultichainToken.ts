const MultichainToken = {
    "abi": [
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "_initialSupply",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "_lzEndpoint",
            "type": "address"
          }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "spender",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "allowance",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "needed",
            "type": "uint256"
          }
        ],
        "name": "ERC20InsufficientAllowance",
        "type": "error"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "sender",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "balance",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "needed",
            "type": "uint256"
          }
        ],
        "name": "ERC20InsufficientBalance",
        "type": "error"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "approver",
            "type": "address"
          }
        ],
        "name": "ERC20InvalidApprover",
        "type": "error"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "receiver",
            "type": "address"
          }
        ],
        "name": "ERC20InvalidReceiver",
        "type": "error"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "sender",
            "type": "address"
          }
        ],
        "name": "ERC20InvalidSender",
        "type": "error"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "spender",
            "type": "address"
          }
        ],
        "name": "ERC20InvalidSpender",
        "type": "error"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "owner",
            "type": "address"
          }
        ],
        "name": "OwnableInvalidOwner",
        "type": "error"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "account",
            "type": "address"
          }
        ],
        "name": "OwnableUnauthorizedAccount",
        "type": "error"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "owner",
            "type": "address"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "spender",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "value",
            "type": "uint256"
          }
        ],
        "name": "Approval",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "internalType": "uint16",
            "name": "_srcChainId",
            "type": "uint16"
          },
          {
            "indexed": false,
            "internalType": "bytes",
            "name": "_srcAddress",
            "type": "bytes"
          },
          {
            "indexed": false,
            "internalType": "uint64",
            "name": "_nonce",
            "type": "uint64"
          },
          {
            "indexed": false,
            "internalType": "bytes",
            "name": "_payload",
            "type": "bytes"
          },
          {
            "indexed": false,
            "internalType": "bytes",
            "name": "_reason",
            "type": "bytes"
          }
        ],
        "name": "MessageFailed",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "previousOwner",
            "type": "address"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "newOwner",
            "type": "address"
          }
        ],
        "name": "OwnershipTransferred",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "uint16",
            "name": "_srcChainId",
            "type": "uint16"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "_to",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "_amount",
            "type": "uint256"
          }
        ],
        "name": "ReceiveFromChain",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "internalType": "uint16",
            "name": "_srcChainId",
            "type": "uint16"
          },
          {
            "indexed": false,
            "internalType": "bytes",
            "name": "_srcAddress",
            "type": "bytes"
          },
          {
            "indexed": false,
            "internalType": "uint64",
            "name": "_nonce",
            "type": "uint64"
          },
          {
            "indexed": false,
            "internalType": "bytes32",
            "name": "_payloadHash",
            "type": "bytes32"
          }
        ],
        "name": "RetryMessageSuccess",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "uint16",
            "name": "_dstChainId",
            "type": "uint16"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "_from",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "bytes",
            "name": "_toAddress",
            "type": "bytes"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "_amount",
            "type": "uint256"
          }
        ],
        "name": "SendToChain",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "internalType": "uint16",
            "name": "_dstChainId",
            "type": "uint16"
          },
          {
            "indexed": false,
            "internalType": "uint16",
            "name": "_type",
            "type": "uint16"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "_minDstGas",
            "type": "uint256"
          }
        ],
        "name": "SetMinDstGas",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "internalType": "address",
            "name": "precrime",
            "type": "address"
          }
        ],
        "name": "SetPrecrime",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "internalType": "uint16",
            "name": "_remoteChainId",
            "type": "uint16"
          },
          {
            "indexed": false,
            "internalType": "bytes",
            "name": "_path",
            "type": "bytes"
          }
        ],
        "name": "SetTrustedRemote",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "internalType": "uint16",
            "name": "_remoteChainId",
            "type": "uint16"
          },
          {
            "indexed": false,
            "internalType": "bytes",
            "name": "_remoteAddress",
            "type": "bytes"
          }
        ],
        "name": "SetTrustedRemoteAddress",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "internalType": "bool",
            "name": "_useCustomAdapterParams",
            "type": "bool"
          }
        ],
        "name": "SetUseCustomAdapterParams",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "from",
            "type": "address"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "to",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "value",
            "type": "uint256"
          }
        ],
        "name": "Transfer",
        "type": "event"
      },
      {
        "inputs": [],
        "name": "DEFAULT_PAYLOAD_SIZE_LIMIT",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "NO_EXTRA_GAS",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "PT_SEND",
        "outputs": [
          {
            "internalType": "uint16",
            "name": "",
            "type": "uint16"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "owner",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "spender",
            "type": "address"
          }
        ],
        "name": "allowance",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "spender",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "value",
            "type": "uint256"
          }
        ],
        "name": "approve",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "account",
            "type": "address"
          }
        ],
        "name": "balanceOf",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "circulatingSupply",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "_chainId",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "_to",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "_amount",
            "type": "uint256"
          }
        ],
        "name": "credit",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "_chainId",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "_amount",
            "type": "uint256"
          }
        ],
        "name": "debitFromChain",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "decimals",
        "outputs": [
          {
            "internalType": "uint8",
            "name": "",
            "type": "uint8"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint16",
            "name": "_dstChainId",
            "type": "uint16"
          },
          {
            "internalType": "bytes",
            "name": "_toAddress",
            "type": "bytes"
          },
          {
            "internalType": "uint256",
            "name": "_amount",
            "type": "uint256"
          },
          {
            "internalType": "bool",
            "name": "_useZro",
            "type": "bool"
          },
          {
            "internalType": "bytes",
            "name": "_adapterParams",
            "type": "bytes"
          }
        ],
        "name": "estimateSendFee",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "nativeFee",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "zroFee",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint16",
            "name": "",
            "type": "uint16"
          },
          {
            "internalType": "bytes",
            "name": "",
            "type": "bytes"
          },
          {
            "internalType": "uint64",
            "name": "",
            "type": "uint64"
          }
        ],
        "name": "failedMessages",
        "outputs": [
          {
            "internalType": "bytes32",
            "name": "",
            "type": "bytes32"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint16",
            "name": "_srcChainId",
            "type": "uint16"
          },
          {
            "internalType": "bytes",
            "name": "_srcAddress",
            "type": "bytes"
          }
        ],
        "name": "forceResumeReceive",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint16",
            "name": "_version",
            "type": "uint16"
          },
          {
            "internalType": "uint16",
            "name": "_chainId",
            "type": "uint16"
          },
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "_configType",
            "type": "uint256"
          }
        ],
        "name": "getConfig",
        "outputs": [
          {
            "internalType": "bytes",
            "name": "",
            "type": "bytes"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint16",
            "name": "_remoteChainId",
            "type": "uint16"
          }
        ],
        "name": "getTrustedRemoteAddress",
        "outputs": [
          {
            "internalType": "bytes",
            "name": "",
            "type": "bytes"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint16",
            "name": "_srcChainId",
            "type": "uint16"
          },
          {
            "internalType": "bytes",
            "name": "_srcAddress",
            "type": "bytes"
          }
        ],
        "name": "isTrustedRemote",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "lzEndpoint",
        "outputs": [
          {
            "internalType": "contract ILayerZeroEndpoint",
            "name": "",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint16",
            "name": "_srcChainId",
            "type": "uint16"
          },
          {
            "internalType": "bytes",
            "name": "_srcAddress",
            "type": "bytes"
          },
          {
            "internalType": "uint64",
            "name": "_nonce",
            "type": "uint64"
          },
          {
            "internalType": "bytes",
            "name": "_payload",
            "type": "bytes"
          }
        ],
        "name": "lzReceive",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint16",
            "name": "",
            "type": "uint16"
          },
          {
            "internalType": "uint16",
            "name": "",
            "type": "uint16"
          }
        ],
        "name": "minDstGasLookup",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "_to",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "_amount",
            "type": "uint256"
          }
        ],
        "name": "mint",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "name",
        "outputs": [
          {
            "internalType": "string",
            "name": "",
            "type": "string"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint16",
            "name": "_srcChainId",
            "type": "uint16"
          },
          {
            "internalType": "bytes",
            "name": "_srcAddress",
            "type": "bytes"
          },
          {
            "internalType": "uint64",
            "name": "_nonce",
            "type": "uint64"
          },
          {
            "internalType": "bytes",
            "name": "_payload",
            "type": "bytes"
          }
        ],
        "name": "nonblockingLzReceive",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "owner",
        "outputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint16",
            "name": "",
            "type": "uint16"
          }
        ],
        "name": "payloadSizeLimitLookup",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "precrime",
        "outputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "renounceOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint16",
            "name": "_srcChainId",
            "type": "uint16"
          },
          {
            "internalType": "bytes",
            "name": "_srcAddress",
            "type": "bytes"
          },
          {
            "internalType": "uint64",
            "name": "_nonce",
            "type": "uint64"
          },
          {
            "internalType": "bytes",
            "name": "_payload",
            "type": "bytes"
          }
        ],
        "name": "retryMessage",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "_from",
            "type": "address"
          },
          {
            "internalType": "uint16",
            "name": "_dstChainId",
            "type": "uint16"
          },
          {
            "internalType": "bytes",
            "name": "_toAddress",
            "type": "bytes"
          },
          {
            "internalType": "uint256",
            "name": "_amount",
            "type": "uint256"
          },
          {
            "internalType": "address payable",
            "name": "_refundAddress",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "_zroPaymentAddress",
            "type": "address"
          },
          {
            "internalType": "bytes",
            "name": "_adapterParams",
            "type": "bytes"
          }
        ],
        "name": "sendFrom",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint16",
            "name": "_version",
            "type": "uint16"
          },
          {
            "internalType": "uint16",
            "name": "_chainId",
            "type": "uint16"
          },
          {
            "internalType": "uint256",
            "name": "_configType",
            "type": "uint256"
          },
          {
            "internalType": "bytes",
            "name": "_config",
            "type": "bytes"
          }
        ],
        "name": "setConfig",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint16",
            "name": "_dstChainId",
            "type": "uint16"
          },
          {
            "internalType": "uint16",
            "name": "_packetType",
            "type": "uint16"
          },
          {
            "internalType": "uint256",
            "name": "_minGas",
            "type": "uint256"
          }
        ],
        "name": "setMinDstGas",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint16",
            "name": "_dstChainId",
            "type": "uint16"
          },
          {
            "internalType": "uint256",
            "name": "_size",
            "type": "uint256"
          }
        ],
        "name": "setPayloadSizeLimit",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "_precrime",
            "type": "address"
          }
        ],
        "name": "setPrecrime",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint16",
            "name": "_version",
            "type": "uint16"
          }
        ],
        "name": "setReceiveVersion",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint16",
            "name": "_version",
            "type": "uint16"
          }
        ],
        "name": "setSendVersion",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint16",
            "name": "_remoteChainId",
            "type": "uint16"
          },
          {
            "internalType": "bytes",
            "name": "_path",
            "type": "bytes"
          }
        ],
        "name": "setTrustedRemote",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint16",
            "name": "_remoteChainId",
            "type": "uint16"
          },
          {
            "internalType": "bytes",
            "name": "_remoteAddress",
            "type": "bytes"
          }
        ],
        "name": "setTrustedRemoteAddress",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "bool",
            "name": "_useCustomAdapterParams",
            "type": "bool"
          }
        ],
        "name": "setUseCustomAdapterParams",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "bytes4",
            "name": "interfaceId",
            "type": "bytes4"
          }
        ],
        "name": "supportsInterface",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "symbol",
        "outputs": [
          {
            "internalType": "string",
            "name": "",
            "type": "string"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "token",
        "outputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "totalSupply",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "to",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "value",
            "type": "uint256"
          }
        ],
        "name": "transfer",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "from",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "to",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "value",
            "type": "uint256"
          }
        ],
        "name": "transferFrom",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "newOwner",
            "type": "address"
          }
        ],
        "name": "transferOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint16",
            "name": "",
            "type": "uint16"
          }
        ],
        "name": "trustedRemoteLookup",
        "outputs": [
          {
            "internalType": "bytes",
            "name": "",
            "type": "bytes"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "useCustomAdapterParams",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      }
    ],
    "bytecode": {
      "object": "0x60a06040523480156200001157600080fd5b50604051620037b3380380620037b38339810160408190526200003491620002cc565b604080518082018252601381527f5768616c652046696e616e636520546f6b656e00000000000000000000000000602080830191909152825180840190935260058352645748414c4560d81b90830152908282828280803380620000b357604051631e4fbdf760e01b8152600060048201526024015b60405180910390fd5b620000be816200010b565b506001600160a01b031660805250600a9050620000dc8382620003b0565b50600b620000eb8282620003b0565b5050505050506200010333836200015b60201b60201c565b5050620004a4565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b6001600160a01b038216620001875760405163ec442f0560e01b815260006004820152602401620000aa565b620001956000838362000199565b5050565b6001600160a01b038316620001c8578060096000828254620001bc91906200047c565b909155506200023c9050565b6001600160a01b038316600090815260076020526040902054818110156200021d5760405163391434e360e21b81526001600160a01b03851660048201526024810182905260448101839052606401620000aa565b6001600160a01b03841660009081526007602052604090209082900390555b6001600160a01b0382166200025a5760098054829003905562000279565b6001600160a01b03821660009081526007602052604090208054820190555b816001600160a01b0316836001600160a01b03167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef83604051620002bf91815260200190565b60405180910390a3505050565b60008060408385031215620002e057600080fd5b825160208401519092506001600160a01b03811681146200030057600080fd5b809150509250929050565b634e487b7160e01b600052604160045260246000fd5b600181811c908216806200033657607f821691505b6020821081036200035757634e487b7160e01b600052602260045260246000fd5b50919050565b601f821115620003ab57600081815260208120601f850160051c81016020861015620003865750805b601f850160051c820191505b81811015620003a75782815560010162000392565b5050505b505050565b81516001600160401b03811115620003cc57620003cc6200030b565b620003e481620003dd845462000321565b846200035d565b602080601f8311600181146200041c5760008415620004035750858301515b600019600386901b1c1916600185901b178555620003a7565b600085815260208120601f198616915b828110156200044d578886015182559484019460019091019084016200042c565b50858210156200046c5787850151600019600388901b60f8161c191681555b5050505050600190811b01905550565b808201808211156200049e57634e487b7160e01b600052601160045260246000fd5b92915050565b6080516132bb620004f8600039600081816106e7015281816108c801528181610be701528181610ca701528181610d4501528181610ece015281816113cc015281816117fa01526121e801526132bb6000f3fe60806040526004361061027c5760003560e01c80638cfd8f5c1161014f578063c4461834116100c1578063eab45d9c1161007a578063eab45d9c14610818578063eb8d72b714610838578063ed629c5c14610858578063f2fde38b14610872578063f5ecbdbc14610892578063fc0c546a146108b257600080fd5b8063c446183414610749578063cbed8b9c1461075f578063d1deba1f1461077f578063dc396e5b14610792578063dd62ed3e146107b2578063df2a5b3b146107f857600080fd5b80639f38369a116101135780639f38369a14610675578063a6c3d16514610695578063a9059cbb146106b5578063b353aaa7146106d5578063baf3292d14610709578063c3e806d21461072957600080fd5b80638cfd8f5c146105c15780638da5cb5b146105f95780639358928b1461062b578063950c8a741461064057806395d89b411461066057600080fd5b80633d8b38f6116101f357806351905636116101ac57806351905636146104d45780635b8c41e6146104e757806366ad5c8a1461053657806370a0823114610556578063715018a61461058c5780637533d788146105a157600080fd5b80633d8b38f61461040a5780633f1f4fa41461042a57806340c10f191461045757806342d65a8d1461047757806344770515146104975780634c42899a146104ac57600080fd5b80630df37483116102455780630df374831461033a57806310ddb1371461035a57806318160ddd1461037a57806323b872dd146103995780632a205e3d146103b9578063313ce567146103ee57600080fd5b80621d35671461028157806301ffc9a7146102a357806306fdde03146102d857806307e0db17146102fa578063095ea7b31461031a575b600080fd5b34801561028d57600080fd5b506102a161029c36600461259f565b6108c5565b005b3480156102af57600080fd5b506102c36102be366004612634565b610af6565b60405190151581526020015b60405180910390f35b3480156102e457600080fd5b506102ed610b34565b6040516102cf91906126ae565b34801561030657600080fd5b506102a16103153660046126c1565b610bc6565b34801561032657600080fd5b506102c36103353660046126f3565b610c4f565b34801561034657600080fd5b506102a161035536600461271f565b610c67565b34801561036657600080fd5b506102a16103753660046126c1565b610c86565b34801561038657600080fd5b506009545b6040519081526020016102cf565b3480156103a557600080fd5b506102c36103b436600461273d565b610cde565b3480156103c557600080fd5b506103d96103d436600461278e565b610d02565b604080519283526020830191909152016102cf565b3480156103fa57600080fd5b50604051601281526020016102cf565b34801561041657600080fd5b506102c361042536600461282d565b610dd5565b34801561043657600080fd5b5061038b6104453660046126c1565b60036020526000908152604090205481565b34801561046357600080fd5b506102a16104723660046126f3565b610ea1565b34801561048357600080fd5b506102a161049236600461282d565b610eaf565b3480156104a357600080fd5b5061038b600081565b3480156104b857600080fd5b506104c1600081565b60405161ffff90911681526020016102cf565b6102a16104e2366004612881565b610f35565b3480156104f357600080fd5b5061038b6105023660046129b7565b6005602090815260009384526040808520845180860184018051928152908401958401959095209452929052825290205481565b34801561054257600080fd5b506102a161055136600461259f565b610fba565b34801561056257600080fd5b5061038b610571366004612a59565b6001600160a01b031660009081526007602052604090205490565b34801561059857600080fd5b506102a1611096565b3480156105ad57600080fd5b506102ed6105bc3660046126c1565b6110aa565b3480156105cd57600080fd5b5061038b6105dc366004612a76565b600260209081526000928352604080842090915290825290205481565b34801561060557600080fd5b506000546001600160a01b03165b6040516001600160a01b0390911681526020016102cf565b34801561063757600080fd5b5061038b611144565b34801561064c57600080fd5b50600454610613906001600160a01b031681565b34801561066c57600080fd5b506102ed611154565b34801561068157600080fd5b506102ed6106903660046126c1565b611163565b3480156106a157600080fd5b506102a16106b036600461282d565b611279565b3480156106c157600080fd5b506102c36106d03660046126f3565b611302565b3480156106e157600080fd5b506106137f000000000000000000000000000000000000000000000000000000000000000081565b34801561071557600080fd5b506102a1610724366004612a59565b611310565b34801561073557600080fd5b506102a1610744366004612aaf565b61136d565b34801561075557600080fd5b5061038b61271081565b34801561076b57600080fd5b506102a161077a366004612ad1565b6113ad565b6102a161078d36600461259f565b611437565b34801561079e57600080fd5b506102a16107ad366004612b43565b61164d565b3480156107be57600080fd5b5061038b6107cd366004612b6a565b6001600160a01b03918216600090815260086020908152604080832093909416825291909152205490565b34801561080457600080fd5b506102a1610813366004612b98565b61167e565b34801561082457600080fd5b506102a1610833366004612bc8565b6116e8565b34801561084457600080fd5b506102a161085336600461282d565b611731565b34801561086457600080fd5b506006546102c39060ff1681565b34801561087e57600080fd5b506102a161088d366004612a59565b61178b565b34801561089e57600080fd5b506102ed6108ad366004612be3565b6117c9565b3480156108be57600080fd5b5030610613565b337f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316146109425760405162461bcd60e51b815260206004820152601e60248201527f4c7a4170703a20696e76616c696420656e64706f696e742063616c6c6572000060448201526064015b60405180910390fd5b61ffff86166000908152600160205260408120805461096090612c34565b80601f016020809104026020016040519081016040528092919081815260200182805461098c90612c34565b80156109d95780601f106109ae576101008083540402835291602001916109d9565b820191906000526020600020905b8154815290600101906020018083116109bc57829003601f168201915b505050505090508051868690501480156109f4575060008151115b8015610a1c575080516020820120604051610a129088908890612c6e565b6040518091039020145b610a775760405162461bcd60e51b815260206004820152602660248201527f4c7a4170703a20696e76616c696420736f757263652073656e64696e6720636f6044820152651b9d1c9858dd60d21b6064820152608401610939565b610aed8787878080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525050604080516020601f8a018190048102820181019092528881528a93509150889088908190840183828082843760009201919091525061187a92505050565b50505050505050565b60006001600160e01b031982161580610b1f57506001600160e01b031982166336372b0760e01b145b80610b2e5750610b2e826118f3565b92915050565b6060600a8054610b4390612c34565b80601f0160208091040260200160405190810160405280929190818152602001828054610b6f90612c34565b8015610bbc5780601f10610b9157610100808354040283529160200191610bbc565b820191906000526020600020905b815481529060010190602001808311610b9f57829003601f168201915b5050505050905090565b610bce611928565b6040516307e0db1760e01b815261ffff821660048201527f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316906307e0db17906024015b600060405180830381600087803b158015610c3457600080fd5b505af1158015610c48573d6000803e3d6000fd5b5050505050565b600033610c5d818585611955565b5060019392505050565b610c6f611928565b61ffff909116600090815260036020526040902055565b610c8e611928565b6040516310ddb13760e01b815261ffff821660048201527f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316906310ddb13790602401610c1a565b600033610cec858285611962565b610cf78585856119da565b506001949350505050565b600080600080898989604051602001610d1e9493929190612ca7565b60408051601f198184030181529082905263040a7bb160e41b825291506001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016906340a7bb1090610d84908d90309086908c908c908c90600401612cd6565b6040805180830381865afa158015610da0573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610dc49190612d2c565b925092505097509795505050505050565b61ffff831660009081526001602052604081208054829190610df690612c34565b80601f0160208091040260200160405190810160405280929190818152602001828054610e2290612c34565b8015610e6f5780601f10610e4457610100808354040283529160200191610e6f565b820191906000526020600020905b815481529060010190602001808311610e5257829003601f168201915b505050505090508383604051610e86929190612c6e565b60405180910390208180519060200120149150509392505050565b610eab8282611a39565b5050565b610eb7611928565b6040516342d65a8d60e01b81526001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016906342d65a8d90610f0790869086908690600401612d50565b600060405180830381600087803b158015610f2157600080fd5b505af1158015610aed573d6000803e3d6000fd5b610faf898989898080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525050604080516020601f8a018190048102820181019092528881528c93508b92508a918a908a9081908401838280828437600092019190915250611a6f92505050565b505050505050505050565b3330146110185760405162461bcd60e51b815260206004820152602660248201527f4e6f6e626c6f636b696e674c7a4170703a2063616c6c6572206d7573742062656044820152650204c7a4170760d41b6064820152608401610939565b61108e8686868080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525050604080516020601f890181900481028201810190925287815289935091508790879081908401838280828437600092019190915250611b1692505050565b505050505050565b61109e611928565b6110a86000611b7d565b565b600160205260009081526040902080546110c390612c34565b80601f01602080910402602001604051908101604052809291908181526020018280546110ef90612c34565b801561113c5780601f106111115761010080835404028352916020019161113c565b820191906000526020600020905b81548152906001019060200180831161111f57829003601f168201915b505050505081565b600061114f60095490565b905090565b6060600b8054610b4390612c34565b61ffff811660009081526001602052604081208054606092919061118690612c34565b80601f01602080910402602001604051908101604052809291908181526020018280546111b290612c34565b80156111ff5780601f106111d4576101008083540402835291602001916111ff565b820191906000526020600020905b8154815290600101906020018083116111e257829003601f168201915b5050505050905080516000036112575760405162461bcd60e51b815260206004820152601d60248201527f4c7a4170703a206e6f20747275737465642070617468207265636f72640000006044820152606401610939565b61127260006014835161126a9190612d84565b839190611bcd565b9392505050565b611281611928565b81813060405160200161129693929190612d97565b60408051601f1981840301815291815261ffff85166000908152600160205220906112c19082612e03565b507f8c0400cfe2d1199b1a725c78960bcc2a344d869b80590d0f2bd005db15a572ce8383836040516112f593929190612d50565b60405180910390a1505050565b600033610c5d8185856119da565b611318611928565b600480546001600160a01b0319166001600160a01b0383169081179091556040519081527f5db758e995a17ec1ad84bdef7e8c3293a0bd6179bcce400dff5d4c3d87db726b906020015b60405180910390a150565b46821461138c5760405162461bcd60e51b815260040161093990612ec2565b6113a83360006040518060200160405280600081525084611cda565b505050565b6113b5611928565b6040516332fb62e760e21b81526001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000169063cbed8b9c906114099088908890889088908890600401612f04565b600060405180830381600087803b15801561142357600080fd5b505af1158015610faf573d6000803e3d6000fd5b61ffff8616600090815260056020526040808220905161145a9088908890612c6e565b90815260408051602092819003830190206001600160401b038716600090815292529020549050806114da5760405162461bcd60e51b815260206004820152602360248201527f4e6f6e626c6f636b696e674c7a4170703a206e6f2073746f726564206d65737360448201526261676560e81b6064820152608401610939565b8083836040516114eb929190612c6e565b60405180910390201461154a5760405162461bcd60e51b815260206004820152602160248201527f4e6f6e626c6f636b696e674c7a4170703a20696e76616c6964207061796c6f616044820152601960fa1b6064820152608401610939565b61ffff8716600090815260056020526040808220905161156d9089908990612c6e565b90815260408051602092819003830181206001600160401b038916600090815290845282902093909355601f88018290048202830182019052868252611605918991899089908190840183828082843760009201919091525050604080516020601f8a018190048102820181019092528881528a935091508890889081908401838280828437600092019190915250611b1692505050565b7fc264d91f3adc5588250e1551f547752ca0cfa8f6b530d243b9f9f4cab10ea8e5878787878560405161163c959493929190612f3d565b60405180910390a150505050505050565b46831461166c5760405162461bcd60e51b815260040161093990612ec2565b61167860008383611d0c565b50505050565b611686611928565b61ffff83811660008181526002602090815260408083209487168084529482529182902085905581519283528201929092529081018290527f9d5c7c0b934da8fefa9c7760c98383778a12dfbfc0c3b3106518f43fb9508ac0906060016112f5565b6116f0611928565b6006805460ff19168215159081179091556040519081527f1584ad594a70cbe1e6515592e1272a987d922b097ead875069cebe8b40c004a490602001611362565b611739611928565b61ffff83166000908152600160205260409020611757828483612f78565b507ffa41487ad5d6728f0b19276fa1eddc16558578f5109fc39d2dc33c3230470dab8383836040516112f593929190612d50565b611793611928565b6001600160a01b0381166117bd57604051631e4fbdf760e01b815260006004820152602401610939565b6117c681611b7d565b50565b604051633d7b2f6f60e21b815261ffff808616600483015284166024820152306044820152606481018290526060907f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03169063f5ecbdbc90608401600060405180830381865afa158015611849573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f191682016040526118719190810190613084565b95945050505050565b6000806118dd5a60966366ad5c8a60e01b898989896040516024016118a294939291906130b8565b60408051601f198184030181529190526020810180516001600160e01b03166001600160e01b03199093169290921790915230929190611d1f565b915091508161108e5761108e8686868685611da9565b60006001600160e01b03198216630a72677560e11b1480610b2e57506301ffc9a760e01b6001600160e01b0319831614610b2e565b6000546001600160a01b031633146110a85760405163118cdaa760e01b8152336004820152602401610939565b6113a88383836001611e46565b6001600160a01b03838116600090815260086020908152604080832093861683529290522054600019811461167857818110156119cb57604051637dc7a0d960e11b81526001600160a01b03841660048201526024810182905260448101839052606401610939565b61167884848484036000611e46565b6001600160a01b038316611a0457604051634b637e8f60e11b815260006004820152602401610939565b6001600160a01b038216611a2e5760405163ec442f0560e01b815260006004820152602401610939565b6113a8838383611f1b565b6001600160a01b038216611a635760405163ec442f0560e01b815260006004820152602401610939565b610eab60008383611f1b565b611a7d866000836000612045565b6000611a8b88888888611cda565b90506000808783604051602001611aa4939291906130f6565b6040516020818303038152906040529050611ac38882878787346120bf565b886001600160a01b03168861ffff167f39a4c66499bcf4b56d79f0dde8ed7a9d4925a0df55825206b2b8531e202be0d08985604051611b03929190613123565b60405180910390a3505050505050505050565b602081015161ffff8116611b3557611b3085858585612264565b610c48565b60405162461bcd60e51b815260206004820152601c60248201527f4f4654436f72653a20756e6b6e6f776e207061636b65742074797065000000006044820152606401610939565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b606081611bdb81601f613145565b1015611c1a5760405162461bcd60e51b815260206004820152600e60248201526d736c6963655f6f766572666c6f7760901b6044820152606401610939565b611c248284613145565b84511015611c685760405162461bcd60e51b8152602060048201526011602482015270736c6963655f6f75744f66426f756e647360781b6044820152606401610939565b606082158015611c875760405191506000825260208201604052611cd1565b6040519150601f8416801560200281840101858101878315602002848b0101015b81831015611cc0578051835260209283019201611ca8565b5050858452601f01601f1916604052505b50949350505050565b6000336001600160a01b0386168114611cf857611cf8868285611962565b611d0286846122ee565b5090949350505050565b6000611d188383611a39565b5092915050565b6000606060008060008661ffff166001600160401b03811115611d4457611d4461294a565b6040519080825280601f01601f191660200182016040528015611d6e576020820181803683370190505b50905060008087516020890160008d8df191503d925086831115611d90578692505b828152826000602083013e909890975095505050505050565b8180519060200120600560008761ffff1661ffff16815260200190815260200160002085604051611dda9190613158565b9081526040805191829003602090810183206001600160401b0388166000908152915220919091557fe183f33de2837795525b4792ca4cd60535bd77c53b7e7030060bfcf5734d6b0c90611e379087908790879087908790613174565b60405180910390a15050505050565b6001600160a01b038416611e705760405163e602df0560e01b815260006004820152602401610939565b6001600160a01b038316611e9a57604051634a1406b160e11b815260006004820152602401610939565b6001600160a01b038085166000908152600860209081526040808320938716835292905220829055801561167857826001600160a01b0316846001600160a01b03167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92584604051611f0d91815260200190565b60405180910390a350505050565b6001600160a01b038316611f46578060096000828254611f3b9190613145565b90915550611fb89050565b6001600160a01b03831660009081526007602052604090205481811015611f995760405163391434e360e21b81526001600160a01b03851660048201526024810182905260448101839052606401610939565b6001600160a01b03841660009081526007602052604090209082900390555b6001600160a01b038216611fd457600980548290039055611ff3565b6001600160a01b03821660009081526007602052604090208054820190555b816001600160a01b0316836001600160a01b03167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef8360405161203891815260200190565b60405180910390a3505050565b60065460ff16156120615761205c84848484612324565b611678565b8151156116785760405162461bcd60e51b815260206004820152602660248201527f4f4654436f72653a205f61646170746572506172616d73206d7573742062652060448201526532b6b83a3c9760d11b6064820152608401610939565b61ffff8616600090815260016020526040812080546120dd90612c34565b80601f016020809104026020016040519081016040528092919081815260200182805461210990612c34565b80156121565780601f1061212b57610100808354040283529160200191612156565b820191906000526020600020905b81548152906001019060200180831161213957829003601f168201915b5050505050905080516000036121c75760405162461bcd60e51b815260206004820152603060248201527f4c7a4170703a2064657374696e6174696f6e20636861696e206973206e6f742060448201526f61207472757374656420736f7572636560801b6064820152608401610939565b6121d28787516123f9565b60405162c5803160e81b81526001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000169063c5803100908490612229908b9086908c908c908c908c906004016131d2565b6000604051808303818588803b15801561224257600080fd5b505af1158015612256573d6000803e3d6000fd5b505050505050505050505050565b6000808280602001905181019061227b919061322c565b90935091506000905061228e838261246a565b905061229b878284611d0c565b9150806001600160a01b03168761ffff167fbf551ec93859b170f9b2141bd9298bf3f64322c6f7beb2543a0cb669834118bf846040516122dd91815260200190565b60405180910390a350505050505050565b6001600160a01b03821661231857604051634b637e8f60e11b815260006004820152602401610939565b610eab82600083611f1b565b600061232f836124cf565b61ffff808716600090815260026020908152604080832093891683529290522054909150806123a05760405162461bcd60e51b815260206004820152601a60248201527f4c7a4170703a206d696e4761734c696d6974206e6f74207365740000000000006044820152606401610939565b6123aa8382613145565b82101561108e5760405162461bcd60e51b815260206004820152601b60248201527f4c7a4170703a20676173206c696d697420697320746f6f206c6f7700000000006044820152606401610939565b61ffff82166000908152600360205260408120549081900361241a57506127105b808211156113a85760405162461bcd60e51b815260206004820181905260248201527f4c7a4170703a207061796c6f61642073697a6520697320746f6f206c617267656044820152606401610939565b6000612477826014613145565b835110156124bf5760405162461bcd60e51b8152602060048201526015602482015274746f416464726573735f6f75744f66426f756e647360581b6044820152606401610939565b500160200151600160601b900490565b60006022825110156125235760405162461bcd60e51b815260206004820152601c60248201527f4c7a4170703a20696e76616c69642061646170746572506172616d73000000006044820152606401610939565b506022015190565b61ffff811681146117c657600080fd5b60008083601f84011261254d57600080fd5b5081356001600160401b0381111561256457600080fd5b60208301915083602082850101111561257c57600080fd5b9250929050565b80356001600160401b038116811461259a57600080fd5b919050565b600080600080600080608087890312156125b857600080fd5b86356125c38161252b565b955060208701356001600160401b03808211156125df57600080fd5b6125eb8a838b0161253b565b90975095508591506125ff60408a01612583565b9450606089013591508082111561261557600080fd5b5061262289828a0161253b565b979a9699509497509295939492505050565b60006020828403121561264657600080fd5b81356001600160e01b03198116811461127257600080fd5b60005b83811015612679578181015183820152602001612661565b50506000910152565b6000815180845261269a81602086016020860161265e565b601f01601f19169290920160200192915050565b6020815260006112726020830184612682565b6000602082840312156126d357600080fd5b81356112728161252b565b6001600160a01b03811681146117c657600080fd5b6000806040838503121561270657600080fd5b8235612711816126de565b946020939093013593505050565b6000806040838503121561273257600080fd5b82356127118161252b565b60008060006060848603121561275257600080fd5b833561275d816126de565b9250602084013561276d816126de565b929592945050506040919091013590565b8035801515811461259a57600080fd5b600080600080600080600060a0888a0312156127a957600080fd5b87356127b48161252b565b965060208801356001600160401b03808211156127d057600080fd5b6127dc8b838c0161253b565b909850965060408a013595508691506127f760608b0161277e565b945060808a013591508082111561280d57600080fd5b5061281a8a828b0161253b565b989b979a50959850939692959293505050565b60008060006040848603121561284257600080fd5b833561284d8161252b565b925060208401356001600160401b0381111561286857600080fd5b6128748682870161253b565b9497909650939450505050565b600080600080600080600080600060e08a8c03121561289f57600080fd5b89356128aa816126de565b985060208a01356128ba8161252b565b975060408a01356001600160401b03808211156128d657600080fd5b6128e28d838e0161253b565b909950975060608c0135965060808c013591506128fe826126de565b90945060a08b013590612910826126de565b90935060c08b0135908082111561292657600080fd5b506129338c828d0161253b565b915080935050809150509295985092959850929598565b634e487b7160e01b600052604160045260246000fd5b604051601f8201601f191681016001600160401b03811182821017156129885761298861294a565b604052919050565b60006001600160401b038211156129a9576129a961294a565b50601f01601f191660200190565b6000806000606084860312156129cc57600080fd5b83356129d78161252b565b925060208401356001600160401b038111156129f257600080fd5b8401601f81018613612a0357600080fd5b8035612a16612a1182612990565b612960565b818152876020838501011115612a2b57600080fd5b81602084016020830137600060208383010152809450505050612a5060408501612583565b90509250925092565b600060208284031215612a6b57600080fd5b8135611272816126de565b60008060408385031215612a8957600080fd5b8235612a948161252b565b91506020830135612aa48161252b565b809150509250929050565b60008060408385031215612ac257600080fd5b50508035926020909101359150565b600080600080600060808688031215612ae957600080fd5b8535612af48161252b565b94506020860135612b048161252b565b93506040860135925060608601356001600160401b03811115612b2657600080fd5b612b328882890161253b565b969995985093965092949392505050565b600080600060608486031215612b5857600080fd5b83359250602084013561276d816126de565b60008060408385031215612b7d57600080fd5b8235612b88816126de565b91506020830135612aa4816126de565b600080600060608486031215612bad57600080fd5b8335612bb88161252b565b9250602084013561276d8161252b565b600060208284031215612bda57600080fd5b6112728261277e565b60008060008060808587031215612bf957600080fd5b8435612c048161252b565b93506020850135612c148161252b565b92506040850135612c24816126de565b9396929550929360600135925050565b600181811c90821680612c4857607f821691505b602082108103612c6857634e487b7160e01b600052602260045260246000fd5b50919050565b8183823760009101908152919050565b81835281816020850137506000828201602090810191909152601f909101601f19169091010190565b61ffff85168152606060208201526000612cc5606083018587612c7e565b905082604083015295945050505050565b61ffff871681526001600160a01b038616602082015260a060408201819052600090612d0490830187612682565b85151560608401528281036080840152612d1f818587612c7e565b9998505050505050505050565b60008060408385031215612d3f57600080fd5b505080516020909101519092909150565b61ffff84168152604060208201526000611871604083018486612c7e565b634e487b7160e01b600052601160045260246000fd5b81810381811115610b2e57610b2e612d6e565b8284823760609190911b6bffffffffffffffffffffffff19169101908152601401919050565b601f8211156113a857600081815260208120601f850160051c81016020861015612de45750805b601f850160051c820191505b8181101561108e57828155600101612df0565b81516001600160401b03811115612e1c57612e1c61294a565b612e3081612e2a8454612c34565b84612dbd565b602080601f831160018114612e655760008415612e4d5750858301515b600019600386901b1c1916600185901b17855561108e565b600085815260208120601f198616915b82811015612e9457888601518255948401946001909101908401612e75565b5085821015612eb25787850151600019600388901b60f8161c191681555b5050505050600190811b01905550565b60208082526022908201527f4d756c7469436861696e546f6b656e3a20636861696e4964206e6f74206d61746040820152610c6d60f31b606082015260800190565b600061ffff808816835280871660208401525084604083015260806060830152612f32608083018486612c7e565b979650505050505050565b61ffff86168152608060208201526000612f5b608083018688612c7e565b6001600160401b0394909416604083015250606001529392505050565b6001600160401b03831115612f8f57612f8f61294a565b612fa383612f9d8354612c34565b83612dbd565b6000601f841160018114612fd75760008515612fbf5750838201355b600019600387901b1c1916600186901b178355610c48565b600083815260209020601f19861690835b828110156130085786850135825560209485019460019092019101612fe8565b50868210156130255760001960f88860031b161c19848701351681555b505060018560011b0183555050505050565b600082601f83011261304857600080fd5b8151613056612a1182612990565b81815284602083860101111561306b57600080fd5b61307c82602083016020870161265e565b949350505050565b60006020828403121561309657600080fd5b81516001600160401b038111156130ac57600080fd5b61307c84828501613037565b61ffff851681526080602082015260006130d56080830186612682565b6001600160401b03851660408401528281036060840152612f328185612682565b61ffff841681526060602082015260006131136060830185612682565b9050826040830152949350505050565b6040815260006131366040830185612682565b90508260208301529392505050565b80820180821115610b2e57610b2e612d6e565b6000825161316a81846020870161265e565b9190910192915050565b61ffff8616815260a06020820152600061319160a0830187612682565b6001600160401b038616604084015282810360608401526131b28186612682565b905082810360808401526131c68185612682565b98975050505050505050565b61ffff8716815260c0602082015260006131ef60c0830188612682565b82810360408401526132018188612682565b6001600160a01b0387811660608601528616608085015283810360a08501529050612d1f8185612682565b60008060006060848603121561324157600080fd5b835161324c8161252b565b60208501519093506001600160401b0381111561326857600080fd5b61327486828701613037565b92505060408401519050925092509256fea264697066735822122072d7b5fb548a1f9706b4d44134b308745b9c3f5cae8d32c938ca52a6332f976364736f6c63430008140033",
      "sourceMap": "158:912:55:-:0;;;202:201;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;460:122:56;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;-1:-1:-1;;;460:122:56;;;;;308:11:55;460:122:56;;308:11:55;;;337:10;;1269:95:16;;1322:31;;-1:-1:-1;;;1322:31:16;;1350:1;1322:31;;;516:51:62;489:18;;1322:31:16;;;;;;;;1269:95;1373:32;1392:12;1373:18;:32::i;:::-;-1:-1:-1;;;;;;1201:42:46;;;-1:-1:-1;1962:5:23;;-1:-1:-1;1962:13:23;1970:5;1962;:13;:::i;:::-;-1:-1:-1;1985:7:23;:17;1995:7;1985;:17;:::i;:::-;;1896:113;;460:122:56;;;363:33:55::2;369:10;381:14;363:5;;;:33;;:::i;:::-;202:201:::0;;158:912;;2912:187:16;2985:16;3004:6;;-1:-1:-1;;;;;3020:17:16;;;-1:-1:-1;;;;;;3020:17:16;;;;;;3052:40;;3004:6;;;;;;;3052:40;;2985:16;3052:40;2975:124;2912:187;:::o;7721:208:23:-;-1:-1:-1;;;;;7791:21:23;;7787:91;;7835:32;;-1:-1:-1;;;7835:32:23;;7864:1;7835:32;;;516:51:62;489:18;;7835:32:23;370:203:62;7787:91:23;7887:35;7903:1;7907:7;7916:5;7887:7;:35::i;:::-;7721:208;;:::o;6271:1107::-;-1:-1:-1;;;;;6360:18:23;;6356:540;;6512:5;6496:12;;:21;;;;;;;:::i;:::-;;;;-1:-1:-1;6356:540:23;;-1:-1:-1;6356:540:23;;-1:-1:-1;;;;;6570:15:23;;6548:19;6570:15;;;:9;:15;;;;;;6603:19;;;6599:115;;;6649:50;;-1:-1:-1;;;6649:50:23;;-1:-1:-1;;;;;3746:32:62;;6649:50:23;;;3728:51:62;3795:18;;;3788:34;;;3838:18;;;3831:34;;;3701:18;;6649:50:23;3526:345:62;6599:115:23;-1:-1:-1;;;;;6834:15:23;;;;;;:9;:15;;;;;6852:19;;;;6834:37;;6356:540;-1:-1:-1;;;;;6910:16:23;;6906:425;;7073:12;:21;;;;;;;6906:425;;;-1:-1:-1;;;;;7284:13:23;;;;;;:9;:13;;;;;:22;;;;;;6906:425;7361:2;-1:-1:-1;;;;;7346:25:23;7355:4;-1:-1:-1;;;;;7346:25:23;;7365:5;7346:25;;;;4022::62;;4010:2;3995:18;;3876:177;7346:25:23;;;;;;;;6271:1107;;;:::o;14:351:62:-;93:6;101;154:2;142:9;133:7;129:23;125:32;122:52;;;170:1;167;160:12;122:52;193:16;;252:2;237:18;;231:25;193:16;;-1:-1:-1;;;;;;285:31:62;;275:42;;265:70;;331:1;328;321:12;265:70;354:5;344:15;;;14:351;;;;;:::o;578:127::-;639:10;634:3;630:20;627:1;620:31;670:4;667:1;660:15;694:4;691:1;684:15;710:380;789:1;785:12;;;;832;;;853:61;;907:4;899:6;895:17;885:27;;853:61;960:2;952:6;949:14;929:18;926:38;923:161;;1006:10;1001:3;997:20;994:1;987:31;1041:4;1038:1;1031:15;1069:4;1066:1;1059:15;923:161;;710:380;;;:::o;1221:545::-;1323:2;1318:3;1315:11;1312:448;;;1359:1;1384:5;1380:2;1373:17;1429:4;1425:2;1415:19;1499:2;1487:10;1483:19;1480:1;1476:27;1470:4;1466:38;1535:4;1523:10;1520:20;1517:47;;;-1:-1:-1;1558:4:62;1517:47;1613:2;1608:3;1604:12;1601:1;1597:20;1591:4;1587:31;1577:41;;1668:82;1686:2;1679:5;1676:13;1668:82;;;1731:17;;;1712:1;1701:13;1668:82;;;1672:3;;;1312:448;1221:545;;;:::o;1942:1352::-;2062:10;;-1:-1:-1;;;;;2084:30:62;;2081:56;;;2117:18;;:::i;:::-;2146:97;2236:6;2196:38;2228:4;2222:11;2196:38;:::i;:::-;2190:4;2146:97;:::i;:::-;2298:4;;2362:2;2351:14;;2379:1;2374:663;;;;3081:1;3098:6;3095:89;;;-1:-1:-1;3150:19:62;;;3144:26;3095:89;-1:-1:-1;;1899:1:62;1895:11;;;1891:24;1887:29;1877:40;1923:1;1919:11;;;1874:57;3197:81;;2344:944;;2374:663;1168:1;1161:14;;;1205:4;1192:18;;-1:-1:-1;;2410:20:62;;;2528:236;2542:7;2539:1;2536:14;2528:236;;;2631:19;;;2625:26;2610:42;;2723:27;;;;2691:1;2679:14;;;;2558:19;;2528:236;;;2532:3;2792:6;2783:7;2780:19;2777:201;;;2853:19;;;2847:26;-1:-1:-1;;2936:1:62;2932:14;;;2948:3;2928:24;2924:37;2920:42;2905:58;2890:74;;2777:201;-1:-1:-1;;;;;3024:1:62;3008:14;;;3004:22;2991:36;;-1:-1:-1;1942:1352:62:o;3299:222::-;3364:9;;;3385:10;;;3382:133;;;3437:10;3432:3;3428:20;3425:1;3418:31;3472:4;3469:1;3462:15;3500:4;3497:1;3490:15;3382:133;3299:222;;;;:::o;3876:177::-;158:912:55;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;",
      "linkReferences": {}
    },
    "deployedBytecode": {
      "object": "0x60806040526004361061027c5760003560e01c80638cfd8f5c1161014f578063c4461834116100c1578063eab45d9c1161007a578063eab45d9c14610818578063eb8d72b714610838578063ed629c5c14610858578063f2fde38b14610872578063f5ecbdbc14610892578063fc0c546a146108b257600080fd5b8063c446183414610749578063cbed8b9c1461075f578063d1deba1f1461077f578063dc396e5b14610792578063dd62ed3e146107b2578063df2a5b3b146107f857600080fd5b80639f38369a116101135780639f38369a14610675578063a6c3d16514610695578063a9059cbb146106b5578063b353aaa7146106d5578063baf3292d14610709578063c3e806d21461072957600080fd5b80638cfd8f5c146105c15780638da5cb5b146105f95780639358928b1461062b578063950c8a741461064057806395d89b411461066057600080fd5b80633d8b38f6116101f357806351905636116101ac57806351905636146104d45780635b8c41e6146104e757806366ad5c8a1461053657806370a0823114610556578063715018a61461058c5780637533d788146105a157600080fd5b80633d8b38f61461040a5780633f1f4fa41461042a57806340c10f191461045757806342d65a8d1461047757806344770515146104975780634c42899a146104ac57600080fd5b80630df37483116102455780630df374831461033a57806310ddb1371461035a57806318160ddd1461037a57806323b872dd146103995780632a205e3d146103b9578063313ce567146103ee57600080fd5b80621d35671461028157806301ffc9a7146102a357806306fdde03146102d857806307e0db17146102fa578063095ea7b31461031a575b600080fd5b34801561028d57600080fd5b506102a161029c36600461259f565b6108c5565b005b3480156102af57600080fd5b506102c36102be366004612634565b610af6565b60405190151581526020015b60405180910390f35b3480156102e457600080fd5b506102ed610b34565b6040516102cf91906126ae565b34801561030657600080fd5b506102a16103153660046126c1565b610bc6565b34801561032657600080fd5b506102c36103353660046126f3565b610c4f565b34801561034657600080fd5b506102a161035536600461271f565b610c67565b34801561036657600080fd5b506102a16103753660046126c1565b610c86565b34801561038657600080fd5b506009545b6040519081526020016102cf565b3480156103a557600080fd5b506102c36103b436600461273d565b610cde565b3480156103c557600080fd5b506103d96103d436600461278e565b610d02565b604080519283526020830191909152016102cf565b3480156103fa57600080fd5b50604051601281526020016102cf565b34801561041657600080fd5b506102c361042536600461282d565b610dd5565b34801561043657600080fd5b5061038b6104453660046126c1565b60036020526000908152604090205481565b34801561046357600080fd5b506102a16104723660046126f3565b610ea1565b34801561048357600080fd5b506102a161049236600461282d565b610eaf565b3480156104a357600080fd5b5061038b600081565b3480156104b857600080fd5b506104c1600081565b60405161ffff90911681526020016102cf565b6102a16104e2366004612881565b610f35565b3480156104f357600080fd5b5061038b6105023660046129b7565b6005602090815260009384526040808520845180860184018051928152908401958401959095209452929052825290205481565b34801561054257600080fd5b506102a161055136600461259f565b610fba565b34801561056257600080fd5b5061038b610571366004612a59565b6001600160a01b031660009081526007602052604090205490565b34801561059857600080fd5b506102a1611096565b3480156105ad57600080fd5b506102ed6105bc3660046126c1565b6110aa565b3480156105cd57600080fd5b5061038b6105dc366004612a76565b600260209081526000928352604080842090915290825290205481565b34801561060557600080fd5b506000546001600160a01b03165b6040516001600160a01b0390911681526020016102cf565b34801561063757600080fd5b5061038b611144565b34801561064c57600080fd5b50600454610613906001600160a01b031681565b34801561066c57600080fd5b506102ed611154565b34801561068157600080fd5b506102ed6106903660046126c1565b611163565b3480156106a157600080fd5b506102a16106b036600461282d565b611279565b3480156106c157600080fd5b506102c36106d03660046126f3565b611302565b3480156106e157600080fd5b506106137f000000000000000000000000000000000000000000000000000000000000000081565b34801561071557600080fd5b506102a1610724366004612a59565b611310565b34801561073557600080fd5b506102a1610744366004612aaf565b61136d565b34801561075557600080fd5b5061038b61271081565b34801561076b57600080fd5b506102a161077a366004612ad1565b6113ad565b6102a161078d36600461259f565b611437565b34801561079e57600080fd5b506102a16107ad366004612b43565b61164d565b3480156107be57600080fd5b5061038b6107cd366004612b6a565b6001600160a01b03918216600090815260086020908152604080832093909416825291909152205490565b34801561080457600080fd5b506102a1610813366004612b98565b61167e565b34801561082457600080fd5b506102a1610833366004612bc8565b6116e8565b34801561084457600080fd5b506102a161085336600461282d565b611731565b34801561086457600080fd5b506006546102c39060ff1681565b34801561087e57600080fd5b506102a161088d366004612a59565b61178b565b34801561089e57600080fd5b506102ed6108ad366004612be3565b6117c9565b3480156108be57600080fd5b5030610613565b337f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316146109425760405162461bcd60e51b815260206004820152601e60248201527f4c7a4170703a20696e76616c696420656e64706f696e742063616c6c6572000060448201526064015b60405180910390fd5b61ffff86166000908152600160205260408120805461096090612c34565b80601f016020809104026020016040519081016040528092919081815260200182805461098c90612c34565b80156109d95780601f106109ae576101008083540402835291602001916109d9565b820191906000526020600020905b8154815290600101906020018083116109bc57829003601f168201915b505050505090508051868690501480156109f4575060008151115b8015610a1c575080516020820120604051610a129088908890612c6e565b6040518091039020145b610a775760405162461bcd60e51b815260206004820152602660248201527f4c7a4170703a20696e76616c696420736f757263652073656e64696e6720636f6044820152651b9d1c9858dd60d21b6064820152608401610939565b610aed8787878080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525050604080516020601f8a018190048102820181019092528881528a93509150889088908190840183828082843760009201919091525061187a92505050565b50505050505050565b60006001600160e01b031982161580610b1f57506001600160e01b031982166336372b0760e01b145b80610b2e5750610b2e826118f3565b92915050565b6060600a8054610b4390612c34565b80601f0160208091040260200160405190810160405280929190818152602001828054610b6f90612c34565b8015610bbc5780601f10610b9157610100808354040283529160200191610bbc565b820191906000526020600020905b815481529060010190602001808311610b9f57829003601f168201915b5050505050905090565b610bce611928565b6040516307e0db1760e01b815261ffff821660048201527f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316906307e0db17906024015b600060405180830381600087803b158015610c3457600080fd5b505af1158015610c48573d6000803e3d6000fd5b5050505050565b600033610c5d818585611955565b5060019392505050565b610c6f611928565b61ffff909116600090815260036020526040902055565b610c8e611928565b6040516310ddb13760e01b815261ffff821660048201527f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316906310ddb13790602401610c1a565b600033610cec858285611962565b610cf78585856119da565b506001949350505050565b600080600080898989604051602001610d1e9493929190612ca7565b60408051601f198184030181529082905263040a7bb160e41b825291506001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016906340a7bb1090610d84908d90309086908c908c908c90600401612cd6565b6040805180830381865afa158015610da0573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610dc49190612d2c565b925092505097509795505050505050565b61ffff831660009081526001602052604081208054829190610df690612c34565b80601f0160208091040260200160405190810160405280929190818152602001828054610e2290612c34565b8015610e6f5780601f10610e4457610100808354040283529160200191610e6f565b820191906000526020600020905b815481529060010190602001808311610e5257829003601f168201915b505050505090508383604051610e86929190612c6e565b60405180910390208180519060200120149150509392505050565b610eab8282611a39565b5050565b610eb7611928565b6040516342d65a8d60e01b81526001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016906342d65a8d90610f0790869086908690600401612d50565b600060405180830381600087803b158015610f2157600080fd5b505af1158015610aed573d6000803e3d6000fd5b610faf898989898080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525050604080516020601f8a018190048102820181019092528881528c93508b92508a918a908a9081908401838280828437600092019190915250611a6f92505050565b505050505050505050565b3330146110185760405162461bcd60e51b815260206004820152602660248201527f4e6f6e626c6f636b696e674c7a4170703a2063616c6c6572206d7573742062656044820152650204c7a4170760d41b6064820152608401610939565b61108e8686868080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525050604080516020601f890181900481028201810190925287815289935091508790879081908401838280828437600092019190915250611b1692505050565b505050505050565b61109e611928565b6110a86000611b7d565b565b600160205260009081526040902080546110c390612c34565b80601f01602080910402602001604051908101604052809291908181526020018280546110ef90612c34565b801561113c5780601f106111115761010080835404028352916020019161113c565b820191906000526020600020905b81548152906001019060200180831161111f57829003601f168201915b505050505081565b600061114f60095490565b905090565b6060600b8054610b4390612c34565b61ffff811660009081526001602052604081208054606092919061118690612c34565b80601f01602080910402602001604051908101604052809291908181526020018280546111b290612c34565b80156111ff5780601f106111d4576101008083540402835291602001916111ff565b820191906000526020600020905b8154815290600101906020018083116111e257829003601f168201915b5050505050905080516000036112575760405162461bcd60e51b815260206004820152601d60248201527f4c7a4170703a206e6f20747275737465642070617468207265636f72640000006044820152606401610939565b61127260006014835161126a9190612d84565b839190611bcd565b9392505050565b611281611928565b81813060405160200161129693929190612d97565b60408051601f1981840301815291815261ffff85166000908152600160205220906112c19082612e03565b507f8c0400cfe2d1199b1a725c78960bcc2a344d869b80590d0f2bd005db15a572ce8383836040516112f593929190612d50565b60405180910390a1505050565b600033610c5d8185856119da565b611318611928565b600480546001600160a01b0319166001600160a01b0383169081179091556040519081527f5db758e995a17ec1ad84bdef7e8c3293a0bd6179bcce400dff5d4c3d87db726b906020015b60405180910390a150565b46821461138c5760405162461bcd60e51b815260040161093990612ec2565b6113a83360006040518060200160405280600081525084611cda565b505050565b6113b5611928565b6040516332fb62e760e21b81526001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000169063cbed8b9c906114099088908890889088908890600401612f04565b600060405180830381600087803b15801561142357600080fd5b505af1158015610faf573d6000803e3d6000fd5b61ffff8616600090815260056020526040808220905161145a9088908890612c6e565b90815260408051602092819003830190206001600160401b038716600090815292529020549050806114da5760405162461bcd60e51b815260206004820152602360248201527f4e6f6e626c6f636b696e674c7a4170703a206e6f2073746f726564206d65737360448201526261676560e81b6064820152608401610939565b8083836040516114eb929190612c6e565b60405180910390201461154a5760405162461bcd60e51b815260206004820152602160248201527f4e6f6e626c6f636b696e674c7a4170703a20696e76616c6964207061796c6f616044820152601960fa1b6064820152608401610939565b61ffff8716600090815260056020526040808220905161156d9089908990612c6e565b90815260408051602092819003830181206001600160401b038916600090815290845282902093909355601f88018290048202830182019052868252611605918991899089908190840183828082843760009201919091525050604080516020601f8a018190048102820181019092528881528a935091508890889081908401838280828437600092019190915250611b1692505050565b7fc264d91f3adc5588250e1551f547752ca0cfa8f6b530d243b9f9f4cab10ea8e5878787878560405161163c959493929190612f3d565b60405180910390a150505050505050565b46831461166c5760405162461bcd60e51b815260040161093990612ec2565b61167860008383611d0c565b50505050565b611686611928565b61ffff83811660008181526002602090815260408083209487168084529482529182902085905581519283528201929092529081018290527f9d5c7c0b934da8fefa9c7760c98383778a12dfbfc0c3b3106518f43fb9508ac0906060016112f5565b6116f0611928565b6006805460ff19168215159081179091556040519081527f1584ad594a70cbe1e6515592e1272a987d922b097ead875069cebe8b40c004a490602001611362565b611739611928565b61ffff83166000908152600160205260409020611757828483612f78565b507ffa41487ad5d6728f0b19276fa1eddc16558578f5109fc39d2dc33c3230470dab8383836040516112f593929190612d50565b611793611928565b6001600160a01b0381166117bd57604051631e4fbdf760e01b815260006004820152602401610939565b6117c681611b7d565b50565b604051633d7b2f6f60e21b815261ffff808616600483015284166024820152306044820152606481018290526060907f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03169063f5ecbdbc90608401600060405180830381865afa158015611849573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f191682016040526118719190810190613084565b95945050505050565b6000806118dd5a60966366ad5c8a60e01b898989896040516024016118a294939291906130b8565b60408051601f198184030181529190526020810180516001600160e01b03166001600160e01b03199093169290921790915230929190611d1f565b915091508161108e5761108e8686868685611da9565b60006001600160e01b03198216630a72677560e11b1480610b2e57506301ffc9a760e01b6001600160e01b0319831614610b2e565b6000546001600160a01b031633146110a85760405163118cdaa760e01b8152336004820152602401610939565b6113a88383836001611e46565b6001600160a01b03838116600090815260086020908152604080832093861683529290522054600019811461167857818110156119cb57604051637dc7a0d960e11b81526001600160a01b03841660048201526024810182905260448101839052606401610939565b61167884848484036000611e46565b6001600160a01b038316611a0457604051634b637e8f60e11b815260006004820152602401610939565b6001600160a01b038216611a2e5760405163ec442f0560e01b815260006004820152602401610939565b6113a8838383611f1b565b6001600160a01b038216611a635760405163ec442f0560e01b815260006004820152602401610939565b610eab60008383611f1b565b611a7d866000836000612045565b6000611a8b88888888611cda565b90506000808783604051602001611aa4939291906130f6565b6040516020818303038152906040529050611ac38882878787346120bf565b886001600160a01b03168861ffff167f39a4c66499bcf4b56d79f0dde8ed7a9d4925a0df55825206b2b8531e202be0d08985604051611b03929190613123565b60405180910390a3505050505050505050565b602081015161ffff8116611b3557611b3085858585612264565b610c48565b60405162461bcd60e51b815260206004820152601c60248201527f4f4654436f72653a20756e6b6e6f776e207061636b65742074797065000000006044820152606401610939565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b606081611bdb81601f613145565b1015611c1a5760405162461bcd60e51b815260206004820152600e60248201526d736c6963655f6f766572666c6f7760901b6044820152606401610939565b611c248284613145565b84511015611c685760405162461bcd60e51b8152602060048201526011602482015270736c6963655f6f75744f66426f756e647360781b6044820152606401610939565b606082158015611c875760405191506000825260208201604052611cd1565b6040519150601f8416801560200281840101858101878315602002848b0101015b81831015611cc0578051835260209283019201611ca8565b5050858452601f01601f1916604052505b50949350505050565b6000336001600160a01b0386168114611cf857611cf8868285611962565b611d0286846122ee565b5090949350505050565b6000611d188383611a39565b5092915050565b6000606060008060008661ffff166001600160401b03811115611d4457611d4461294a565b6040519080825280601f01601f191660200182016040528015611d6e576020820181803683370190505b50905060008087516020890160008d8df191503d925086831115611d90578692505b828152826000602083013e909890975095505050505050565b8180519060200120600560008761ffff1661ffff16815260200190815260200160002085604051611dda9190613158565b9081526040805191829003602090810183206001600160401b0388166000908152915220919091557fe183f33de2837795525b4792ca4cd60535bd77c53b7e7030060bfcf5734d6b0c90611e379087908790879087908790613174565b60405180910390a15050505050565b6001600160a01b038416611e705760405163e602df0560e01b815260006004820152602401610939565b6001600160a01b038316611e9a57604051634a1406b160e11b815260006004820152602401610939565b6001600160a01b038085166000908152600860209081526040808320938716835292905220829055801561167857826001600160a01b0316846001600160a01b03167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92584604051611f0d91815260200190565b60405180910390a350505050565b6001600160a01b038316611f46578060096000828254611f3b9190613145565b90915550611fb89050565b6001600160a01b03831660009081526007602052604090205481811015611f995760405163391434e360e21b81526001600160a01b03851660048201526024810182905260448101839052606401610939565b6001600160a01b03841660009081526007602052604090209082900390555b6001600160a01b038216611fd457600980548290039055611ff3565b6001600160a01b03821660009081526007602052604090208054820190555b816001600160a01b0316836001600160a01b03167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef8360405161203891815260200190565b60405180910390a3505050565b60065460ff16156120615761205c84848484612324565b611678565b8151156116785760405162461bcd60e51b815260206004820152602660248201527f4f4654436f72653a205f61646170746572506172616d73206d7573742062652060448201526532b6b83a3c9760d11b6064820152608401610939565b61ffff8616600090815260016020526040812080546120dd90612c34565b80601f016020809104026020016040519081016040528092919081815260200182805461210990612c34565b80156121565780601f1061212b57610100808354040283529160200191612156565b820191906000526020600020905b81548152906001019060200180831161213957829003601f168201915b5050505050905080516000036121c75760405162461bcd60e51b815260206004820152603060248201527f4c7a4170703a2064657374696e6174696f6e20636861696e206973206e6f742060448201526f61207472757374656420736f7572636560801b6064820152608401610939565b6121d28787516123f9565b60405162c5803160e81b81526001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000169063c5803100908490612229908b9086908c908c908c908c906004016131d2565b6000604051808303818588803b15801561224257600080fd5b505af1158015612256573d6000803e3d6000fd5b505050505050505050505050565b6000808280602001905181019061227b919061322c565b90935091506000905061228e838261246a565b905061229b878284611d0c565b9150806001600160a01b03168761ffff167fbf551ec93859b170f9b2141bd9298bf3f64322c6f7beb2543a0cb669834118bf846040516122dd91815260200190565b60405180910390a350505050505050565b6001600160a01b03821661231857604051634b637e8f60e11b815260006004820152602401610939565b610eab82600083611f1b565b600061232f836124cf565b61ffff808716600090815260026020908152604080832093891683529290522054909150806123a05760405162461bcd60e51b815260206004820152601a60248201527f4c7a4170703a206d696e4761734c696d6974206e6f74207365740000000000006044820152606401610939565b6123aa8382613145565b82101561108e5760405162461bcd60e51b815260206004820152601b60248201527f4c7a4170703a20676173206c696d697420697320746f6f206c6f7700000000006044820152606401610939565b61ffff82166000908152600360205260408120549081900361241a57506127105b808211156113a85760405162461bcd60e51b815260206004820181905260248201527f4c7a4170703a207061796c6f61642073697a6520697320746f6f206c617267656044820152606401610939565b6000612477826014613145565b835110156124bf5760405162461bcd60e51b8152602060048201526015602482015274746f416464726573735f6f75744f66426f756e647360581b6044820152606401610939565b500160200151600160601b900490565b60006022825110156125235760405162461bcd60e51b815260206004820152601c60248201527f4c7a4170703a20696e76616c69642061646170746572506172616d73000000006044820152606401610939565b506022015190565b61ffff811681146117c657600080fd5b60008083601f84011261254d57600080fd5b5081356001600160401b0381111561256457600080fd5b60208301915083602082850101111561257c57600080fd5b9250929050565b80356001600160401b038116811461259a57600080fd5b919050565b600080600080600080608087890312156125b857600080fd5b86356125c38161252b565b955060208701356001600160401b03808211156125df57600080fd5b6125eb8a838b0161253b565b90975095508591506125ff60408a01612583565b9450606089013591508082111561261557600080fd5b5061262289828a0161253b565b979a9699509497509295939492505050565b60006020828403121561264657600080fd5b81356001600160e01b03198116811461127257600080fd5b60005b83811015612679578181015183820152602001612661565b50506000910152565b6000815180845261269a81602086016020860161265e565b601f01601f19169290920160200192915050565b6020815260006112726020830184612682565b6000602082840312156126d357600080fd5b81356112728161252b565b6001600160a01b03811681146117c657600080fd5b6000806040838503121561270657600080fd5b8235612711816126de565b946020939093013593505050565b6000806040838503121561273257600080fd5b82356127118161252b565b60008060006060848603121561275257600080fd5b833561275d816126de565b9250602084013561276d816126de565b929592945050506040919091013590565b8035801515811461259a57600080fd5b600080600080600080600060a0888a0312156127a957600080fd5b87356127b48161252b565b965060208801356001600160401b03808211156127d057600080fd5b6127dc8b838c0161253b565b909850965060408a013595508691506127f760608b0161277e565b945060808a013591508082111561280d57600080fd5b5061281a8a828b0161253b565b989b979a50959850939692959293505050565b60008060006040848603121561284257600080fd5b833561284d8161252b565b925060208401356001600160401b0381111561286857600080fd5b6128748682870161253b565b9497909650939450505050565b600080600080600080600080600060e08a8c03121561289f57600080fd5b89356128aa816126de565b985060208a01356128ba8161252b565b975060408a01356001600160401b03808211156128d657600080fd5b6128e28d838e0161253b565b909950975060608c0135965060808c013591506128fe826126de565b90945060a08b013590612910826126de565b90935060c08b0135908082111561292657600080fd5b506129338c828d0161253b565b915080935050809150509295985092959850929598565b634e487b7160e01b600052604160045260246000fd5b604051601f8201601f191681016001600160401b03811182821017156129885761298861294a565b604052919050565b60006001600160401b038211156129a9576129a961294a565b50601f01601f191660200190565b6000806000606084860312156129cc57600080fd5b83356129d78161252b565b925060208401356001600160401b038111156129f257600080fd5b8401601f81018613612a0357600080fd5b8035612a16612a1182612990565b612960565b818152876020838501011115612a2b57600080fd5b81602084016020830137600060208383010152809450505050612a5060408501612583565b90509250925092565b600060208284031215612a6b57600080fd5b8135611272816126de565b60008060408385031215612a8957600080fd5b8235612a948161252b565b91506020830135612aa48161252b565b809150509250929050565b60008060408385031215612ac257600080fd5b50508035926020909101359150565b600080600080600060808688031215612ae957600080fd5b8535612af48161252b565b94506020860135612b048161252b565b93506040860135925060608601356001600160401b03811115612b2657600080fd5b612b328882890161253b565b969995985093965092949392505050565b600080600060608486031215612b5857600080fd5b83359250602084013561276d816126de565b60008060408385031215612b7d57600080fd5b8235612b88816126de565b91506020830135612aa4816126de565b600080600060608486031215612bad57600080fd5b8335612bb88161252b565b9250602084013561276d8161252b565b600060208284031215612bda57600080fd5b6112728261277e565b60008060008060808587031215612bf957600080fd5b8435612c048161252b565b93506020850135612c148161252b565b92506040850135612c24816126de565b9396929550929360600135925050565b600181811c90821680612c4857607f821691505b602082108103612c6857634e487b7160e01b600052602260045260246000fd5b50919050565b8183823760009101908152919050565b81835281816020850137506000828201602090810191909152601f909101601f19169091010190565b61ffff85168152606060208201526000612cc5606083018587612c7e565b905082604083015295945050505050565b61ffff871681526001600160a01b038616602082015260a060408201819052600090612d0490830187612682565b85151560608401528281036080840152612d1f818587612c7e565b9998505050505050505050565b60008060408385031215612d3f57600080fd5b505080516020909101519092909150565b61ffff84168152604060208201526000611871604083018486612c7e565b634e487b7160e01b600052601160045260246000fd5b81810381811115610b2e57610b2e612d6e565b8284823760609190911b6bffffffffffffffffffffffff19169101908152601401919050565b601f8211156113a857600081815260208120601f850160051c81016020861015612de45750805b601f850160051c820191505b8181101561108e57828155600101612df0565b81516001600160401b03811115612e1c57612e1c61294a565b612e3081612e2a8454612c34565b84612dbd565b602080601f831160018114612e655760008415612e4d5750858301515b600019600386901b1c1916600185901b17855561108e565b600085815260208120601f198616915b82811015612e9457888601518255948401946001909101908401612e75565b5085821015612eb25787850151600019600388901b60f8161c191681555b5050505050600190811b01905550565b60208082526022908201527f4d756c7469436861696e546f6b656e3a20636861696e4964206e6f74206d61746040820152610c6d60f31b606082015260800190565b600061ffff808816835280871660208401525084604083015260806060830152612f32608083018486612c7e565b979650505050505050565b61ffff86168152608060208201526000612f5b608083018688612c7e565b6001600160401b0394909416604083015250606001529392505050565b6001600160401b03831115612f8f57612f8f61294a565b612fa383612f9d8354612c34565b83612dbd565b6000601f841160018114612fd75760008515612fbf5750838201355b600019600387901b1c1916600186901b178355610c48565b600083815260209020601f19861690835b828110156130085786850135825560209485019460019092019101612fe8565b50868210156130255760001960f88860031b161c19848701351681555b505060018560011b0183555050505050565b600082601f83011261304857600080fd5b8151613056612a1182612990565b81815284602083860101111561306b57600080fd5b61307c82602083016020870161265e565b949350505050565b60006020828403121561309657600080fd5b81516001600160401b038111156130ac57600080fd5b61307c84828501613037565b61ffff851681526080602082015260006130d56080830186612682565b6001600160401b03851660408401528281036060840152612f328185612682565b61ffff841681526060602082015260006131136060830185612682565b9050826040830152949350505050565b6040815260006131366040830185612682565b90508260208301529392505050565b80820180821115610b2e57610b2e612d6e565b6000825161316a81846020870161265e565b9190910192915050565b61ffff8616815260a06020820152600061319160a0830187612682565b6001600160401b038616604084015282810360608401526131b28186612682565b905082810360808401526131c68185612682565b98975050505050505050565b61ffff8716815260c0602082015260006131ef60c0830188612682565b82810360408401526132018188612682565b6001600160a01b0387811660608601528616608085015283810360a08501529050612d1f8185612682565b60008060006060848603121561324157600080fd5b835161324c8161252b565b60208501519093506001600160401b0381111561326857600080fd5b61327486828701613037565b92505060408401519050925092509256fea264697066735822122072d7b5fb548a1f9706b4d44134b308745b9c3f5cae8d32c938ca52a6332f976364736f6c63430008140033",
      "sourceMap": "158:912:55:-:0;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;1256:825:46;;;;;;;;;;-1:-1:-1;1256:825:46;;;;;:::i;:::-;;:::i;:::-;;588:253:56;;;;;;;;;;-1:-1:-1;588:253:56;;;;;:::i;:::-;;:::i;:::-;;;2048:14:62;;2041:22;2023:41;;2011:2;1996:18;588:253:56;;;;;;;;2074:89:23;;;;;;;;;;;;;:::i;:::-;;;;;;;:::i;4791:121:46:-;;;;;;;;;;-1:-1:-1;4791:121:46;;;;;:::i;:::-;;:::i;4293:186:23:-;;;;;;;;;;-1:-1:-1;4293:186:23;;;;;:::i;:::-;;:::i;6649:140:46:-;;;;;;;;;;-1:-1:-1;6649:140:46;;;;;:::i;:::-;;:::i;4918:127::-;;;;;;;;;;-1:-1:-1;4918:127:46;;;;;:::i;:::-;;:::i;3144:97:23:-;;;;;;;;;;-1:-1:-1;3222:12:23;;3144:97;;;4001:25:62;;;3989:2;3974:18;3144:97:23;3855:177:62;5039:244:23;;;;;;;;;;-1:-1:-1;5039:244:23;;;;;:::i;:::-;;:::i;742:469:51:-;;;;;;;;;;-1:-1:-1;742:469:51;;;;;:::i;:::-;;:::i;:::-;;;;5830:25:62;;;5886:2;5871:18;;5864:34;;;;5803:18;742:469:51;5656:248:62;409:91:55;;;;;;;;;;-1:-1:-1;409:91:55;;491:2;6051:36:62;;6039:2;6024:18;409:91:55;5909:184:62;6884:247:46;;;;;;;;;;-1:-1:-1;6884:247:46;;;;;:::i;:::-;;:::i;810:53::-;;;;;;;;;;-1:-1:-1;810:53:46;;;;;:::i;:::-;;;;;;;;;;;;;;506:87:55;;;;;;;;;;-1:-1:-1;506:87:55;;;;;:::i;:::-;;:::i;5051:176:46:-;;;;;;;;;;-1:-1:-1;5051:176:46;;;;;:::i;:::-;;:::i;307:37:51:-;;;;;;;;;;;;343:1;307:37;;370:34;;;;;;;;;;;;403:1;370:34;;;;;6819:6:62;6807:19;;;6789:38;;6777:2;6762:18;370:34:51;6645:188:62;1217:394:51;;;;;;:::i;:::-;;:::i;622:85:47:-;;;;;;;;;;-1:-1:-1;622:85:47;;;;;:::i;:::-;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;1912:380;;;;;;;;;;-1:-1:-1;1912:380:47;;;;;:::i;:::-;;:::i;3299:116:23:-;;;;;;;;;;-1:-1:-1;3299:116:23;;;;;:::i;:::-;-1:-1:-1;;;;;3390:18:23;3364:7;3390:18;;;:9;:18;;;;;;;3299:116;2293:101:16;;;;;;;;;;;;;:::i;682:51:46:-;;;;;;;;;;-1:-1:-1;682:51:46;;;;;:::i;:::-;;:::i;739:65::-;;;;;;;;;;-1:-1:-1;739:65:46;;;;;:::i;:::-;;;;;;;;;;;;;;;;;;;;;;;;;1638:85:16;;;;;;;;;;-1:-1:-1;1684:7:16;1710:6;-1:-1:-1;;;;;1710:6:16;1638:85;;;-1:-1:-1;;;;;10890:32:62;;;10872:51;;10860:2;10845:18;1638:85:16;10726:203:62;954:110:56;;;;;;;;;;;;;:::i;869:23:46:-;;;;;;;;;;-1:-1:-1;869:23:46;;;;-1:-1:-1;;;;;869:23:46;;;2276:93:23;;;;;;;;;;;;;:::i;5864:326:46:-;;;;;;;;;;-1:-1:-1;5864:326:46;;;;;:::i;:::-;;:::i;5580:278::-;;;;;;;;;;-1:-1:-1;5580:278:46;;;;;:::i;:::-;;:::i;3610:178:23:-;;;;;;;;;;-1:-1:-1;3610:178:23;;;;;:::i;:::-;;:::i;630:46:46:-;;;;;;;;;;;;;;;6196:133;;;;;;;;;;-1:-1:-1;6196:133:46;;;;;:::i;:::-;;:::i;599:203:55:-;;;;;;;;;;-1:-1:-1;599:203:55;;;;;:::i;:::-;;:::i;568:55:46:-;;;;;;;;;;;;618:5;568:55;;4545:240;;;;;;;;;;-1:-1:-1;4545:240:46;;;;;:::i;:::-;;:::i;2511:795:47:-;;;;;;:::i;:::-;;:::i;808:196:55:-;;;;;;;;;;-1:-1:-1;808:196:55;;;;;:::i;:::-;;:::i;3846:140:23:-;;;;;;;;;;-1:-1:-1;3846:140:23;;;;;:::i;:::-;-1:-1:-1;;;;;3952:18:23;;;3926:7;3952:18;;;:11;:18;;;;;;;;:27;;;;;;;;;;;;;3846:140;6335:255:46;;;;;;;;;;-1:-1:-1;6335:255:46;;;;;:::i;:::-;;:::i;1617:220:51:-;;;;;;;;;;-1:-1:-1;1617:220:51;;;;;:::i;:::-;;:::i;5370:204:46:-;;;;;;;;;;-1:-1:-1;5370:204:46;;;;;:::i;:::-;;:::i;411:34:51:-;;;;;;;;;;-1:-1:-1;411:34:51;;;;;;;;2543:215:16;;;;;;;;;;-1:-1:-1;2543:215:16;;;;;:::i;:::-;;:::i;4239:247:46:-;;;;;;;;;;-1:-1:-1;4239:247:46;;;;;:::i;:::-;;:::i;847:101:56:-;;;;;;;;;;-1:-1:-1;936:4:56;847:101;;1256:825:46;735:10:29;1532::46;-1:-1:-1;;;;;1508:35:46;;1500:78;;;;-1:-1:-1;;;1500:78:46;;14402:2:62;1500:78:46;;;14384:21:62;14441:2;14421:18;;;14414:30;14480:32;14460:18;;;14453:60;14530:18;;1500:78:46;;;;;;;;;1618:32;;;1589:26;1618:32;;;:19;:32;;;;;1589:61;;;;;:::i;:::-;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;1835:13;:20;1813:11;;:18;;:42;:70;;;;;1882:1;1859:13;:20;:24;1813:70;:124;;;;-1:-1:-1;1913:24:46;;;;;;1887:22;;;;1897:11;;;;1887:22;:::i;:::-;;;;;;;;:50;1813:124;1792:209;;;;-1:-1:-1;;;1792:209:46;;15422:2:62;1792:209:46;;;15404:21:62;15461:2;15441:18;;;15434:30;15500:34;15480:18;;;15473:62;-1:-1:-1;;;15551:18:62;;;15544:36;15597:19;;1792:209:46;15220:402:62;1792:209:46;2012:62;2031:11;2044;;2012:62;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;-1:-1:-1;;2012:62:46;;;;;;;;;;;;;;;;;;;;;;2057:6;;-1:-1:-1;2012:62:46;-1:-1:-1;2065:8:46;;;;;;2012:62;;2065:8;;;;2012:62;;;;;;;;;-1:-1:-1;2012:18:46;;-1:-1:-1;;;2012:62:46:i;:::-;1425:656;1256:825;;;;;;:::o;588:253:56:-;691:4;-1:-1:-1;;;;;;714:37:56;;;;:80;;-1:-1:-1;;;;;;;755:39:56;;-1:-1:-1;;;755:39:56;714:80;:120;;;;798:36;822:11;798:23;:36::i;:::-;707:127;588:253;-1:-1:-1;;588:253:56:o;2074:89:23:-;2119:13;2151:5;2144:12;;;;;:::i;:::-;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;2074:89;:::o;4791:121:46:-;1531:13:16;:11;:13::i;:::-;4870:35:46::1;::::0;-1:-1:-1;;;4870:35:46;;6819:6:62;6807:19;;4870:35:46::1;::::0;::::1;6789:38:62::0;4870:10:46::1;-1:-1:-1::0;;;;;4870:25:46::1;::::0;::::1;::::0;6762:18:62;;4870:35:46::1;;;;;;;;;;;;;;;;;;::::0;::::1;;;;;;;;;;;;::::0;::::1;;;;;;;;;4791:121:::0;:::o;4293:186:23:-;4366:4;735:10:29;4420:31:23;735:10:29;4436:7:23;4445:5;4420:8;:31::i;:::-;-1:-1:-1;4468:4:23;;4293:186;-1:-1:-1;;;4293:186:23:o;6649:140:46:-;1531:13:16;:11;:13::i;:::-;6739:35:46::1;::::0;;::::1;;::::0;;;:22:::1;:35;::::0;;;;:43;6649:140::o;4918:127::-;1531:13:16;:11;:13::i;:::-;5000:38:46::1;::::0;-1:-1:-1;;;5000:38:46;;6819:6:62;6807:19;;5000:38:46::1;::::0;::::1;6789::62::0;5000:10:46::1;-1:-1:-1::0;;;;;5000:28:46::1;::::0;::::1;::::0;6762:18:62;;5000:38:46::1;6645:188:62::0;5039:244:23;5126:4;735:10:29;5182:37:23;5198:4;735:10:29;5213:5:23;5182:15;:37::i;:::-;5229:26;5239:4;5245:2;5249:5;5229:9;:26::i;:::-;-1:-1:-1;5272:4:23;;5039:244;-1:-1:-1;;;;5039:244:23:o;742:469:51:-;957:14;973:11;1039:20;403:1;1082:10;;1094:7;1062:40;;;;;;;;;;;:::i;:::-;;;;-1:-1:-1;;1062:40:51;;;;;;;;;;-1:-1:-1;;;1119:85:51;;1062:40;-1:-1:-1;;;;;;1119:10:51;:23;;;;:85;;1143:11;;1164:4;;1062:40;;1180:7;;1189:14;;;;1119:85;;;:::i;:::-;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;1112:92;;;;;742:469;;;;;;;;;;:::o;6884:247:46:-;7025:32;;;6980:4;7025:32;;;:19;:32;;;;;6996:61;;6980:4;;7025:32;6996:61;;;:::i;:::-;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;7112:11;;7102:22;;;;;;;:::i;:::-;;;;;;;;7084:13;7074:24;;;;;;:50;7067:57;;;6884:247;;;;;:::o;506:87:55:-;567:19;573:3;578:7;567:5;:19::i;:::-;506:87;;:::o;5051:176:46:-;1531:13:16;:11;:13::i;:::-;5165:55:46::1;::::0;-1:-1:-1;;;5165:55:46;;-1:-1:-1;;;;;5165:10:46::1;:29;::::0;::::1;::::0;:55:::1;::::0;5195:11;;5208;;;;5165:55:::1;;;:::i;:::-;;;;;;;;;;;;;;;;;;::::0;::::1;;;;;;;;;;;;::::0;::::1;;;;1217:394:51::0;1506:98;1512:5;1519:11;1532:10;;1506:98;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;-1:-1:-1;;1506:98:51;;;;;;;;;;;;;;;;;;;;;;1544:7;;-1:-1:-1;1553:14:51;;-1:-1:-1;1569:18:51;;1589:14;;;;;;1506:98;;1589:14;;;;1506:98;;;;;;;;;-1:-1:-1;1506:5:51;;-1:-1:-1;;;1506:98:51:i;:::-;1217:394;;;;;;;;;:::o;1912:380:47:-;735:10:29;2162:4:47;2138:29;2130:80;;;;-1:-1:-1;;;2130:80:47;;17756:2:62;2130:80:47;;;17738:21:62;17795:2;17775:18;;;17768:30;17834:34;17814:18;;;17807:62;-1:-1:-1;;;17885:18:62;;;17878:36;17931:19;;2130:80:47;17554:402:62;2130:80:47;2220:65;2242:11;2255;;2220:65;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;-1:-1:-1;;2220:65:47;;;;;;;;;;;;;;;;;;;;;;2268:6;;-1:-1:-1;2220:65:47;-1:-1:-1;2276:8:47;;;;;;2220:65;;2276:8;;;;2220:65;;;;;;;;;-1:-1:-1;2220:21:47;;-1:-1:-1;;;2220:65:47:i;:::-;1912:380;;;;;;:::o;2293:101:16:-;1531:13;:11;:13::i;:::-;2357:30:::1;2384:1;2357:18;:30::i;:::-;2293:101::o:0;682:51:46:-;;;;;;;;;;;;;;;;:::i;:::-;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::o;954:110:56:-;1021:4;1044:13;3222:12:23;;;3144:97;1044:13:56;1037:20;;954:110;:::o;2276:93:23:-;2323:13;2355:7;2348:14;;;;;:::i;5864:326:46:-;5987:35;;;5967:17;5987:35;;;:19;:35;;;;;5967:55;;5943:12;;5967:17;5987:35;5967:55;;;:::i;:::-;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;6040:4;:11;6055:1;6040:16;6032:58;;;;-1:-1:-1;;;6032:58:46;;18163:2:62;6032:58:46;;;18145:21:62;18202:2;18182:18;;;18175:30;18241:31;18221:18;;;18214:59;18290:18;;6032:58:46;17961:353:62;6032:58:46;6107:31;6118:1;6135:2;6121:4;:11;:16;;;;:::i;:::-;6107:4;;:31;:10;:31::i;:::-;6100:38;5864:326;-1:-1:-1;;;5864:326:46:o;5580:278::-;1531:13:16;:11;:13::i;:::-;5751:14:46::1;;5775:4;5734:47;;;;;;;;;;:::i;:::-;;::::0;;-1:-1:-1;;5734:47:46;;::::1;::::0;;;;;;5696:35:::1;::::0;::::1;;::::0;;;:19:::1;5734:47;5696:35:::0;;;:85:::1;::::0;:35;:85:::1;:::i;:::-;;5796:55;5820:14;5836;;5796:55;;;;;;;;:::i;:::-;;;;;;;;5580:278:::0;;;:::o;3610:178:23:-;3679:4;735:10:29;3733:27:23;735:10:29;3750:2:23;3754:5;3733:9;:27::i;6196:133:46:-;1531:13:16;:11;:13::i;:::-;6265:8:46::1;:20:::0;;-1:-1:-1;;;;;;6265:20:46::1;-1:-1:-1::0;;;;;6265:20:46;::::1;::::0;;::::1;::::0;;;6300:22:::1;::::0;10872:51:62;;;6300:22:46::1;::::0;10860:2:62;10845:18;6300:22:46::1;;;;;;;;6196:133:::0;:::o;599:203:55:-;695:13;683:8;:25;675:72;;;;-1:-1:-1;;;675:72:55;;;;;;;:::i;:::-;757:38;768:10;780:1;757:38;;;;;;;;;;;;787:7;757:10;:38::i;:::-;;599:203;;:::o;4545:240:46:-;1531:13:16;:11;:13::i;:::-;4716:62:46::1;::::0;-1:-1:-1;;;4716:62:46;;-1:-1:-1;;;;;4716:10:46::1;:20;::::0;::::1;::::0;:62:::1;::::0;4737:8;;4747;;4757:11;;4770:7;;;;4716:62:::1;;;:::i;:::-;;;;;;;;;;;;;;;;;;::::0;::::1;;;;;;;;;;;;::::0;::::1;;;;2511:795:47::0;2758:27;;;2736:19;2758:27;;;:14;:27;;;;;;:40;;;;2786:11;;;;2758:40;:::i;:::-;;;;;;;;;;;;;;;;-1:-1:-1;;;;;2758:48:47;;;;;;;;;;;;-1:-1:-1;2758:48:47;2816:73;;;;-1:-1:-1;;;2816:73:47;;22255:2:62;2816:73:47;;;22237:21:62;22294:2;22274:18;;;22267:30;22333:34;22313:18;;;22306:62;-1:-1:-1;;;22384:18:62;;;22377:33;22427:19;;2816:73:47;22053:399:62;2816:73:47;2930:11;2917:8;;2907:19;;;;;;;:::i;:::-;;;;;;;;:34;2899:80;;;;-1:-1:-1;;;2899:80:47;;22659:2:62;2899:80:47;;;22641:21:62;22698:2;22678:18;;;22671:30;22737:34;22717:18;;;22710:62;-1:-1:-1;;;22788:18:62;;;22781:31;22829:19;;2899:80:47;22457:397:62;2899:80:47;3025:27;;;3084:1;3025:27;;;:14;:27;;;;;;:40;;;;3053:11;;;;3025:40;:::i;:::-;;;;;;;;;;;;;;;;-1:-1:-1;;;;;3025:48:47;;;;;;;;;;;;:61;;;;3153:65;;;;;;;;;;;;;;;;;;;3175:11;;3188;;3153:65;;;;;;3188:11;3153:65;;3188:11;3153:65;;;;;;;;;-1:-1:-1;;3153:65:47;;;;;;;;;;;;;;;;;;;;;;3201:6;;-1:-1:-1;3153:65:47;-1:-1:-1;3209:8:47;;;;;;3153:65;;3209:8;;;;3153:65;;;;;;;;;-1:-1:-1;3153:21:47;;-1:-1:-1;;;3153:65:47:i;:::-;3233:66;3253:11;3266;;3279:6;3287:11;3233:66;;;;;;;;;;:::i;:::-;;;;;;;;2682:624;2511:795;;;;;;:::o;808:196:55:-;909:13;897:8;:25;889:72;;;;-1:-1:-1;;;889:72:55;;;;;;;:::i;:::-;971:26;981:1;984:3;989:7;971:9;:26::i;:::-;;808:196;;;:::o;6335:255:46:-;1531:13:16;:11;:13::i;:::-;6470:28:46::1;::::0;;::::1;;::::0;;;:15:::1;:28;::::0;;;;;;;:41;;::::1;::::0;;;;;;;;;;:51;;;6536:47;;23580:34:62;;;23630:18;;23623:43;;;;23682:18;;;23675:34;;;6536:47:46::1;::::0;23543:2:62;23528:18;6536:47:46::1;23357:358:62::0;1617:220:51;1531:13:16;:11;:13::i;:::-;1717:22:51::1;:48:::0;;-1:-1:-1;;1717:48:51::1;::::0;::::1;;::::0;;::::1;::::0;;;1780:50:::1;::::0;2023:41:62;;;1780:50:51::1;::::0;2011:2:62;1996:18;1780:50:51::1;1883:187:62::0;5370:204:46;1531:13:16;:11;:13::i;:::-;5470:35:46::1;::::0;::::1;;::::0;;;:19:::1;:35;::::0;;;;:43:::1;5508:5:::0;;5470:35;:43:::1;:::i;:::-;;5528:39;5545:14;5561:5;;5528:39;;;;;;;;:::i;2543:215:16:-:0;1531:13;:11;:13::i;:::-;-1:-1:-1;;;;;2627:22:16;::::1;2623:91;;2672:31;::::0;-1:-1:-1;;;2672:31:16;;2700:1:::1;2672:31;::::0;::::1;10872:51:62::0;10845:18;;2672:31:16::1;10726:203:62::0;2623:91:16::1;2723:28;2742:8;2723:18;:28::i;:::-;2543:215:::0;:::o;4239:247:46:-;4411:68;;-1:-1:-1;;;4411:68:46;;25164:6:62;25197:15;;;4411:68:46;;;25179:34:62;25249:15;;25229:18;;;25222:43;4460:4:46;25281:18:62;;;25274:60;25350:18;;;25343:34;;;4380:12:46;;4411:10;-1:-1:-1;;;;;4411:20:46;;;;25126:19:62;;4411:68:46;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;-1:-1:-1;;4411:68:46;;;;;;;;;;;;:::i;:::-;4404:75;4239:247;-1:-1:-1;;;;;4239:247:46:o;985:549:47:-;1172:12;1186:19;1209:199;1256:9;1279:3;1319:34;;;1355:11;1368;1381:6;1389:8;1296:102;;;;;;;;;;;:::i;:::-;;;;-1:-1:-1;;1296:102:47;;;;;;;;;;;;;;-1:-1:-1;;;;;1296:102:47;-1:-1:-1;;;;;;1296:102:47;;;;;;;;;;1217:4;;1209:199;;:33;:199::i;:::-;1171:237;;;;1423:7;1418:110;;1446:71;1466:11;1479;1492:6;1500:8;1510:6;1446:19;:71::i;523:213:51:-;625:4;-1:-1:-1;;;;;;648:41:51;;-1:-1:-1;;;648:41:51;;:81;;-1:-1:-1;;;;;;;;;;861:40:37;;;693:36:51;762:146:37;1796:162:16;1684:7;1710:6;-1:-1:-1;;;;;1710:6:16;735:10:29;1855:23:16;1851:101;;1901:40;;-1:-1:-1;;;1901:40:16;;735:10:29;1901:40:16;;;10872:51:62;10845:18;;1901:40:16;10726:203:62;8989:128:23;9073:37;9082:5;9089:7;9098:5;9105:4;9073:8;:37::i;10663:477::-;-1:-1:-1;;;;;3952:18:23;;;10762:24;3952:18;;;:11;:18;;;;;;;;:27;;;;;;;;;;-1:-1:-1;;10828:37:23;;10824:310;;10904:5;10885:16;:24;10881:130;;;10936:60;;-1:-1:-1;;;10936:60:23;;-1:-1:-1;;;;;26956:32:62;;10936:60:23;;;26938:51:62;27005:18;;;26998:34;;;27048:18;;;27041:34;;;26911:18;;10936:60:23;26736:345:62;10881:130:23;11052:57;11061:5;11068:7;11096:5;11077:16;:24;11103:5;11052:8;:57::i;5656:300::-;-1:-1:-1;;;;;5739:18:23;;5735:86;;5780:30;;-1:-1:-1;;;5780:30:23;;5807:1;5780:30;;;10872:51:62;10845:18;;5780:30:23;10726:203:62;5735:86:23;-1:-1:-1;;;;;5834:16:23;;5830:86;;5873:32;;-1:-1:-1;;;5873:32:23;;5902:1;5873:32;;;10872:51:62;10845:18;;5873:32:23;10726:203:62;5830:86:23;5925:24;5933:4;5939:2;5943:5;5925:7;:24::i;7721:208::-;-1:-1:-1;;;;;7791:21:23;;7787:91;;7835:32;;-1:-1:-1;;;7835:32:23;;7864:1;7835:32;;;10872:51:62;10845:18;;7835:32:23;10726:203:62;7787:91:23;7887:35;7903:1;7907:7;7916:5;7887:7;:35::i;2325:667:51:-;2592:71;2612:11;403:1;2634:14;343:1;2592:19;:71::i;:::-;2674:11;2688:51;2699:5;2706:11;2719:10;2731:7;2688:10;:51::i;:::-;2674:65;;2750:22;403:1;2795:10;2807:6;2775:39;;;;;;;;;;:::i;:::-;;;;;;;;;;;;;2750:64;;2824:94;2832:11;2845:9;2856:14;2872:18;2892:14;2908:9;2824:7;:94::i;:::-;2959:5;-1:-1:-1;;;;;2934:51:51;2946:11;2934:51;;;2966:10;2978:6;2934:51;;;;;;;:::i;:::-;;;;;;;;2582:410;;2325:667;;;;;;;:::o;1843:476::-;2116:2;2102:17;;2096:24;2144:21;;;2140:173;;2181:52;2190:11;2203;2216:6;2224:8;2181;:52::i;:::-;2140:173;;;2264:38;;-1:-1:-1;;;2264:38:51;;27958:2:62;2264:38:51;;;27940:21:62;27997:2;27977:18;;;27970:30;28036;28016:18;;;28009:58;28084:18;;2264:38:51;27756:352:62;2912:187:16;2985:16;3004:6;;-1:-1:-1;;;;;3020:17:16;;;-1:-1:-1;;;;;;3020:17:16;;;;;;3052:40;;3004:6;;;;;;;3052:40;;2985:16;3052:40;2975:124;2912:187;:::o;9258:2770:44:-;9374:12;9422:7;9406:12;9422:7;9416:2;9406:12;:::i;:::-;:23;;9398:50;;;;-1:-1:-1;;;9398:50:44;;28445:2:62;9398:50:44;;;28427:21:62;28484:2;28464:18;;;28457:30;-1:-1:-1;;;28503:18:62;;;28496:44;28557:18;;9398:50:44;28243:338:62;9398:50:44;9483:16;9492:7;9483:6;:16;:::i;:::-;9466:6;:13;:33;;9458:63;;;;-1:-1:-1;;;9458:63:44;;28788:2:62;9458:63:44;;;28770:21:62;28827:2;28807:18;;;28800:30;-1:-1:-1;;;28846:18:62;;;28839:47;28903:18;;9458:63:44;28586:341:62;9458:63:44;9532:22;9595:15;;9623:1967;;;;11731:4;11725:11;11712:24;;11917:1;11906:9;11899:20;11965:4;11954:9;11950:20;11944:4;11937:34;9588:2397;;9623:1967;9805:4;9799:11;9786:24;;10464:2;10455:7;10451:16;10846:9;10839:17;10833:4;10829:28;10817:9;10806;10802:25;10798:60;10894:7;10890:2;10886:16;11146:6;11132:9;11125:17;11119:4;11115:28;11103:9;11095:6;11091:22;11087:57;11083:70;10920:425;11179:3;11175:2;11172:11;10920:425;;;11317:9;;11306:21;;11220:4;11212:13;;;;11252;10920:425;;;-1:-1:-1;;11363:26:44;;;11571:2;11554:11;-1:-1:-1;;11550:25:44;11544:4;11537:39;-1:-1:-1;9588:2397:44;-1:-1:-1;12012:9:44;9258:2770;-1:-1:-1;;;;9258:2770:44:o;1070:285:56:-;1175:4;735:10:29;-1:-1:-1;;;;;1235:16:56;;;;1231:62;;1253:40;1269:5;1276:7;1285;1253:15;:40::i;:::-;1303:21;1309:5;1316:7;1303:5;:21::i;:::-;-1:-1:-1;1341:7:56;;1070:285;-1:-1:-1;;;;1070:285:56:o;1361:168::-;1456:4;1472:26;1478:10;1490:7;1472:5;:26::i;:::-;-1:-1:-1;1515:7:56;1361:168;-1:-1:-1;;1361:168:56:o;1111:1274:45:-;1265:4;1271:12;1331;1353:13;1376:24;1413:8;1403:19;;-1:-1:-1;;;;;1403:19:45;;;;;;;:::i;:::-;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;-1:-1:-1;1403:19:45;;1376:46;;1919:1;1890;1853:9;1847:16;1815:4;1804:9;1800:20;1766:1;1728:7;1699:4;1677:267;1665:279;;2011:16;2000:27;;2055:8;2046:7;2043:21;2040:76;;;2094:8;2083:19;;2040:76;2201:7;2188:11;2181:28;2321:7;2318:1;2311:4;2298:11;2294:22;2279:50;2356:8;;;;-1:-1:-1;1111:1274:45;-1:-1:-1;;;;;;1111:1274:45:o;1540:366:47:-;1809:8;1799:19;;;;;;1748:14;:27;1763:11;1748:27;;;;;;;;;;;;;;;1776:11;1748:40;;;;;;:::i;:::-;;;;;;;;;;;;;;;;;-1:-1:-1;;;;;1748:48:47;;;;;;;;;:70;;;;1833:66;;;;1847:11;;1860;;1789:6;;1881:8;;1891:7;;1833:66;:::i;:::-;;;;;;;;1540:366;;;;;:::o;9949:432:23:-;-1:-1:-1;;;;;10061:19:23;;10057:89;;10103:32;;-1:-1:-1;;;10103:32:23;;10132:1;10103:32;;;10872:51:62;10845:18;;10103:32:23;10726:203:62;10057:89:23;-1:-1:-1;;;;;10159:21:23;;10155:90;;10203:31;;-1:-1:-1;;;10203:31:23;;10231:1;10203:31;;;10872:51:62;10845:18;;10203:31:23;10726:203:62;10155:90:23;-1:-1:-1;;;;;10254:18:23;;;;;;;:11;:18;;;;;;;;:27;;;;;;;;;:35;;;10299:76;;;;10349:7;-1:-1:-1;;;;;10333:31:23;10342:5;-1:-1:-1;;;;;10333:31:23;;10358:5;10333:31;;;;4001:25:62;;3989:2;3974:18;;3855:177;10333:31:23;;;;;;;;9949:432;;;;:::o;6271:1107::-;-1:-1:-1;;;;;6360:18:23;;6356:540;;6512:5;6496:12;;:21;;;;;;;:::i;:::-;;;;-1:-1:-1;6356:540:23;;-1:-1:-1;6356:540:23;;-1:-1:-1;;;;;6570:15:23;;6548:19;6570:15;;;:9;:15;;;;;;6603:19;;;6599:115;;;6649:50;;-1:-1:-1;;;6649:50:23;;-1:-1:-1;;;;;26956:32:62;;6649:50:23;;;26938:51:62;27005:18;;;26998:34;;;27048:18;;;27041:34;;;26911:18;;6649:50:23;26736:345:62;6599:115:23;-1:-1:-1;;;;;6834:15:23;;;;;;:9;:15;;;;;6852:19;;;;6834:37;;6356:540;-1:-1:-1;;;;;6910:16:23;;6906:425;;7073:12;:21;;;;;;;6906:425;;;-1:-1:-1;;;;;7284:13:23;;;;;;:9;:13;;;;;:22;;;;;;6906:425;7361:2;-1:-1:-1;;;;;7346:25:23;7355:4;-1:-1:-1;;;;;7346:25:23;;7365:5;7346:25;;;;4001::62;;3989:2;3974:18;;3855:177;7346:25:23;;;;;;;;6271:1107;;;:::o;3410:405:51:-;3589:22;;;;3585:224;;;3627:63;3642:11;3655:7;3664:14;3680:9;3627:14;:63::i;:::-;3585:224;;;3729:21;;:26;3721:77;;;;-1:-1:-1;;;3721:77:51;;30150:2:62;3721:77:51;;;30132:21:62;30189:2;30169:18;;;30162:30;30228:34;30208:18;;;30201:62;-1:-1:-1;;;30279:18:62;;;30272:36;30325:19;;3721:77:51;29948:402:62;2403:602:46;2679:32;;;2650:26;2679:32;;;:19;:32;;;;;2650:61;;;;;:::i;:::-;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;2729:13;:20;2753:1;2729:25;2721:86;;;;-1:-1:-1;;;2721:86:46;;30557:2:62;2721:86:46;;;30539:21:62;30596:2;30576:18;;;30569:30;30635:34;30615:18;;;30608:62;-1:-1:-1;;;30686:18:62;;;30679:46;30742:19;;2721:86:46;30355:412:62;2721:86:46;2817:47;2835:11;2848:8;:15;2817:17;:47::i;:::-;2874:124;;-1:-1:-1;;;2874:124:46;;-1:-1:-1;;;;;2874:10:46;:15;;;;2897:10;;2874:124;;2909:11;;2922:13;;2937:8;;2947:14;;2963:18;;2983:14;;2874:124;;;:::i;:::-;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;2640:365;2403:602;;;;;;:::o;2998:406:51:-;3149:27;3178:11;3204:8;3193:43;;;;;;;;;;;;:::i;:::-;3146:90;;-1:-1:-1;3146:90:51;-1:-1:-1;3247:10:51;;-1:-1:-1;3260:27:51;3146:90;3247:10;3260:24;:27::i;:::-;3247:40;;3307:34;3317:11;3330:2;3334:6;3307:9;:34::i;:::-;3298:43;;3386:2;-1:-1:-1;;;;;3356:41:51;3373:11;3356:41;;;3390:6;3356:41;;;;4001:25:62;;3989:2;3974:18;;3855:177;3356:41:51;;;;;;;;3136:268;;;2998:406;;;;:::o;8247:206:23:-;-1:-1:-1;;;;;8317:21:23;;8313:89;;8361:30;;-1:-1:-1;;;8361:30:23;;8388:1;8361:30;;;10872:51:62;10845:18;;8361:30:23;10726:203:62;8313:89:23;8411:35;8419:7;8436:1;8440:5;8411:7;:35::i;3011:453:46:-;3184:21;3208:28;3221:14;3208:12;:28::i;:::-;3265;;;;3246:16;3265:28;;;:15;:28;;;;;;;;:35;;;;;;;;;;3184:52;;-1:-1:-1;3318:15:46;3310:54;;;;-1:-1:-1;;;3310:54:46;;32346:2:62;3310:54:46;;;32328:21:62;32385:2;32365:18;;;32358:30;32424:28;32404:18;;;32397:56;32470:18;;3310:54:46;32144:350:62;3310:54:46;3402:23;3416:9;3402:11;:23;:::i;:::-;3382:16;:43;;3374:83;;;;-1:-1:-1;;;3374:83:46;;32701:2:62;3374:83:46;;;32683:21:62;32740:2;32720:18;;;32713:30;32779:29;32759:18;;;32752:57;32826:18;;3374:83:46;32499:351:62;3742:395:46;3864:35;;;3840:21;3864:35;;;:22;:35;;;;;;;3913:21;;;3909:135;;-1:-1:-1;618:5:46;3909:135;4077:16;4061:12;:32;;4053:77;;;;-1:-1:-1;;;4053:77:46;;33057:2:62;4053:77:46;;;33039:21:62;;;33076:18;;;33069:30;33135:34;33115:18;;;33108:62;33187:18;;4053:77:46;32855:356:62;12034:351:44;12110:7;12154:11;:6;12163:2;12154:11;:::i;:::-;12137:6;:13;:28;;12129:62;;;;-1:-1:-1;;;12129:62:44;;33418:2:62;12129:62:44;;;33400:21:62;33457:2;33437:18;;;33430:30;-1:-1:-1;;;33476:18:62;;;33469:51;33537:18;;12129:62:44;33216:345:62;12129:62:44;-1:-1:-1;12279:30:44;12295:4;12279:30;12273:37;-1:-1:-1;;;12269:71:44;;;12034:351::o;3470:266:46:-;3552:13;3610:2;3585:14;:21;:27;;3577:68;;;;-1:-1:-1;;;3577:68:46;;33768:2:62;3577:68:46;;;33750:21:62;33807:2;33787:18;;;33780:30;33846;33826:18;;;33819:58;33894:18;;3577:68:46;33566:352:62;3577:68:46;-1:-1:-1;3716:2:46;3696:23;3690:30;;3470:266::o;14:117:62:-;99:6;92:5;88:18;81:5;78:29;68:57;;121:1;118;111:12;136:347;187:8;197:6;251:3;244:4;236:6;232:17;228:27;218:55;;269:1;266;259:12;218:55;-1:-1:-1;292:20:62;;-1:-1:-1;;;;;324:30:62;;321:50;;;367:1;364;357:12;321:50;404:4;396:6;392:17;380:29;;456:3;449:4;440:6;432;428:19;424:30;421:39;418:59;;;473:1;470;463:12;418:59;136:347;;;;;:::o;488:171::-;555:20;;-1:-1:-1;;;;;604:30:62;;594:41;;584:69;;649:1;646;639:12;584:69;488:171;;;:::o;664:923::-;770:6;778;786;794;802;810;863:3;851:9;842:7;838:23;834:33;831:53;;;880:1;877;870:12;831:53;919:9;906:23;938:30;962:5;938:30;:::i;:::-;987:5;-1:-1:-1;1043:2:62;1028:18;;1015:32;-1:-1:-1;;;;;1096:14:62;;;1093:34;;;1123:1;1120;1113:12;1093:34;1162:58;1212:7;1203:6;1192:9;1188:22;1162:58;:::i;:::-;1239:8;;-1:-1:-1;1136:84:62;-1:-1:-1;1136:84:62;;-1:-1:-1;1293:37:62;1326:2;1311:18;;1293:37;:::i;:::-;1283:47;;1383:2;1372:9;1368:18;1355:32;1339:48;;1412:2;1402:8;1399:16;1396:36;;;1428:1;1425;1418:12;1396:36;;1467:60;1519:7;1508:8;1497:9;1493:24;1467:60;:::i;:::-;664:923;;;;-1:-1:-1;664:923:62;;-1:-1:-1;664:923:62;;1546:8;;664:923;-1:-1:-1;;;664:923:62:o;1592:286::-;1650:6;1703:2;1691:9;1682:7;1678:23;1674:32;1671:52;;;1719:1;1716;1709:12;1671:52;1745:23;;-1:-1:-1;;;;;;1797:32:62;;1787:43;;1777:71;;1844:1;1841;1834:12;2075:250;2160:1;2170:113;2184:6;2181:1;2178:13;2170:113;;;2260:11;;;2254:18;2241:11;;;2234:39;2206:2;2199:10;2170:113;;;-1:-1:-1;;2317:1:62;2299:16;;2292:27;2075:250::o;2330:271::-;2372:3;2410:5;2404:12;2437:6;2432:3;2425:19;2453:76;2522:6;2515:4;2510:3;2506:14;2499:4;2492:5;2488:16;2453:76;:::i;:::-;2583:2;2562:15;-1:-1:-1;;2558:29:62;2549:39;;;;2590:4;2545:50;;2330:271;-1:-1:-1;;2330:271:62:o;2606:220::-;2755:2;2744:9;2737:21;2718:4;2775:45;2816:2;2805:9;2801:18;2793:6;2775:45;:::i;2831:245::-;2889:6;2942:2;2930:9;2921:7;2917:23;2913:32;2910:52;;;2958:1;2955;2948:12;2910:52;2997:9;2984:23;3016:30;3040:5;3016:30;:::i;3081:131::-;-1:-1:-1;;;;;3156:31:62;;3146:42;;3136:70;;3202:1;3199;3192:12;3217:315;3285:6;3293;3346:2;3334:9;3325:7;3321:23;3317:32;3314:52;;;3362:1;3359;3352:12;3314:52;3401:9;3388:23;3420:31;3445:5;3420:31;:::i;:::-;3470:5;3522:2;3507:18;;;;3494:32;;-1:-1:-1;;;3217:315:62:o;3537:313::-;3604:6;3612;3665:2;3653:9;3644:7;3640:23;3636:32;3633:52;;;3681:1;3678;3671:12;3633:52;3720:9;3707:23;3739:30;3763:5;3739:30;:::i;4037:456::-;4114:6;4122;4130;4183:2;4171:9;4162:7;4158:23;4154:32;4151:52;;;4199:1;4196;4189:12;4151:52;4238:9;4225:23;4257:31;4282:5;4257:31;:::i;:::-;4307:5;-1:-1:-1;4364:2:62;4349:18;;4336:32;4377:33;4336:32;4377:33;:::i;:::-;4037:456;;4429:7;;-1:-1:-1;;;4483:2:62;4468:18;;;;4455:32;;4037:456::o;4498:160::-;4563:20;;4619:13;;4612:21;4602:32;;4592:60;;4648:1;4645;4638:12;4663:988;4776:6;4784;4792;4800;4808;4816;4824;4877:3;4865:9;4856:7;4852:23;4848:33;4845:53;;;4894:1;4891;4884:12;4845:53;4933:9;4920:23;4952:30;4976:5;4952:30;:::i;:::-;5001:5;-1:-1:-1;5057:2:62;5042:18;;5029:32;-1:-1:-1;;;;;5110:14:62;;;5107:34;;;5137:1;5134;5127:12;5107:34;5176:58;5226:7;5217:6;5206:9;5202:22;5176:58;:::i;:::-;5253:8;;-1:-1:-1;5150:84:62;-1:-1:-1;5335:2:62;5320:18;;5307:32;;-1:-1:-1;5150:84:62;;-1:-1:-1;5358:35:62;5389:2;5374:18;;5358:35;:::i;:::-;5348:45;;5446:3;5435:9;5431:19;5418:33;5402:49;;5476:2;5466:8;5463:16;5460:36;;;5492:1;5489;5482:12;5460:36;;5531:60;5583:7;5572:8;5561:9;5557:24;5531:60;:::i;:::-;4663:988;;;;-1:-1:-1;4663:988:62;;-1:-1:-1;4663:988:62;;;;5505:86;;-1:-1:-1;;;4663:988:62:o;6098:542::-;6176:6;6184;6192;6245:2;6233:9;6224:7;6220:23;6216:32;6213:52;;;6261:1;6258;6251:12;6213:52;6300:9;6287:23;6319:30;6343:5;6319:30;:::i;:::-;6368:5;-1:-1:-1;6424:2:62;6409:18;;6396:32;-1:-1:-1;;;;;6440:30:62;;6437:50;;;6483:1;6480;6473:12;6437:50;6522:58;6572:7;6563:6;6552:9;6548:22;6522:58;:::i;:::-;6098:542;;6599:8;;-1:-1:-1;6496:84:62;;-1:-1:-1;;;;6098:542:62:o;6838:1353::-;6980:6;6988;6996;7004;7012;7020;7028;7036;7044;7097:3;7085:9;7076:7;7072:23;7068:33;7065:53;;;7114:1;7111;7104:12;7065:53;7153:9;7140:23;7172:31;7197:5;7172:31;:::i;:::-;7222:5;-1:-1:-1;7279:2:62;7264:18;;7251:32;7292;7251;7292;:::i;:::-;7343:7;-1:-1:-1;7401:2:62;7386:18;;7373:32;-1:-1:-1;;;;;7454:14:62;;;7451:34;;;7481:1;7478;7471:12;7451:34;7520:58;7570:7;7561:6;7550:9;7546:22;7520:58;:::i;:::-;7597:8;;-1:-1:-1;7494:84:62;-1:-1:-1;7679:2:62;7664:18;;7651:32;;-1:-1:-1;7735:3:62;7720:19;;7707:33;;-1:-1:-1;7749:33:62;7707;7749;:::i;:::-;7801:7;;-1:-1:-1;7860:3:62;7845:19;;7832:33;;7874;7832;7874;:::i;:::-;7926:7;;-1:-1:-1;7986:3:62;7971:19;;7958:33;;8003:16;;;8000:36;;;8032:1;8029;8022:12;8000:36;;8071:60;8123:7;8112:8;8101:9;8097:24;8071:60;:::i;:::-;8045:86;;8150:8;8140:18;;;8177:8;8167:18;;;6838:1353;;;;;;;;;;;:::o;8196:127::-;8257:10;8252:3;8248:20;8245:1;8238:31;8288:4;8285:1;8278:15;8312:4;8309:1;8302:15;8328:275;8399:2;8393:9;8464:2;8445:13;;-1:-1:-1;;8441:27:62;8429:40;;-1:-1:-1;;;;;8484:34:62;;8520:22;;;8481:62;8478:88;;;8546:18;;:::i;:::-;8582:2;8575:22;8328:275;;-1:-1:-1;8328:275:62:o;8608:186::-;8656:4;-1:-1:-1;;;;;8681:6:62;8678:30;8675:56;;;8711:18;;:::i;:::-;-1:-1:-1;8777:2:62;8756:15;-1:-1:-1;;8752:29:62;8783:4;8748:40;;8608:186::o;8799:876::-;8883:6;8891;8899;8952:2;8940:9;8931:7;8927:23;8923:32;8920:52;;;8968:1;8965;8958:12;8920:52;9007:9;8994:23;9026:30;9050:5;9026:30;:::i;:::-;9075:5;-1:-1:-1;9131:2:62;9116:18;;9103:32;-1:-1:-1;;;;;9147:30:62;;9144:50;;;9190:1;9187;9180:12;9144:50;9213:22;;9266:4;9258:13;;9254:27;-1:-1:-1;9244:55:62;;9295:1;9292;9285:12;9244:55;9331:2;9318:16;9356:48;9372:31;9400:2;9372:31;:::i;:::-;9356:48;:::i;:::-;9427:2;9420:5;9413:17;9467:7;9462:2;9457;9453;9449:11;9445:20;9442:33;9439:53;;;9488:1;9485;9478:12;9439:53;9543:2;9538;9534;9530:11;9525:2;9518:5;9514:14;9501:45;9587:1;9582:2;9577;9570:5;9566:14;9562:23;9555:34;9608:5;9598:15;;;;;9632:37;9665:2;9654:9;9650:18;9632:37;:::i;:::-;9622:47;;8799:876;;;;;:::o;9862:247::-;9921:6;9974:2;9962:9;9953:7;9949:23;9945:32;9942:52;;;9990:1;9987;9980:12;9942:52;10029:9;10016:23;10048:31;10073:5;10048:31;:::i;10337:384::-;10403:6;10411;10464:2;10452:9;10443:7;10439:23;10435:32;10432:52;;;10480:1;10477;10470:12;10432:52;10519:9;10506:23;10538:30;10562:5;10538:30;:::i;:::-;10587:5;-1:-1:-1;10644:2:62;10629:18;;10616:32;10657;10616;10657;:::i;:::-;10708:7;10698:17;;;10337:384;;;;;:::o;11170:248::-;11238:6;11246;11299:2;11287:9;11278:7;11274:23;11270:32;11267:52;;;11315:1;11312;11305:12;11267:52;-1:-1:-1;;11338:23:62;;;11408:2;11393:18;;;11380:32;;-1:-1:-1;11170:248:62:o;11423:750::-;11518:6;11526;11534;11542;11550;11603:3;11591:9;11582:7;11578:23;11574:33;11571:53;;;11620:1;11617;11610:12;11571:53;11659:9;11646:23;11678:30;11702:5;11678:30;:::i;:::-;11727:5;-1:-1:-1;11784:2:62;11769:18;;11756:32;11797;11756;11797;:::i;:::-;11848:7;-1:-1:-1;11902:2:62;11887:18;;11874:32;;-1:-1:-1;11957:2:62;11942:18;;11929:32;-1:-1:-1;;;;;11973:30:62;;11970:50;;;12016:1;12013;12006:12;11970:50;12055:58;12105:7;12096:6;12085:9;12081:22;12055:58;:::i;:::-;11423:750;;;;-1:-1:-1;11423:750:62;;-1:-1:-1;12132:8:62;;12029:84;11423:750;-1:-1:-1;;;11423:750:62:o;12178:383::-;12255:6;12263;12271;12324:2;12312:9;12303:7;12299:23;12295:32;12292:52;;;12340:1;12337;12330:12;12292:52;12376:9;12363:23;12353:33;;12436:2;12425:9;12421:18;12408:32;12449:31;12474:5;12449:31;:::i;12566:388::-;12634:6;12642;12695:2;12683:9;12674:7;12670:23;12666:32;12663:52;;;12711:1;12708;12701:12;12663:52;12750:9;12737:23;12769:31;12794:5;12769:31;:::i;:::-;12819:5;-1:-1:-1;12876:2:62;12861:18;;12848:32;12889:33;12848:32;12889:33;:::i;12959:452::-;13034:6;13042;13050;13103:2;13091:9;13082:7;13078:23;13074:32;13071:52;;;13119:1;13116;13109:12;13071:52;13158:9;13145:23;13177:30;13201:5;13177:30;:::i;:::-;13226:5;-1:-1:-1;13283:2:62;13268:18;;13255:32;13296;13255;13296;:::i;13416:180::-;13472:6;13525:2;13513:9;13504:7;13500:23;13496:32;13493:52;;;13541:1;13538;13531:12;13493:52;13564:26;13580:9;13564:26;:::i;13601:594::-;13685:6;13693;13701;13709;13762:3;13750:9;13741:7;13737:23;13733:33;13730:53;;;13779:1;13776;13769:12;13730:53;13818:9;13805:23;13837:30;13861:5;13837:30;:::i;:::-;13886:5;-1:-1:-1;13943:2:62;13928:18;;13915:32;13956;13915;13956;:::i;:::-;14007:7;-1:-1:-1;14066:2:62;14051:18;;14038:32;14079:33;14038:32;14079:33;:::i;:::-;13601:594;;;;-1:-1:-1;14131:7:62;;14185:2;14170:18;14157:32;;-1:-1:-1;;13601:594:62:o;14559:380::-;14638:1;14634:12;;;;14681;;;14702:61;;14756:4;14748:6;14744:17;14734:27;;14702:61;14809:2;14801:6;14798:14;14778:18;14775:38;14772:161;;14855:10;14850:3;14846:20;14843:1;14836:31;14890:4;14887:1;14880:15;14918:4;14915:1;14908:15;14772:161;;14559:380;;;:::o;14944:271::-;15127:6;15119;15114:3;15101:33;15083:3;15153:16;;15178:13;;;15153:16;14944:271;-1:-1:-1;14944:271:62:o;15627:266::-;15715:6;15710:3;15703:19;15767:6;15760:5;15753:4;15748:3;15744:14;15731:43;-1:-1:-1;15819:1:62;15794:16;;;15812:4;15790:27;;;15783:38;;;;15875:2;15854:15;;;-1:-1:-1;;15850:29:62;15841:39;;;15837:50;;15627:266::o;15898:397::-;16121:6;16113;16109:19;16098:9;16091:38;16165:2;16160;16149:9;16145:18;16138:30;16072:4;16185:61;16242:2;16231:9;16227:18;16219:6;16211;16185:61;:::i;:::-;16177:69;;16282:6;16277:2;16266:9;16262:18;16255:34;15898:397;;;;;;;:::o;16300:668::-;16591:6;16579:19;;16561:38;;-1:-1:-1;;;;;16635:32:62;;16630:2;16615:18;;16608:60;16655:3;16699:2;16684:18;;16677:31;;;-1:-1:-1;;16731:46:62;;16757:19;;16749:6;16731:46;:::i;:::-;16827:6;16820:14;16813:22;16808:2;16797:9;16793:18;16786:50;16885:9;16877:6;16873:22;16867:3;16856:9;16852:19;16845:51;16913:49;16955:6;16947;16939;16913:49;:::i;:::-;16905:57;16300:668;-1:-1:-1;;;;;;;;;16300:668:62:o;16973:245::-;17052:6;17060;17113:2;17101:9;17092:7;17088:23;17084:32;17081:52;;;17129:1;17126;17119:12;17081:52;-1:-1:-1;;17152:16:62;;17208:2;17193:18;;;17187:25;17152:16;;17187:25;;-1:-1:-1;16973:245:62:o;17223:326::-;17418:6;17410;17406:19;17395:9;17388:38;17462:2;17457;17446:9;17442:18;17435:30;17369:4;17482:61;17539:2;17528:9;17524:18;17516:6;17508;17482:61;:::i;18319:127::-;18380:10;18375:3;18371:20;18368:1;18361:31;18411:4;18408:1;18401:15;18435:4;18432:1;18425:15;18451:128;18518:9;;;18539:11;;;18536:37;;;18553:18;;:::i;18584:360::-;18795:6;18787;18782:3;18769:33;18865:2;18861:15;;;;-1:-1:-1;;18857:53:62;18821:16;;18846:65;;;18935:2;18927:11;;18584:360;-1:-1:-1;18584:360:62:o;19074:544::-;19175:2;19170:3;19167:11;19164:448;;;19211:1;19236:5;19232:2;19225:17;19281:4;19277:2;19267:19;19351:2;19339:10;19335:19;19332:1;19328:27;19322:4;19318:38;19387:4;19375:10;19372:20;19369:47;;;-1:-1:-1;19410:4:62;19369:47;19465:2;19460:3;19456:12;19453:1;19449:20;19443:4;19439:31;19429:41;;19520:82;19538:2;19531:5;19528:13;19520:82;;;19583:17;;;19564:1;19553:13;19520:82;;19794:1348;19918:3;19912:10;-1:-1:-1;;;;;19937:6:62;19934:30;19931:56;;;19967:18;;:::i;:::-;19996:96;20085:6;20045:38;20077:4;20071:11;20045:38;:::i;:::-;20039:4;19996:96;:::i;:::-;20147:4;;20211:2;20200:14;;20228:1;20223:662;;;;20929:1;20946:6;20943:89;;;-1:-1:-1;20998:19:62;;;20992:26;20943:89;-1:-1:-1;;19751:1:62;19747:11;;;19743:24;19739:29;19729:40;19775:1;19771:11;;;19726:57;21045:81;;20193:943;;20223:662;19021:1;19014:14;;;19058:4;19045:18;;-1:-1:-1;;20259:20:62;;;20376:236;20390:7;20387:1;20384:14;20376:236;;;20479:19;;;20473:26;20458:42;;20571:27;;;;20539:1;20527:14;;;;20406:19;;20376:236;;;20380:3;20640:6;20631:7;20628:19;20625:201;;;20701:19;;;20695:26;-1:-1:-1;;20784:1:62;20780:14;;;20796:3;20776:24;20772:37;20768:42;20753:58;20738:74;;20625:201;-1:-1:-1;;;;;20872:1:62;20856:14;;;20852:22;20839:36;;-1:-1:-1;19794:1348:62:o;21147:398::-;21349:2;21331:21;;;21388:2;21368:18;;;21361:30;21427:34;21422:2;21407:18;;21400:62;-1:-1:-1;;;21493:2:62;21478:18;;21471:32;21535:3;21520:19;;21147:398::o;21550:498::-;21750:4;21779:6;21824:2;21816:6;21812:15;21801:9;21794:34;21876:2;21868:6;21864:15;21859:2;21848:9;21844:18;21837:43;;21916:6;21911:2;21900:9;21896:18;21889:34;21959:3;21954:2;21943:9;21939:18;21932:31;21980:62;22037:3;22026:9;22022:19;22014:6;22006;21980:62;:::i;:::-;21972:70;21550:498;-1:-1:-1;;;;;;;21550:498:62:o;22859:493::-;23108:6;23100;23096:19;23085:9;23078:38;23152:3;23147:2;23136:9;23132:18;23125:31;23059:4;23173:62;23230:3;23219:9;23215:19;23207:6;23199;23173:62;:::i;:::-;-1:-1:-1;;;;;23271:31:62;;;;23266:2;23251:18;;23244:59;-1:-1:-1;23334:2:62;23319:18;23312:34;23165:70;22859:493;-1:-1:-1;;;22859:493:62:o;23720:1202::-;-1:-1:-1;;;;;23837:3:62;23834:27;23831:53;;;23864:18;;:::i;:::-;23893:93;23982:3;23942:38;23974:4;23968:11;23942:38;:::i;:::-;23936:4;23893:93;:::i;:::-;24012:1;24037:2;24032:3;24029:11;24054:1;24049:615;;;;24708:1;24725:3;24722:93;;;-1:-1:-1;24781:19:62;;;24768:33;24722:93;-1:-1:-1;;19751:1:62;19747:11;;;19743:24;19739:29;19729:40;19775:1;19771:11;;;19726:57;24828:78;;24022:894;;24049:615;19021:1;19014:14;;;19058:4;19045:18;;-1:-1:-1;;24085:17:62;;;24185:9;24207:229;24221:7;24218:1;24215:14;24207:229;;;24310:19;;;24297:33;24282:49;;24417:4;24402:20;;;;24370:1;24358:14;;;;24237:12;24207:229;;;24211:3;24464;24455:7;24452:16;24449:159;;;24588:1;24584:6;24578:3;24572;24569:1;24565:11;24561:21;24557:34;24553:39;24540:9;24535:3;24531:19;24518:33;24514:79;24506:6;24499:95;24449:159;;;24651:1;24645:3;24642:1;24638:11;24634:19;24628:4;24621:33;24022:894;;23720:1202;;;:::o;25388:441::-;25441:5;25494:3;25487:4;25479:6;25475:17;25471:27;25461:55;;25512:1;25509;25502:12;25461:55;25541:6;25535:13;25572:48;25588:31;25616:2;25588:31;:::i;25572:48::-;25645:2;25636:7;25629:19;25691:3;25684:4;25679:2;25671:6;25667:15;25663:26;25660:35;25657:55;;;25708:1;25705;25698:12;25657:55;25721:77;25795:2;25788:4;25779:7;25775:18;25768:4;25760:6;25756:17;25721:77;:::i;:::-;25816:7;25388:441;-1:-1:-1;;;;25388:441:62:o;25834:335::-;25913:6;25966:2;25954:9;25945:7;25941:23;25937:32;25934:52;;;25982:1;25979;25972:12;25934:52;26015:9;26009:16;-1:-1:-1;;;;;26040:6:62;26037:30;26034:50;;;26080:1;26077;26070:12;26034:50;26103:60;26155:7;26146:6;26135:9;26131:22;26103:60;:::i;26174:557::-;26431:6;26423;26419:19;26408:9;26401:38;26475:3;26470:2;26459:9;26455:18;26448:31;26382:4;26502:46;26543:3;26532:9;26528:19;26520:6;26502:46;:::i;:::-;-1:-1:-1;;;;;26588:6:62;26584:31;26579:2;26568:9;26564:18;26557:59;26664:9;26656:6;26652:22;26647:2;26636:9;26632:18;26625:50;26692:33;26718:6;26710;26692:33;:::i;27086:371::-;27299:6;27291;27287:19;27276:9;27269:38;27343:2;27338;27327:9;27323:18;27316:30;27250:4;27363:45;27404:2;27393:9;27389:18;27381:6;27363:45;:::i;:::-;27355:53;;27444:6;27439:2;27428:9;27424:18;27417:34;27086:371;;;;;;:::o;27462:289::-;27637:2;27626:9;27619:21;27600:4;27657:45;27698:2;27687:9;27683:18;27675:6;27657:45;:::i;:::-;27649:53;;27738:6;27733:2;27722:9;27718:18;27711:34;27462:289;;;;;:::o;28113:125::-;28178:9;;;28199:10;;;28196:36;;;28212:18;;:::i;28932:287::-;29061:3;29099:6;29093:13;29115:66;29174:6;29169:3;29162:4;29154:6;29150:17;29115:66;:::i;:::-;29197:16;;;;;28932:287;-1:-1:-1;;28932:287:62:o;29224:719::-;29527:6;29519;29515:19;29504:9;29497:38;29571:3;29566:2;29555:9;29551:18;29544:31;29478:4;29598:46;29639:3;29628:9;29624:19;29616:6;29598:46;:::i;:::-;-1:-1:-1;;;;;29684:6:62;29680:31;29675:2;29664:9;29660:18;29653:59;29760:9;29752:6;29748:22;29743:2;29732:9;29728:18;29721:50;29794:33;29820:6;29812;29794:33;:::i;:::-;29780:47;;29876:9;29868:6;29864:22;29858:3;29847:9;29843:19;29836:51;29904:33;29930:6;29922;29904:33;:::i;:::-;29896:41;29224:719;-1:-1:-1;;;;;;;;29224:719:62:o;30772:840::-;31121:6;31113;31109:19;31098:9;31091:38;31165:3;31160:2;31149:9;31145:18;31138:31;31072:4;31192:46;31233:3;31222:9;31218:19;31210:6;31192:46;:::i;:::-;31286:9;31278:6;31274:22;31269:2;31258:9;31254:18;31247:50;31320:33;31346:6;31338;31320:33;:::i;:::-;-1:-1:-1;;;;;31427:15:62;;;31422:2;31407:18;;31400:43;31480:15;;31474:3;31459:19;;31452:44;31533:22;;;31380:3;31512:19;;31505:51;31306:47;-1:-1:-1;31573:33:62;31306:47;31591:6;31573:33;:::i;31617:522::-;31713:6;31721;31729;31782:2;31770:9;31761:7;31757:23;31753:32;31750:52;;;31798:1;31795;31788:12;31750:52;31830:9;31824:16;31849:30;31873:5;31849:30;:::i;:::-;31947:2;31932:18;;31926:25;31898:5;;-1:-1:-1;;;;;;31963:30:62;;31960:50;;;32006:1;32003;31996:12;31960:50;32029:60;32081:7;32072:6;32061:9;32057:22;32029:60;:::i;:::-;32019:70;;;32129:2;32118:9;32114:18;32108:25;32098:35;;31617:522;;;;;:::o",
      "linkReferences": {},
      "immutableReferences": {
        "49018": [
          {
            "start": 1767,
            "length": 32
          },
          {
            "start": 2248,
            "length": 32
          },
          {
            "start": 3047,
            "length": 32
          },
          {
            "start": 3239,
            "length": 32
          },
          {
            "start": 3397,
            "length": 32
          },
          {
            "start": 3790,
            "length": 32
          },
          {
            "start": 5068,
            "length": 32
          },
          {
            "start": 6138,
            "length": 32
          },
          {
            "start": 8680,
            "length": 32
          }
        ]
      }
    },
    "methodIdentifiers": {
      "DEFAULT_PAYLOAD_SIZE_LIMIT()": "c4461834",
      "NO_EXTRA_GAS()": "44770515",
      "PT_SEND()": "4c42899a",
      "allowance(address,address)": "dd62ed3e",
      "approve(address,uint256)": "095ea7b3",
      "balanceOf(address)": "70a08231",
      "circulatingSupply()": "9358928b",
      "credit(uint256,address,uint256)": "dc396e5b",
      "debitFromChain(uint256,uint256)": "c3e806d2",
      "decimals()": "313ce567",
      "estimateSendFee(uint16,bytes,uint256,bool,bytes)": "2a205e3d",
      "failedMessages(uint16,bytes,uint64)": "5b8c41e6",
      "forceResumeReceive(uint16,bytes)": "42d65a8d",
      "getConfig(uint16,uint16,address,uint256)": "f5ecbdbc",
      "getTrustedRemoteAddress(uint16)": "9f38369a",
      "isTrustedRemote(uint16,bytes)": "3d8b38f6",
      "lzEndpoint()": "b353aaa7",
      "lzReceive(uint16,bytes,uint64,bytes)": "001d3567",
      "minDstGasLookup(uint16,uint16)": "8cfd8f5c",
      "mint(address,uint256)": "40c10f19",
      "name()": "06fdde03",
      "nonblockingLzReceive(uint16,bytes,uint64,bytes)": "66ad5c8a",
      "owner()": "8da5cb5b",
      "payloadSizeLimitLookup(uint16)": "3f1f4fa4",
      "precrime()": "950c8a74",
      "renounceOwnership()": "715018a6",
      "retryMessage(uint16,bytes,uint64,bytes)": "d1deba1f",
      "sendFrom(address,uint16,bytes,uint256,address,address,bytes)": "51905636",
      "setConfig(uint16,uint16,uint256,bytes)": "cbed8b9c",
      "setMinDstGas(uint16,uint16,uint256)": "df2a5b3b",
      "setPayloadSizeLimit(uint16,uint256)": "0df37483",
      "setPrecrime(address)": "baf3292d",
      "setReceiveVersion(uint16)": "10ddb137",
      "setSendVersion(uint16)": "07e0db17",
      "setTrustedRemote(uint16,bytes)": "eb8d72b7",
      "setTrustedRemoteAddress(uint16,bytes)": "a6c3d165",
      "setUseCustomAdapterParams(bool)": "eab45d9c",
      "supportsInterface(bytes4)": "01ffc9a7",
      "symbol()": "95d89b41",
      "token()": "fc0c546a",
      "totalSupply()": "18160ddd",
      "transfer(address,uint256)": "a9059cbb",
      "transferFrom(address,address,uint256)": "23b872dd",
      "transferOwnership(address)": "f2fde38b",
      "trustedRemoteLookup(uint16)": "7533d788",
      "useCustomAdapterParams()": "ed629c5c"
    },
    "rawMetadata": "{\"compiler\":{\"version\":\"0.8.20+commit.a1b79de6\"},\"language\":\"Solidity\",\"output\":{\"abi\":[{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"_initialSupply\",\"type\":\"uint256\"},{\"internalType\":\"address\",\"name\":\"_lzEndpoint\",\"type\":\"address\"}],\"stateMutability\":\"nonpayable\",\"type\":\"constructor\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"spender\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"allowance\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"needed\",\"type\":\"uint256\"}],\"name\":\"ERC20InsufficientAllowance\",\"type\":\"error\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"sender\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"balance\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"needed\",\"type\":\"uint256\"}],\"name\":\"ERC20InsufficientBalance\",\"type\":\"error\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"approver\",\"type\":\"address\"}],\"name\":\"ERC20InvalidApprover\",\"type\":\"error\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"receiver\",\"type\":\"address\"}],\"name\":\"ERC20InvalidReceiver\",\"type\":\"error\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"sender\",\"type\":\"address\"}],\"name\":\"ERC20InvalidSender\",\"type\":\"error\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"spender\",\"type\":\"address\"}],\"name\":\"ERC20InvalidSpender\",\"type\":\"error\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"owner\",\"type\":\"address\"}],\"name\":\"OwnableInvalidOwner\",\"type\":\"error\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"}],\"name\":\"OwnableUnauthorizedAccount\",\"type\":\"error\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"owner\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"spender\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"value\",\"type\":\"uint256\"}],\"name\":\"Approval\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"uint16\",\"name\":\"_srcChainId\",\"type\":\"uint16\"},{\"indexed\":false,\"internalType\":\"bytes\",\"name\":\"_srcAddress\",\"type\":\"bytes\"},{\"indexed\":false,\"internalType\":\"uint64\",\"name\":\"_nonce\",\"type\":\"uint64\"},{\"indexed\":false,\"internalType\":\"bytes\",\"name\":\"_payload\",\"type\":\"bytes\"},{\"indexed\":false,\"internalType\":\"bytes\",\"name\":\"_reason\",\"type\":\"bytes\"}],\"name\":\"MessageFailed\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"previousOwner\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"newOwner\",\"type\":\"address\"}],\"name\":\"OwnershipTransferred\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"uint16\",\"name\":\"_srcChainId\",\"type\":\"uint16\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"_to\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"_amount\",\"type\":\"uint256\"}],\"name\":\"ReceiveFromChain\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"uint16\",\"name\":\"_srcChainId\",\"type\":\"uint16\"},{\"indexed\":false,\"internalType\":\"bytes\",\"name\":\"_srcAddress\",\"type\":\"bytes\"},{\"indexed\":false,\"internalType\":\"uint64\",\"name\":\"_nonce\",\"type\":\"uint64\"},{\"indexed\":false,\"internalType\":\"bytes32\",\"name\":\"_payloadHash\",\"type\":\"bytes32\"}],\"name\":\"RetryMessageSuccess\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"uint16\",\"name\":\"_dstChainId\",\"type\":\"uint16\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"_from\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"bytes\",\"name\":\"_toAddress\",\"type\":\"bytes\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"_amount\",\"type\":\"uint256\"}],\"name\":\"SendToChain\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"uint16\",\"name\":\"_dstChainId\",\"type\":\"uint16\"},{\"indexed\":false,\"internalType\":\"uint16\",\"name\":\"_type\",\"type\":\"uint16\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"_minDstGas\",\"type\":\"uint256\"}],\"name\":\"SetMinDstGas\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"address\",\"name\":\"precrime\",\"type\":\"address\"}],\"name\":\"SetPrecrime\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"uint16\",\"name\":\"_remoteChainId\",\"type\":\"uint16\"},{\"indexed\":false,\"internalType\":\"bytes\",\"name\":\"_path\",\"type\":\"bytes\"}],\"name\":\"SetTrustedRemote\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"uint16\",\"name\":\"_remoteChainId\",\"type\":\"uint16\"},{\"indexed\":false,\"internalType\":\"bytes\",\"name\":\"_remoteAddress\",\"type\":\"bytes\"}],\"name\":\"SetTrustedRemoteAddress\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"bool\",\"name\":\"_useCustomAdapterParams\",\"type\":\"bool\"}],\"name\":\"SetUseCustomAdapterParams\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"from\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"to\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"value\",\"type\":\"uint256\"}],\"name\":\"Transfer\",\"type\":\"event\"},{\"inputs\":[],\"name\":\"DEFAULT_PAYLOAD_SIZE_LIMIT\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"NO_EXTRA_GAS\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"PT_SEND\",\"outputs\":[{\"internalType\":\"uint16\",\"name\":\"\",\"type\":\"uint16\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"owner\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"spender\",\"type\":\"address\"}],\"name\":\"allowance\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"spender\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"value\",\"type\":\"uint256\"}],\"name\":\"approve\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"}],\"name\":\"balanceOf\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"circulatingSupply\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"_chainId\",\"type\":\"uint256\"},{\"internalType\":\"address\",\"name\":\"_to\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"_amount\",\"type\":\"uint256\"}],\"name\":\"credit\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"_chainId\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"_amount\",\"type\":\"uint256\"}],\"name\":\"debitFromChain\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"decimals\",\"outputs\":[{\"internalType\":\"uint8\",\"name\":\"\",\"type\":\"uint8\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint16\",\"name\":\"_dstChainId\",\"type\":\"uint16\"},{\"internalType\":\"bytes\",\"name\":\"_toAddress\",\"type\":\"bytes\"},{\"internalType\":\"uint256\",\"name\":\"_amount\",\"type\":\"uint256\"},{\"internalType\":\"bool\",\"name\":\"_useZro\",\"type\":\"bool\"},{\"internalType\":\"bytes\",\"name\":\"_adapterParams\",\"type\":\"bytes\"}],\"name\":\"estimateSendFee\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"nativeFee\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"zroFee\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint16\",\"name\":\"\",\"type\":\"uint16\"},{\"internalType\":\"bytes\",\"name\":\"\",\"type\":\"bytes\"},{\"internalType\":\"uint64\",\"name\":\"\",\"type\":\"uint64\"}],\"name\":\"failedMessages\",\"outputs\":[{\"internalType\":\"bytes32\",\"name\":\"\",\"type\":\"bytes32\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint16\",\"name\":\"_srcChainId\",\"type\":\"uint16\"},{\"internalType\":\"bytes\",\"name\":\"_srcAddress\",\"type\":\"bytes\"}],\"name\":\"forceResumeReceive\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint16\",\"name\":\"_version\",\"type\":\"uint16\"},{\"internalType\":\"uint16\",\"name\":\"_chainId\",\"type\":\"uint16\"},{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"_configType\",\"type\":\"uint256\"}],\"name\":\"getConfig\",\"outputs\":[{\"internalType\":\"bytes\",\"name\":\"\",\"type\":\"bytes\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint16\",\"name\":\"_remoteChainId\",\"type\":\"uint16\"}],\"name\":\"getTrustedRemoteAddress\",\"outputs\":[{\"internalType\":\"bytes\",\"name\":\"\",\"type\":\"bytes\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint16\",\"name\":\"_srcChainId\",\"type\":\"uint16\"},{\"internalType\":\"bytes\",\"name\":\"_srcAddress\",\"type\":\"bytes\"}],\"name\":\"isTrustedRemote\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"lzEndpoint\",\"outputs\":[{\"internalType\":\"contract ILayerZeroEndpoint\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint16\",\"name\":\"_srcChainId\",\"type\":\"uint16\"},{\"internalType\":\"bytes\",\"name\":\"_srcAddress\",\"type\":\"bytes\"},{\"internalType\":\"uint64\",\"name\":\"_nonce\",\"type\":\"uint64\"},{\"internalType\":\"bytes\",\"name\":\"_payload\",\"type\":\"bytes\"}],\"name\":\"lzReceive\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint16\",\"name\":\"\",\"type\":\"uint16\"},{\"internalType\":\"uint16\",\"name\":\"\",\"type\":\"uint16\"}],\"name\":\"minDstGasLookup\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"_to\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"_amount\",\"type\":\"uint256\"}],\"name\":\"mint\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"name\",\"outputs\":[{\"internalType\":\"string\",\"name\":\"\",\"type\":\"string\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint16\",\"name\":\"_srcChainId\",\"type\":\"uint16\"},{\"internalType\":\"bytes\",\"name\":\"_srcAddress\",\"type\":\"bytes\"},{\"internalType\":\"uint64\",\"name\":\"_nonce\",\"type\":\"uint64\"},{\"internalType\":\"bytes\",\"name\":\"_payload\",\"type\":\"bytes\"}],\"name\":\"nonblockingLzReceive\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"owner\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint16\",\"name\":\"\",\"type\":\"uint16\"}],\"name\":\"payloadSizeLimitLookup\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"precrime\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"renounceOwnership\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint16\",\"name\":\"_srcChainId\",\"type\":\"uint16\"},{\"internalType\":\"bytes\",\"name\":\"_srcAddress\",\"type\":\"bytes\"},{\"internalType\":\"uint64\",\"name\":\"_nonce\",\"type\":\"uint64\"},{\"internalType\":\"bytes\",\"name\":\"_payload\",\"type\":\"bytes\"}],\"name\":\"retryMessage\",\"outputs\":[],\"stateMutability\":\"payable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"_from\",\"type\":\"address\"},{\"internalType\":\"uint16\",\"name\":\"_dstChainId\",\"type\":\"uint16\"},{\"internalType\":\"bytes\",\"name\":\"_toAddress\",\"type\":\"bytes\"},{\"internalType\":\"uint256\",\"name\":\"_amount\",\"type\":\"uint256\"},{\"internalType\":\"address payable\",\"name\":\"_refundAddress\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"_zroPaymentAddress\",\"type\":\"address\"},{\"internalType\":\"bytes\",\"name\":\"_adapterParams\",\"type\":\"bytes\"}],\"name\":\"sendFrom\",\"outputs\":[],\"stateMutability\":\"payable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint16\",\"name\":\"_version\",\"type\":\"uint16\"},{\"internalType\":\"uint16\",\"name\":\"_chainId\",\"type\":\"uint16\"},{\"internalType\":\"uint256\",\"name\":\"_configType\",\"type\":\"uint256\"},{\"internalType\":\"bytes\",\"name\":\"_config\",\"type\":\"bytes\"}],\"name\":\"setConfig\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint16\",\"name\":\"_dstChainId\",\"type\":\"uint16\"},{\"internalType\":\"uint16\",\"name\":\"_packetType\",\"type\":\"uint16\"},{\"internalType\":\"uint256\",\"name\":\"_minGas\",\"type\":\"uint256\"}],\"name\":\"setMinDstGas\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint16\",\"name\":\"_dstChainId\",\"type\":\"uint16\"},{\"internalType\":\"uint256\",\"name\":\"_size\",\"type\":\"uint256\"}],\"name\":\"setPayloadSizeLimit\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"_precrime\",\"type\":\"address\"}],\"name\":\"setPrecrime\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint16\",\"name\":\"_version\",\"type\":\"uint16\"}],\"name\":\"setReceiveVersion\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint16\",\"name\":\"_version\",\"type\":\"uint16\"}],\"name\":\"setSendVersion\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint16\",\"name\":\"_remoteChainId\",\"type\":\"uint16\"},{\"internalType\":\"bytes\",\"name\":\"_path\",\"type\":\"bytes\"}],\"name\":\"setTrustedRemote\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint16\",\"name\":\"_remoteChainId\",\"type\":\"uint16\"},{\"internalType\":\"bytes\",\"name\":\"_remoteAddress\",\"type\":\"bytes\"}],\"name\":\"setTrustedRemoteAddress\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"bool\",\"name\":\"_useCustomAdapterParams\",\"type\":\"bool\"}],\"name\":\"setUseCustomAdapterParams\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"bytes4\",\"name\":\"interfaceId\",\"type\":\"bytes4\"}],\"name\":\"supportsInterface\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"symbol\",\"outputs\":[{\"internalType\":\"string\",\"name\":\"\",\"type\":\"string\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"token\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"totalSupply\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"to\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"value\",\"type\":\"uint256\"}],\"name\":\"transfer\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"from\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"to\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"value\",\"type\":\"uint256\"}],\"name\":\"transferFrom\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"newOwner\",\"type\":\"address\"}],\"name\":\"transferOwnership\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint16\",\"name\":\"\",\"type\":\"uint16\"}],\"name\":\"trustedRemoteLookup\",\"outputs\":[{\"internalType\":\"bytes\",\"name\":\"\",\"type\":\"bytes\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"useCustomAdapterParams\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\"}],\"devdoc\":{\"errors\":{\"ERC20InsufficientAllowance(address,uint256,uint256)\":[{\"details\":\"Indicates a failure with the `spender`\\u2019s `allowance`. Used in transfers.\",\"params\":{\"allowance\":\"Amount of tokens a `spender` is allowed to operate with.\",\"needed\":\"Minimum amount required to perform a transfer.\",\"spender\":\"Address that may be allowed to operate on tokens without being their owner.\"}}],\"ERC20InsufficientBalance(address,uint256,uint256)\":[{\"details\":\"Indicates an error related to the current `balance` of a `sender`. Used in transfers.\",\"params\":{\"balance\":\"Current balance for the interacting account.\",\"needed\":\"Minimum amount required to perform a transfer.\",\"sender\":\"Address whose tokens are being transferred.\"}}],\"ERC20InvalidApprover(address)\":[{\"details\":\"Indicates a failure with the `approver` of a token to be approved. Used in approvals.\",\"params\":{\"approver\":\"Address initiating an approval operation.\"}}],\"ERC20InvalidReceiver(address)\":[{\"details\":\"Indicates a failure with the token `receiver`. Used in transfers.\",\"params\":{\"receiver\":\"Address to which tokens are being transferred.\"}}],\"ERC20InvalidSender(address)\":[{\"details\":\"Indicates a failure with the token `sender`. Used in transfers.\",\"params\":{\"sender\":\"Address whose tokens are being transferred.\"}}],\"ERC20InvalidSpender(address)\":[{\"details\":\"Indicates a failure with the `spender` to be approved. Used in approvals.\",\"params\":{\"spender\":\"Address that may be allowed to operate on tokens without being their owner.\"}}],\"OwnableInvalidOwner(address)\":[{\"details\":\"The owner is not a valid owner account. (eg. `address(0)`)\"}],\"OwnableUnauthorizedAccount(address)\":[{\"details\":\"The caller account is not authorized to perform an operation.\"}]},\"events\":{\"Approval(address,address,uint256)\":{\"details\":\"Emitted when the allowance of a `spender` for an `owner` is set by a call to {approve}. `value` is the new allowance.\"},\"ReceiveFromChain(uint16,address,uint256)\":{\"details\":\"Emitted when `_amount` tokens are received from `_srcChainId` into the `_toAddress` on the local chain. `_nonce` is the inbound nonce.\"},\"SendToChain(uint16,address,bytes,uint256)\":{\"details\":\"Emitted when `_amount` tokens are moved from the `_sender` to (`_dstChainId`, `_toAddress`) `_nonce` is the outbound nonce\"},\"Transfer(address,address,uint256)\":{\"details\":\"Emitted when `value` tokens are moved from one account (`from`) to another (`to`). Note that `value` may be zero.\"}},\"kind\":\"dev\",\"methods\":{\"allowance(address,address)\":{\"details\":\"See {IERC20-allowance}.\"},\"approve(address,uint256)\":{\"details\":\"See {IERC20-approve}. NOTE: If `value` is the maximum `uint256`, the allowance is not updated on `transferFrom`. This is semantically equivalent to an infinite approval. Requirements: - `spender` cannot be the zero address.\"},\"balanceOf(address)\":{\"details\":\"See {IERC20-balanceOf}.\"},\"circulatingSupply()\":{\"details\":\"returns the circulating amount of tokens on current chain\"},\"decimals()\":{\"details\":\"Returns the number of decimals used to get its user representation. For example, if `decimals` equals `2`, a balance of `505` tokens should be displayed to a user as `5.05` (`505 / 10 ** 2`). Tokens usually opt for a value of 18, imitating the relationship between Ether and Wei. This is the default value returned by this function, unless it's overridden. NOTE: This information is only used for _display_ purposes: it in no way affects any of the arithmetic of the contract, including {IERC20-balanceOf} and {IERC20-transfer}.\"},\"estimateSendFee(uint16,bytes,uint256,bool,bytes)\":{\"details\":\"estimate send token `_tokenId` to (`_dstChainId`, `_toAddress`) _dstChainId - L0 defined chain id to send tokens too _toAddress - dynamic bytes array which contains the address to whom you are sending tokens to on the dstChain _amount - amount of the tokens to transfer _useZro - indicates to use zro to pay L0 fees _adapterParam - flexible bytes array to indicate messaging adapter services in L0\"},\"name()\":{\"details\":\"Returns the name of the token.\"},\"owner()\":{\"details\":\"Returns the address of the current owner.\"},\"renounceOwnership()\":{\"details\":\"Leaves the contract without owner. It will not be possible to call `onlyOwner` functions. Can only be called by the current owner. NOTE: Renouncing ownership will leave the contract without an owner, thereby disabling any functionality that is only available to the owner.\"},\"sendFrom(address,uint16,bytes,uint256,address,address,bytes)\":{\"details\":\"send `_amount` amount of token to (`_dstChainId`, `_toAddress`) from `_from` `_from` the owner of token `_dstChainId` the destination chain identifier `_toAddress` can be any size depending on the `dstChainId`. `_amount` the quantity of tokens in wei `_refundAddress` the address LayerZero refunds if too much message fee is sent `_zroPaymentAddress` set to address(0x0) if not paying in ZRO (LayerZero Token) `_adapterParams` is a flexible bytes array to indicate messaging adapter services\"},\"symbol()\":{\"details\":\"Returns the symbol of the token, usually a shorter version of the name.\"},\"token()\":{\"details\":\"returns the address of the ERC20 token\"},\"totalSupply()\":{\"details\":\"See {IERC20-totalSupply}.\"},\"transfer(address,uint256)\":{\"details\":\"See {IERC20-transfer}. Requirements: - `to` cannot be the zero address. - the caller must have a balance of at least `value`.\"},\"transferFrom(address,address,uint256)\":{\"details\":\"See {IERC20-transferFrom}. Emits an {Approval} event indicating the updated allowance. This is not required by the EIP. See the note at the beginning of {ERC20}. NOTE: Does not update the allowance if the current allowance is the maximum `uint256`. Requirements: - `from` and `to` cannot be the zero address. - `from` must have a balance of at least `value`. - the caller must have allowance for ``from``'s tokens of at least `value`.\"},\"transferOwnership(address)\":{\"details\":\"Transfers ownership of the contract to a new account (`newOwner`). Can only be called by the current owner.\"}},\"version\":1},\"userdoc\":{\"kind\":\"user\",\"methods\":{},\"version\":1}},\"settings\":{\"compilationTarget\":{\"src/MultiChainToken.sol\":\"MultiChainToken\"},\"evmVersion\":\"paris\",\"libraries\":{},\"metadata\":{\"bytecodeHash\":\"ipfs\"},\"optimizer\":{\"enabled\":true,\"runs\":200},\"remappings\":[\":@layerzerolabs/solidity-examples/=lib/solidity-examples/\",\":@openzeppelin/=lib/openzeppelin-contracts/\",\":@openzeppelin/contracts-upgradeable/=lib/openzeppelin-contracts-upgradeable/contracts/\",\":@openzeppelin/contracts/=lib/openzeppelin-contracts/contracts/\",\":@upgradeable/=lib/openzeppelin-contracts-upgradeable/\",\":@upgradeable/safeAccount/=lib/openzeppelin-contracts-upgradeable/\",\":ds-test/=lib/forge-std/lib/ds-test/src/\",\":erc4626-tests/=lib/openzeppelin-contracts/lib/erc4626-tests/\",\":forge-std/=lib/forge-std/src/\",\":openzeppelin-contracts-upgradeable/=lib/openzeppelin-contracts-upgradeable/\",\":openzeppelin-contracts/=lib/openzeppelin-contracts/\",\":solidity-examples/=lib/solidity-examples/contracts/\"]},\"sources\":{\"lib/openzeppelin-contracts/contracts/access/Ownable.sol\":{\"keccak256\":\"0xff6d0bb2e285473e5311d9d3caacb525ae3538a80758c10649a4d61029b017bb\",\"license\":\"MIT\",\"urls\":[\"bzz-raw://8ed324d3920bb545059d66ab97d43e43ee85fd3bd52e03e401f020afb0b120f6\",\"dweb:/ipfs/QmfEckWLmZkDDcoWrkEvMWhms66xwTLff9DDhegYpvHo1a\"]},\"lib/openzeppelin-contracts/contracts/governance/utils/IVotes.sol\":{\"keccak256\":\"0x5e2b397ae88fd5c68e4f6762eb9f65f65c36702eb57796495f471d024ce70947\",\"license\":\"MIT\",\"urls\":[\"bzz-raw://348fc8e291d54314bb22437b532f443d5dbfb80c8cc9591567c1af6554ccf856\",\"dweb:/ipfs/QmP8ZTyitZinxcpwAHeYHhwj7u21zPpKXSiww38V74sXC2\"]},\"lib/openzeppelin-contracts/contracts/governance/utils/Votes.sol\":{\"keccak256\":\"0xb8f69828d41b3594afd7a8c6393565901c205d8b5baf5bd2e42dbac637172979\",\"license\":\"MIT\",\"urls\":[\"bzz-raw://c790253821191ac46b2050d87df820d4209871f90c616381e2c2c00ff3eaac34\",\"dweb:/ipfs/QmcPETTyuZBzDRL39JNXj3SBMdx3Y9o4fPQLSZ27py5Jim\"]},\"lib/openzeppelin-contracts/contracts/interfaces/IERC5267.sol\":{\"keccak256\":\"0x92aa1df62dc3d33f1656d63bede0923e0df0b706ad4137c8b10b0a8fe549fd92\",\"license\":\"MIT\",\"urls\":[\"bzz-raw://c5c0f29195ad64cbe556da8e257dac8f05f78c53f90323c0d2accf8e6922d33a\",\"dweb:/ipfs/QmQ61TED8uaCZwcbh8KkgRSsCav7x7HbcGHwHts3U4DmUP\"]},\"lib/openzeppelin-contracts/contracts/interfaces/IERC5805.sol\":{\"keccak256\":\"0x4b9b89f91adbb7d3574f85394754cfb08c5b4eafca8a7061e2094a019ab8f818\",\"license\":\"MIT\",\"urls\":[\"bzz-raw://7373d5dbb8eb2381aa0883a456fac89283fcaf52f42fa805d4188f270716742a\",\"dweb:/ipfs/QmVnZDmT4ABvNhRJMaQnbCzsCA8HpyHPVaxi4fCi92LFv2\"]},\"lib/openzeppelin-contracts/contracts/interfaces/IERC6372.sol\":{\"keccak256\":\"0xeb2857b7dafb7e0d8526dbfe794e6c047df2851c9e6ee91dc4a55f3c34af5d33\",\"license\":\"MIT\",\"urls\":[\"bzz-raw://49bf13f6c2a38a9bcc7b852d4e2b9cebb4068b832642cce61069cdb5f06bb2fb\",\"dweb:/ipfs/QmdKAJVE7rR2kENCZnEM1yKswrGii7WuE9gZpsQvnXJhwn\"]},\"lib/openzeppelin-contracts/contracts/interfaces/draft-IERC6093.sol\":{\"keccak256\":\"0x60c65f701957fdd6faea1acb0bb45825791d473693ed9ecb34726fdfaa849dd7\",\"license\":\"MIT\",\"urls\":[\"bzz-raw://ea290300e0efc4d901244949dc4d877fd46e6c5e43dc2b26620e8efab3ab803f\",\"dweb:/ipfs/QmcLLJppxKeJWqHxE2CUkcfhuRTgHSn8J4kijcLa5MYhSt\"]},\"lib/openzeppelin-contracts/contracts/token/ERC20/ERC20.sol\":{\"keccak256\":\"0xc3e1fa9d1987f8d349dfb4d6fe93bf2ca014b52ba335cfac30bfe71e357e6f80\",\"license\":\"MIT\",\"urls\":[\"bzz-raw://c5703ccdeb7b1d685e375ed719117e9edf2ab4bc544f24f23b0d50ec82257229\",\"dweb:/ipfs/QmTdwkbQq7owpCiyuzE7eh5LrD2ddrBCZ5WHVsWPi1RrTS\"]},\"lib/openzeppelin-contracts/contracts/token/ERC20/IERC20.sol\":{\"keccak256\":\"0xc6a8ff0ea489379b61faa647490411b80102578440ab9d84e9a957cc12164e70\",\"license\":\"MIT\",\"urls\":[\"bzz-raw://0ea104e577e63faea3b69c415637e99e755dcbf64c5833d7140c35a714d6d90c\",\"dweb:/ipfs/Qmau6x4Ns9XdyynRCNNp3RhLqijJjFm7z5fyZazfYFGYdq\"]},\"lib/openzeppelin-contracts/contracts/token/ERC20/extensions/ERC20Permit.sol\":{\"keccak256\":\"0xc858a86a35701004d89022a5e98819aac46ccbdc4072fc9dd43928a676b1a2ee\",\"license\":\"MIT\",\"urls\":[\"bzz-raw://18acebb483c512c0eaafcb437f09c839972c3f0d36f0201ea7baa2926b987dd2\",\"dweb:/ipfs/Qmd9bf2noaDSYDtf6FMSzKu7LPhuf91jsVNmcoCuTCuGic\"]},\"lib/openzeppelin-contracts/contracts/token/ERC20/extensions/ERC20Votes.sol\":{\"keccak256\":\"0x2a650f6e593cfe5ff2e514a17ea7f593ee70cefa1888066bc983a6308acff4b1\",\"license\":\"MIT\",\"urls\":[\"bzz-raw://9a3477b9665a4b6d19f86bf2cfbfa8c08ba41193f15e68c0d75c0cab7e1fc753\",\"dweb:/ipfs/QmbcurrTatN1PBmkCWdrED8zhAqx5ah9Qp6uR8YwkKWA8V\"]},\"lib/openzeppelin-contracts/contracts/token/ERC20/extensions/IERC20Metadata.sol\":{\"keccak256\":\"0xaa761817f6cd7892fcf158b3c776b34551cde36f48ff9703d53898bc45a94ea2\",\"license\":\"MIT\",\"urls\":[\"bzz-raw://0ad7c8d4d08938c8dfc43d75a148863fb324b80cf53e0a36f7e5a4ac29008850\",\"dweb:/ipfs/QmcrhfPgVNf5mkdhQvy1pMv51TFokD3Y4Wa5WZhFqVh8UV\"]},\"lib/openzeppelin-contracts/contracts/token/ERC20/extensions/IERC20Permit.sol\":{\"keccak256\":\"0x6008dabfe393240d73d7dd7688033f72740d570aa422254d29a7dce8568f3aff\",\"license\":\"MIT\",\"urls\":[\"bzz-raw://f5196ec75139918c6c7bb4251b36395e668f1fa6d206beba7e7520e74913940d\",\"dweb:/ipfs/QmSyqjksXxmm2mCG6qRd1yuwLykypkSVBbnBnGqJRcuJMi\"]},\"lib/openzeppelin-contracts/contracts/utils/Context.sol\":{\"keccak256\":\"0x493033a8d1b176a037b2cc6a04dad01a5c157722049bbecf632ca876224dd4b2\",\"license\":\"MIT\",\"urls\":[\"bzz-raw://6a708e8a5bdb1011c2c381c9a5cfd8a9a956d7d0a9dc1bd8bcdaf52f76ef2f12\",\"dweb:/ipfs/Qmax9WHBnVsZP46ZxEMNRQpLQnrdE4dK8LehML1Py8FowF\"]},\"lib/openzeppelin-contracts/contracts/utils/Nonces.sol\":{\"keccak256\":\"0x0082767004fca261c332e9ad100868327a863a88ef724e844857128845ab350f\",\"license\":\"MIT\",\"urls\":[\"bzz-raw://132dce9686a54e025eb5ba5d2e48208f847a1ec3e60a3e527766d7bf53fb7f9e\",\"dweb:/ipfs/QmXn1a2nUZMpu2z6S88UoTfMVtY2YNh86iGrzJDYmMkKeZ\"]},\"lib/openzeppelin-contracts/contracts/utils/ShortStrings.sol\":{\"keccak256\":\"0x18a7171df639a934592915a520ecb97c5bbc9675a1105607aac8a94e72bf62c6\",\"license\":\"MIT\",\"urls\":[\"bzz-raw://7478e1f13da69a2867ccd883001d836b75620362e743f196376d63ed0c422a1c\",\"dweb:/ipfs/QmWywcQ9TNfwtoqAxbn25d8C5VrV12PrPS9UjtGe6pL2BA\"]},\"lib/openzeppelin-contracts/contracts/utils/StorageSlot.sol\":{\"keccak256\":\"0x32ba59b4b7299237c8ba56319110989d7978a039faf754793064e967e5894418\",\"license\":\"MIT\",\"urls\":[\"bzz-raw://1ae50c8b562427df610cc4540c9bf104acca7ef8e2dcae567ae7e52272281e9c\",\"dweb:/ipfs/QmTHiadFCSJUPpRjNegc5SahmeU8bAoY8i9Aq6tVscbcKR\"]},\"lib/openzeppelin-contracts/contracts/utils/Strings.sol\":{\"keccak256\":\"0x55f102ea785d8399c0e58d1108e2d289506dde18abc6db1b7f68c1f9f9bc5792\",\"license\":\"MIT\",\"urls\":[\"bzz-raw://6e52e0a7765c943ef14e5bcf11e46e6139fa044be564881378349236bf2e3453\",\"dweb:/ipfs/QmZEeeXoFPW47amyP35gfzomF9DixqqTEPwzBakv6cZw6i\"]},\"lib/openzeppelin-contracts/contracts/utils/cryptography/ECDSA.sol\":{\"keccak256\":\"0xeed0a08b0b091f528356cbc7245891a4c748682d4f6a18055e8e6ca77d12a6cf\",\"license\":\"MIT\",\"urls\":[\"bzz-raw://ba80ba06c8e6be852847e4c5f4492cef801feb6558ae09ed705ff2e04ea8b13c\",\"dweb:/ipfs/QmXRJDv3xHLVQCVXg1ZvR35QS9sij5y9NDWYzMfUfAdTHF\"]},\"lib/openzeppelin-contracts/contracts/utils/cryptography/EIP712.sol\":{\"keccak256\":\"0x999f705a027ed6dc2d4e0df2cc4a509852c6bfd11de1c8161bf88832d0503fd0\",\"license\":\"MIT\",\"urls\":[\"bzz-raw://0798def67258d9a3cc20b2b4da7ebf351a5cefe0abfdd665d2d81f8e32f89b21\",\"dweb:/ipfs/QmPEvJosnPfzHNjKvCv2D3891mA2Ww8eUwkqrxBjuYdHCt\"]},\"lib/openzeppelin-contracts/contracts/utils/cryptography/MessageHashUtils.sol\":{\"keccak256\":\"0xba333517a3add42cd35fe877656fc3dfcc9de53baa4f3aabbd6d12a92e4ea435\",\"license\":\"MIT\",\"urls\":[\"bzz-raw://2ceacff44c0fdc81e48e0e0b1db87a2076d3c1fb497341de077bf1da9f6b406c\",\"dweb:/ipfs/QmRUo1muMRAewxrKQ7TkXUtknyRoR57AyEkoPpiuZQ8FzX\"]},\"lib/openzeppelin-contracts/contracts/utils/introspection/ERC165.sol\":{\"keccak256\":\"0x9e8778b14317ba9e256c30a76fd6c32b960af621987f56069e1e819c77c6a133\",\"license\":\"MIT\",\"urls\":[\"bzz-raw://1777404f1dcd0fac188e55a288724ec3c67b45288e49cc64723e95e702b49ab8\",\"dweb:/ipfs/QmZFdC626GButBApwDUvvTnUzdinevC3B24d7yyh57XkiA\"]},\"lib/openzeppelin-contracts/contracts/utils/introspection/IERC165.sol\":{\"keccak256\":\"0x4296879f55019b23e135000eb36896057e7101fb7fb859c5ef690cf14643757b\",\"license\":\"MIT\",\"urls\":[\"bzz-raw://87b3541437c8c443ccd36795e56a338ed12855eec17f8da624511b8d1a7e14df\",\"dweb:/ipfs/QmeJQCtZrQjtJLr6u7ZHWeH3pBnjtLWzvRrKViAi7UZqxL\"]},\"lib/openzeppelin-contracts/contracts/utils/math/Math.sol\":{\"keccak256\":\"0x005ec64c6313f0555d59e278f9a7a5ab2db5bdc72a027f255a37c327af1ec02d\",\"license\":\"MIT\",\"urls\":[\"bzz-raw://4ece9f0b9c8daca08c76b6b5405a6446b6f73b3a15fab7ff56e296cbd4a2c875\",\"dweb:/ipfs/QmQyRpyPRL5SQuAgj6SHmbir3foX65FJjbVTTQrA2EFg6L\"]},\"lib/openzeppelin-contracts/contracts/utils/math/SafeCast.sol\":{\"keccak256\":\"0xe19a4d5f31d2861e7344e8e535e2feafb913d806d3e2b5fe7782741a2a7094fe\",\"license\":\"MIT\",\"urls\":[\"bzz-raw://4aed79c0fa6f0546ed02f2f683e8f77f0fd2ed7eb34d8bbf3d373c9a6d95b13c\",\"dweb:/ipfs/QmWqVz6UAVqmnWU5pqYPt1o6iDEZyPaBraAA3rKfTTSfYj\"]},\"lib/openzeppelin-contracts/contracts/utils/math/SignedMath.sol\":{\"keccak256\":\"0x5f7e4076e175393767754387c962926577f1660dd9b810187b9002407656be72\",\"license\":\"MIT\",\"urls\":[\"bzz-raw://7d533a1c97cd43a57cd9c465f7ee8dd0e39ae93a8fb8ff8e5303a356b081cdcc\",\"dweb:/ipfs/QmVBEei6aTnvYNZp2CHYVNKyZS4q1KkjANfY39WVXZXVoT\"]},\"lib/openzeppelin-contracts/contracts/utils/structs/Checkpoints.sol\":{\"keccak256\":\"0xbdc5e074d7dd6678f67e92b1a51a20226801a407b0e1af3da367c5d1ff4519ad\",\"license\":\"MIT\",\"urls\":[\"bzz-raw://a36cca6b22fff3db16fc789ff6c60eea71d4b156065d4d0c83a0bc5e91a77a8b\",\"dweb:/ipfs/QmYN3exd5AemxjBrN8XMB1p5LbbE16uC3sjbYjwi8AjcGR\"]},\"lib/openzeppelin-contracts/contracts/utils/types/Time.sol\":{\"keccak256\":\"0xc7755af115020049e4140f224f9ee88d7e1799ffb0646f37bf0df24bf6213f58\",\"license\":\"MIT\",\"urls\":[\"bzz-raw://7f09bf94d5274334ec021f61a04659db303f31e60460e14b709c9bf187740111\",\"dweb:/ipfs/QmNvgomZYUwFAt4cZbPWAiTeSZQreGehY9BK5xyVJsUttb\"]},\"lib/solidity-examples/contracts/libraries/BytesLib.sol\":{\"keccak256\":\"0x7e64cccdf22a03f513d94960f2145dd801fb5ec88d971de079b5186a9f5e93c4\",\"license\":\"Unlicense\",\"urls\":[\"bzz-raw://99d1b3433e5ee2cc86ff06b428875d1e8593163d941595ef0d7801f67de33798\",\"dweb:/ipfs/QmXjaGuGPn99QeFLMMVdekZEgLTScHMWY6dD7c4eiaEhVd\"]},\"lib/solidity-examples/contracts/libraries/ExcessivelySafeCall.sol\":{\"keccak256\":\"0xd4e52af409b5ec80432292d86fb01906785eb78ac31da3bab4565aabcd6e3e56\",\"license\":\"MIT OR Apache-2.0\",\"urls\":[\"bzz-raw://d9e3ced69d534bc3d2e13c097bfa51fcd514c636a5747ad4decca4a6d52b4a55\",\"dweb:/ipfs/QmWrywTjTXgHxSSQtg2aLdAQspR19aae3AfvAx4hf5FUs7\"]},\"lib/solidity-examples/contracts/lzApp/LzApp.sol\":{\"keccak256\":\"0x309c994bdcf69ad63c6789694a28eb72a773e2d9db58fe572ab2b34a475972ce\",\"license\":\"MIT\",\"urls\":[\"bzz-raw://050db330c03be5da7e4bd5452ce7a7baa0830e4f2484a155671f83f07b8e0e1c\",\"dweb:/ipfs/QmSGbBgAQwzHZFpmoVEamJacFdFcKC9xVS8fz5uGyV9X5h\"]},\"lib/solidity-examples/contracts/lzApp/NonblockingLzApp.sol\":{\"keccak256\":\"0xf4bd9e0ecfa4eb18e7305eb66da44c8a4610c3d5afeaf6a3b44c4bf4b7169b40\",\"license\":\"MIT\",\"urls\":[\"bzz-raw://b46f827b40690ef64a60faece2c1c70ee0ef059f2f4df7dcf375afb8e877c6e0\",\"dweb:/ipfs/QmNZ9NEYcmn6Usvd1BU4eJLvkJpU2UXW4jU3JxZVRvwKuS\"]},\"lib/solidity-examples/contracts/lzApp/interfaces/ILayerZeroEndpoint.sol\":{\"keccak256\":\"0xab7fcacc672251c850f00c0abd4100df9afcc4ad70b8d331a2fd4cb07acab9f4\",\"license\":\"MIT\",\"urls\":[\"bzz-raw://b1ec2cf50fa66402158702689fa05290ca8ec18ce77dea6d5094da645b0feb51\",\"dweb:/ipfs/QmbpixkLDpNiWk9FTTGsGannvnrXdM5K8tp4d5mw1LuQ9h\"]},\"lib/solidity-examples/contracts/lzApp/interfaces/ILayerZeroReceiver.sol\":{\"keccak256\":\"0xac1966c1229bd4dc36b6c69eeb94a537bd9aa2198d7623b9ba7f8f7dbe79bb4c\",\"license\":\"MIT\",\"urls\":[\"bzz-raw://e981cbe707042648a10d2bb9b3f8b7c27206939050be58eb401c5ac9c9b4252f\",\"dweb:/ipfs/QmZXq7PwGcG7TLgTfnPEN6CBzx6CkSpEnbNDbfHfjRLqAo\"]},\"lib/solidity-examples/contracts/lzApp/interfaces/ILayerZeroUserApplicationConfig.sol\":{\"keccak256\":\"0xb4df93aeb0fb46373a4fb728ad2603edc8b9a1577eee8d801768dc115bf96498\",\"license\":\"MIT\",\"urls\":[\"bzz-raw://b4a6f353e7b6823f98ecb34e3c6e79e2d3a08bb42e956e5b7768d78f3d585b64\",\"dweb:/ipfs/QmcJP5F13NANjAu4kHrj41kabvNZAktpQ1cRTgvj776Fwt\"]},\"lib/solidity-examples/contracts/token/oft/v1/OFTCore.sol\":{\"keccak256\":\"0xca1426a15ebb32fee675a336d2f20ae7d6a688fecd3321731a3c3c7c987e3b39\",\"license\":\"MIT\",\"urls\":[\"bzz-raw://fdac2f580ef2de220fb7279697dcdbd94ef2405520ebeb568b012830929ac51c\",\"dweb:/ipfs/QmUwW9uypi26qSXTC77di4KizwBuSPkVjoUH1JqDytK65G\"]},\"lib/solidity-examples/contracts/token/oft/v1/interfaces/IOFT.sol\":{\"keccak256\":\"0x102ab1f2484ffa58d3b913e469529e10a4843c655c529c9614468d1e9cf0ff8c\",\"license\":\"MIT\",\"urls\":[\"bzz-raw://f3b82006999c9b68a37b2f91bad1b017151d1bb716458caf76554c01018b7678\",\"dweb:/ipfs/Qmcf4khMQ8dpvDrogU2KEWd2qwwRzPcdQFoRePuB2aczT1\"]},\"lib/solidity-examples/contracts/token/oft/v1/interfaces/IOFTCore.sol\":{\"keccak256\":\"0xc19c158682e42cad701a6c1f70011b039a2f928b3b491377af981bd5ffebbab8\",\"license\":\"MIT\",\"urls\":[\"bzz-raw://588094c947b80a667083b5f50e0f83cf099c8467758608339a0b6a354cbadb94\",\"dweb:/ipfs/QmY5C55jxN56AvfihRyusQyAuQvh2hqRjKduG4bZkXUP2Y\"]},\"src/MultiChainToken.sol\":{\"keccak256\":\"0xa4154177e86506c7fb962cf91486802104993f126c617488f7ea222b9b6dd9a4\",\"license\":\"MIT\",\"urls\":[\"bzz-raw://6ef9b6b9d88b743509b4d3c790924f8bf53be475d3a4757abd07921edc5815ba\",\"dweb:/ipfs/QmSxBG8fm7Ki85GFk1MEhxVvNRrNv3K9jcpq6KF7pUnSWR\"]},\"src/OFTToken.sol\":{\"keccak256\":\"0x80e997467117cd4cb5c9bfec74c896f5eb2856f5afdf2689aea2ba7a5f0d0649\",\"license\":\"MIT\",\"urls\":[\"bzz-raw://5367aa5756f1517a341c183681a8c254f14ea2c1aad8ea3179ef3a4345c0a94f\",\"dweb:/ipfs/QmUKt4id8nSMkWYGAVBGjPpHF8EdsK6awH6Ku9Lf3T8E6t\"]}},\"version\":1}",
    "metadata": {
      "compiler": {
        "version": "0.8.20+commit.a1b79de6"
      },
      "language": "Solidity",
      "output": {
        "abi": [
          {
            "inputs": [
              {
                "internalType": "uint256",
                "name": "_initialSupply",
                "type": "uint256"
              },
              {
                "internalType": "address",
                "name": "_lzEndpoint",
                "type": "address"
              }
            ],
            "stateMutability": "nonpayable",
            "type": "constructor"
          },
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "spender",
                "type": "address"
              },
              {
                "internalType": "uint256",
                "name": "allowance",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "needed",
                "type": "uint256"
              }
            ],
            "type": "error",
            "name": "ERC20InsufficientAllowance"
          },
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "sender",
                "type": "address"
              },
              {
                "internalType": "uint256",
                "name": "balance",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "needed",
                "type": "uint256"
              }
            ],
            "type": "error",
            "name": "ERC20InsufficientBalance"
          },
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "approver",
                "type": "address"
              }
            ],
            "type": "error",
            "name": "ERC20InvalidApprover"
          },
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "receiver",
                "type": "address"
              }
            ],
            "type": "error",
            "name": "ERC20InvalidReceiver"
          },
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "sender",
                "type": "address"
              }
            ],
            "type": "error",
            "name": "ERC20InvalidSender"
          },
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "spender",
                "type": "address"
              }
            ],
            "type": "error",
            "name": "ERC20InvalidSpender"
          },
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "owner",
                "type": "address"
              }
            ],
            "type": "error",
            "name": "OwnableInvalidOwner"
          },
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "account",
                "type": "address"
              }
            ],
            "type": "error",
            "name": "OwnableUnauthorizedAccount"
          },
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "owner",
                "type": "address",
                "indexed": true
              },
              {
                "internalType": "address",
                "name": "spender",
                "type": "address",
                "indexed": true
              },
              {
                "internalType": "uint256",
                "name": "value",
                "type": "uint256",
                "indexed": false
              }
            ],
            "type": "event",
            "name": "Approval",
            "anonymous": false
          },
          {
            "inputs": [
              {
                "internalType": "uint16",
                "name": "_srcChainId",
                "type": "uint16",
                "indexed": false
              },
              {
                "internalType": "bytes",
                "name": "_srcAddress",
                "type": "bytes",
                "indexed": false
              },
              {
                "internalType": "uint64",
                "name": "_nonce",
                "type": "uint64",
                "indexed": false
              },
              {
                "internalType": "bytes",
                "name": "_payload",
                "type": "bytes",
                "indexed": false
              },
              {
                "internalType": "bytes",
                "name": "_reason",
                "type": "bytes",
                "indexed": false
              }
            ],
            "type": "event",
            "name": "MessageFailed",
            "anonymous": false
          },
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "previousOwner",
                "type": "address",
                "indexed": true
              },
              {
                "internalType": "address",
                "name": "newOwner",
                "type": "address",
                "indexed": true
              }
            ],
            "type": "event",
            "name": "OwnershipTransferred",
            "anonymous": false
          },
          {
            "inputs": [
              {
                "internalType": "uint16",
                "name": "_srcChainId",
                "type": "uint16",
                "indexed": true
              },
              {
                "internalType": "address",
                "name": "_to",
                "type": "address",
                "indexed": true
              },
              {
                "internalType": "uint256",
                "name": "_amount",
                "type": "uint256",
                "indexed": false
              }
            ],
            "type": "event",
            "name": "ReceiveFromChain",
            "anonymous": false
          },
          {
            "inputs": [
              {
                "internalType": "uint16",
                "name": "_srcChainId",
                "type": "uint16",
                "indexed": false
              },
              {
                "internalType": "bytes",
                "name": "_srcAddress",
                "type": "bytes",
                "indexed": false
              },
              {
                "internalType": "uint64",
                "name": "_nonce",
                "type": "uint64",
                "indexed": false
              },
              {
                "internalType": "bytes32",
                "name": "_payloadHash",
                "type": "bytes32",
                "indexed": false
              }
            ],
            "type": "event",
            "name": "RetryMessageSuccess",
            "anonymous": false
          },
          {
            "inputs": [
              {
                "internalType": "uint16",
                "name": "_dstChainId",
                "type": "uint16",
                "indexed": true
              },
              {
                "internalType": "address",
                "name": "_from",
                "type": "address",
                "indexed": true
              },
              {
                "internalType": "bytes",
                "name": "_toAddress",
                "type": "bytes",
                "indexed": false
              },
              {
                "internalType": "uint256",
                "name": "_amount",
                "type": "uint256",
                "indexed": false
              }
            ],
            "type": "event",
            "name": "SendToChain",
            "anonymous": false
          },
          {
            "inputs": [
              {
                "internalType": "uint16",
                "name": "_dstChainId",
                "type": "uint16",
                "indexed": false
              },
              {
                "internalType": "uint16",
                "name": "_type",
                "type": "uint16",
                "indexed": false
              },
              {
                "internalType": "uint256",
                "name": "_minDstGas",
                "type": "uint256",
                "indexed": false
              }
            ],
            "type": "event",
            "name": "SetMinDstGas",
            "anonymous": false
          },
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "precrime",
                "type": "address",
                "indexed": false
              }
            ],
            "type": "event",
            "name": "SetPrecrime",
            "anonymous": false
          },
          {
            "inputs": [
              {
                "internalType": "uint16",
                "name": "_remoteChainId",
                "type": "uint16",
                "indexed": false
              },
              {
                "internalType": "bytes",
                "name": "_path",
                "type": "bytes",
                "indexed": false
              }
            ],
            "type": "event",
            "name": "SetTrustedRemote",
            "anonymous": false
          },
          {
            "inputs": [
              {
                "internalType": "uint16",
                "name": "_remoteChainId",
                "type": "uint16",
                "indexed": false
              },
              {
                "internalType": "bytes",
                "name": "_remoteAddress",
                "type": "bytes",
                "indexed": false
              }
            ],
            "type": "event",
            "name": "SetTrustedRemoteAddress",
            "anonymous": false
          },
          {
            "inputs": [
              {
                "internalType": "bool",
                "name": "_useCustomAdapterParams",
                "type": "bool",
                "indexed": false
              }
            ],
            "type": "event",
            "name": "SetUseCustomAdapterParams",
            "anonymous": false
          },
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "from",
                "type": "address",
                "indexed": true
              },
              {
                "internalType": "address",
                "name": "to",
                "type": "address",
                "indexed": true
              },
              {
                "internalType": "uint256",
                "name": "value",
                "type": "uint256",
                "indexed": false
              }
            ],
            "type": "event",
            "name": "Transfer",
            "anonymous": false
          },
          {
            "inputs": [],
            "stateMutability": "view",
            "type": "function",
            "name": "DEFAULT_PAYLOAD_SIZE_LIMIT",
            "outputs": [
              {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
              }
            ]
          },
          {
            "inputs": [],
            "stateMutability": "view",
            "type": "function",
            "name": "NO_EXTRA_GAS",
            "outputs": [
              {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
              }
            ]
          },
          {
            "inputs": [],
            "stateMutability": "view",
            "type": "function",
            "name": "PT_SEND",
            "outputs": [
              {
                "internalType": "uint16",
                "name": "",
                "type": "uint16"
              }
            ]
          },
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "owner",
                "type": "address"
              },
              {
                "internalType": "address",
                "name": "spender",
                "type": "address"
              }
            ],
            "stateMutability": "view",
            "type": "function",
            "name": "allowance",
            "outputs": [
              {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
              }
            ]
          },
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "spender",
                "type": "address"
              },
              {
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
              }
            ],
            "stateMutability": "nonpayable",
            "type": "function",
            "name": "approve",
            "outputs": [
              {
                "internalType": "bool",
                "name": "",
                "type": "bool"
              }
            ]
          },
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "account",
                "type": "address"
              }
            ],
            "stateMutability": "view",
            "type": "function",
            "name": "balanceOf",
            "outputs": [
              {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
              }
            ]
          },
          {
            "inputs": [],
            "stateMutability": "view",
            "type": "function",
            "name": "circulatingSupply",
            "outputs": [
              {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
              }
            ]
          },
          {
            "inputs": [
              {
                "internalType": "uint256",
                "name": "_chainId",
                "type": "uint256"
              },
              {
                "internalType": "address",
                "name": "_to",
                "type": "address"
              },
              {
                "internalType": "uint256",
                "name": "_amount",
                "type": "uint256"
              }
            ],
            "stateMutability": "nonpayable",
            "type": "function",
            "name": "credit"
          },
          {
            "inputs": [
              {
                "internalType": "uint256",
                "name": "_chainId",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "_amount",
                "type": "uint256"
              }
            ],
            "stateMutability": "nonpayable",
            "type": "function",
            "name": "debitFromChain"
          },
          {
            "inputs": [],
            "stateMutability": "view",
            "type": "function",
            "name": "decimals",
            "outputs": [
              {
                "internalType": "uint8",
                "name": "",
                "type": "uint8"
              }
            ]
          },
          {
            "inputs": [
              {
                "internalType": "uint16",
                "name": "_dstChainId",
                "type": "uint16"
              },
              {
                "internalType": "bytes",
                "name": "_toAddress",
                "type": "bytes"
              },
              {
                "internalType": "uint256",
                "name": "_amount",
                "type": "uint256"
              },
              {
                "internalType": "bool",
                "name": "_useZro",
                "type": "bool"
              },
              {
                "internalType": "bytes",
                "name": "_adapterParams",
                "type": "bytes"
              }
            ],
            "stateMutability": "view",
            "type": "function",
            "name": "estimateSendFee",
            "outputs": [
              {
                "internalType": "uint256",
                "name": "nativeFee",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "zroFee",
                "type": "uint256"
              }
            ]
          },
          {
            "inputs": [
              {
                "internalType": "uint16",
                "name": "",
                "type": "uint16"
              },
              {
                "internalType": "bytes",
                "name": "",
                "type": "bytes"
              },
              {
                "internalType": "uint64",
                "name": "",
                "type": "uint64"
              }
            ],
            "stateMutability": "view",
            "type": "function",
            "name": "failedMessages",
            "outputs": [
              {
                "internalType": "bytes32",
                "name": "",
                "type": "bytes32"
              }
            ]
          },
          {
            "inputs": [
              {
                "internalType": "uint16",
                "name": "_srcChainId",
                "type": "uint16"
              },
              {
                "internalType": "bytes",
                "name": "_srcAddress",
                "type": "bytes"
              }
            ],
            "stateMutability": "nonpayable",
            "type": "function",
            "name": "forceResumeReceive"
          },
          {
            "inputs": [
              {
                "internalType": "uint16",
                "name": "_version",
                "type": "uint16"
              },
              {
                "internalType": "uint16",
                "name": "_chainId",
                "type": "uint16"
              },
              {
                "internalType": "address",
                "name": "",
                "type": "address"
              },
              {
                "internalType": "uint256",
                "name": "_configType",
                "type": "uint256"
              }
            ],
            "stateMutability": "view",
            "type": "function",
            "name": "getConfig",
            "outputs": [
              {
                "internalType": "bytes",
                "name": "",
                "type": "bytes"
              }
            ]
          },
          {
            "inputs": [
              {
                "internalType": "uint16",
                "name": "_remoteChainId",
                "type": "uint16"
              }
            ],
            "stateMutability": "view",
            "type": "function",
            "name": "getTrustedRemoteAddress",
            "outputs": [
              {
                "internalType": "bytes",
                "name": "",
                "type": "bytes"
              }
            ]
          },
          {
            "inputs": [
              {
                "internalType": "uint16",
                "name": "_srcChainId",
                "type": "uint16"
              },
              {
                "internalType": "bytes",
                "name": "_srcAddress",
                "type": "bytes"
              }
            ],
            "stateMutability": "view",
            "type": "function",
            "name": "isTrustedRemote",
            "outputs": [
              {
                "internalType": "bool",
                "name": "",
                "type": "bool"
              }
            ]
          },
          {
            "inputs": [],
            "stateMutability": "view",
            "type": "function",
            "name": "lzEndpoint",
            "outputs": [
              {
                "internalType": "contract ILayerZeroEndpoint",
                "name": "",
                "type": "address"
              }
            ]
          },
          {
            "inputs": [
              {
                "internalType": "uint16",
                "name": "_srcChainId",
                "type": "uint16"
              },
              {
                "internalType": "bytes",
                "name": "_srcAddress",
                "type": "bytes"
              },
              {
                "internalType": "uint64",
                "name": "_nonce",
                "type": "uint64"
              },
              {
                "internalType": "bytes",
                "name": "_payload",
                "type": "bytes"
              }
            ],
            "stateMutability": "nonpayable",
            "type": "function",
            "name": "lzReceive"
          },
          {
            "inputs": [
              {
                "internalType": "uint16",
                "name": "",
                "type": "uint16"
              },
              {
                "internalType": "uint16",
                "name": "",
                "type": "uint16"
              }
            ],
            "stateMutability": "view",
            "type": "function",
            "name": "minDstGasLookup",
            "outputs": [
              {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
              }
            ]
          },
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "_to",
                "type": "address"
              },
              {
                "internalType": "uint256",
                "name": "_amount",
                "type": "uint256"
              }
            ],
            "stateMutability": "nonpayable",
            "type": "function",
            "name": "mint"
          },
          {
            "inputs": [],
            "stateMutability": "view",
            "type": "function",
            "name": "name",
            "outputs": [
              {
                "internalType": "string",
                "name": "",
                "type": "string"
              }
            ]
          },
          {
            "inputs": [
              {
                "internalType": "uint16",
                "name": "_srcChainId",
                "type": "uint16"
              },
              {
                "internalType": "bytes",
                "name": "_srcAddress",
                "type": "bytes"
              },
              {
                "internalType": "uint64",
                "name": "_nonce",
                "type": "uint64"
              },
              {
                "internalType": "bytes",
                "name": "_payload",
                "type": "bytes"
              }
            ],
            "stateMutability": "nonpayable",
            "type": "function",
            "name": "nonblockingLzReceive"
          },
          {
            "inputs": [],
            "stateMutability": "view",
            "type": "function",
            "name": "owner",
            "outputs": [
              {
                "internalType": "address",
                "name": "",
                "type": "address"
              }
            ]
          },
          {
            "inputs": [
              {
                "internalType": "uint16",
                "name": "",
                "type": "uint16"
              }
            ],
            "stateMutability": "view",
            "type": "function",
            "name": "payloadSizeLimitLookup",
            "outputs": [
              {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
              }
            ]
          },
          {
            "inputs": [],
            "stateMutability": "view",
            "type": "function",
            "name": "precrime",
            "outputs": [
              {
                "internalType": "address",
                "name": "",
                "type": "address"
              }
            ]
          },
          {
            "inputs": [],
            "stateMutability": "nonpayable",
            "type": "function",
            "name": "renounceOwnership"
          },
          {
            "inputs": [
              {
                "internalType": "uint16",
                "name": "_srcChainId",
                "type": "uint16"
              },
              {
                "internalType": "bytes",
                "name": "_srcAddress",
                "type": "bytes"
              },
              {
                "internalType": "uint64",
                "name": "_nonce",
                "type": "uint64"
              },
              {
                "internalType": "bytes",
                "name": "_payload",
                "type": "bytes"
              }
            ],
            "stateMutability": "payable",
            "type": "function",
            "name": "retryMessage"
          },
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "_from",
                "type": "address"
              },
              {
                "internalType": "uint16",
                "name": "_dstChainId",
                "type": "uint16"
              },
              {
                "internalType": "bytes",
                "name": "_toAddress",
                "type": "bytes"
              },
              {
                "internalType": "uint256",
                "name": "_amount",
                "type": "uint256"
              },
              {
                "internalType": "address payable",
                "name": "_refundAddress",
                "type": "address"
              },
              {
                "internalType": "address",
                "name": "_zroPaymentAddress",
                "type": "address"
              },
              {
                "internalType": "bytes",
                "name": "_adapterParams",
                "type": "bytes"
              }
            ],
            "stateMutability": "payable",
            "type": "function",
            "name": "sendFrom"
          },
          {
            "inputs": [
              {
                "internalType": "uint16",
                "name": "_version",
                "type": "uint16"
              },
              {
                "internalType": "uint16",
                "name": "_chainId",
                "type": "uint16"
              },
              {
                "internalType": "uint256",
                "name": "_configType",
                "type": "uint256"
              },
              {
                "internalType": "bytes",
                "name": "_config",
                "type": "bytes"
              }
            ],
            "stateMutability": "nonpayable",
            "type": "function",
            "name": "setConfig"
          },
          {
            "inputs": [
              {
                "internalType": "uint16",
                "name": "_dstChainId",
                "type": "uint16"
              },
              {
                "internalType": "uint16",
                "name": "_packetType",
                "type": "uint16"
              },
              {
                "internalType": "uint256",
                "name": "_minGas",
                "type": "uint256"
              }
            ],
            "stateMutability": "nonpayable",
            "type": "function",
            "name": "setMinDstGas"
          },
          {
            "inputs": [
              {
                "internalType": "uint16",
                "name": "_dstChainId",
                "type": "uint16"
              },
              {
                "internalType": "uint256",
                "name": "_size",
                "type": "uint256"
              }
            ],
            "stateMutability": "nonpayable",
            "type": "function",
            "name": "setPayloadSizeLimit"
          },
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "_precrime",
                "type": "address"
              }
            ],
            "stateMutability": "nonpayable",
            "type": "function",
            "name": "setPrecrime"
          },
          {
            "inputs": [
              {
                "internalType": "uint16",
                "name": "_version",
                "type": "uint16"
              }
            ],
            "stateMutability": "nonpayable",
            "type": "function",
            "name": "setReceiveVersion"
          },
          {
            "inputs": [
              {
                "internalType": "uint16",
                "name": "_version",
                "type": "uint16"
              }
            ],
            "stateMutability": "nonpayable",
            "type": "function",
            "name": "setSendVersion"
          },
          {
            "inputs": [
              {
                "internalType": "uint16",
                "name": "_remoteChainId",
                "type": "uint16"
              },
              {
                "internalType": "bytes",
                "name": "_path",
                "type": "bytes"
              }
            ],
            "stateMutability": "nonpayable",
            "type": "function",
            "name": "setTrustedRemote"
          },
          {
            "inputs": [
              {
                "internalType": "uint16",
                "name": "_remoteChainId",
                "type": "uint16"
              },
              {
                "internalType": "bytes",
                "name": "_remoteAddress",
                "type": "bytes"
              }
            ],
            "stateMutability": "nonpayable",
            "type": "function",
            "name": "setTrustedRemoteAddress"
          },
          {
            "inputs": [
              {
                "internalType": "bool",
                "name": "_useCustomAdapterParams",
                "type": "bool"
              }
            ],
            "stateMutability": "nonpayable",
            "type": "function",
            "name": "setUseCustomAdapterParams"
          },
          {
            "inputs": [
              {
                "internalType": "bytes4",
                "name": "interfaceId",
                "type": "bytes4"
              }
            ],
            "stateMutability": "view",
            "type": "function",
            "name": "supportsInterface",
            "outputs": [
              {
                "internalType": "bool",
                "name": "",
                "type": "bool"
              }
            ]
          },
          {
            "inputs": [],
            "stateMutability": "view",
            "type": "function",
            "name": "symbol",
            "outputs": [
              {
                "internalType": "string",
                "name": "",
                "type": "string"
              }
            ]
          },
          {
            "inputs": [],
            "stateMutability": "view",
            "type": "function",
            "name": "token",
            "outputs": [
              {
                "internalType": "address",
                "name": "",
                "type": "address"
              }
            ]
          },
          {
            "inputs": [],
            "stateMutability": "view",
            "type": "function",
            "name": "totalSupply",
            "outputs": [
              {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
              }
            ]
          },
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "to",
                "type": "address"
              },
              {
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
              }
            ],
            "stateMutability": "nonpayable",
            "type": "function",
            "name": "transfer",
            "outputs": [
              {
                "internalType": "bool",
                "name": "",
                "type": "bool"
              }
            ]
          },
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "from",
                "type": "address"
              },
              {
                "internalType": "address",
                "name": "to",
                "type": "address"
              },
              {
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
              }
            ],
            "stateMutability": "nonpayable",
            "type": "function",
            "name": "transferFrom",
            "outputs": [
              {
                "internalType": "bool",
                "name": "",
                "type": "bool"
              }
            ]
          },
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
              }
            ],
            "stateMutability": "nonpayable",
            "type": "function",
            "name": "transferOwnership"
          },
          {
            "inputs": [
              {
                "internalType": "uint16",
                "name": "",
                "type": "uint16"
              }
            ],
            "stateMutability": "view",
            "type": "function",
            "name": "trustedRemoteLookup",
            "outputs": [
              {
                "internalType": "bytes",
                "name": "",
                "type": "bytes"
              }
            ]
          },
          {
            "inputs": [],
            "stateMutability": "view",
            "type": "function",
            "name": "useCustomAdapterParams",
            "outputs": [
              {
                "internalType": "bool",
                "name": "",
                "type": "bool"
              }
            ]
          }
        ],
        "devdoc": {
          "kind": "dev",
          "methods": {
            "allowance(address,address)": {
              "details": "See {IERC20-allowance}."
            },
            "approve(address,uint256)": {
              "details": "See {IERC20-approve}. NOTE: If `value` is the maximum `uint256`, the allowance is not updated on `transferFrom`. This is semantically equivalent to an infinite approval. Requirements: - `spender` cannot be the zero address."
            },
            "balanceOf(address)": {
              "details": "See {IERC20-balanceOf}."
            },
            "circulatingSupply()": {
              "details": "returns the circulating amount of tokens on current chain"
            },
            "decimals()": {
              "details": "Returns the number of decimals used to get its user representation. For example, if `decimals` equals `2`, a balance of `505` tokens should be displayed to a user as `5.05` (`505 / 10 ** 2`). Tokens usually opt for a value of 18, imitating the relationship between Ether and Wei. This is the default value returned by this function, unless it's overridden. NOTE: This information is only used for _display_ purposes: it in no way affects any of the arithmetic of the contract, including {IERC20-balanceOf} and {IERC20-transfer}."
            },
            "estimateSendFee(uint16,bytes,uint256,bool,bytes)": {
              "details": "estimate send token `_tokenId` to (`_dstChainId`, `_toAddress`) _dstChainId - L0 defined chain id to send tokens too _toAddress - dynamic bytes array which contains the address to whom you are sending tokens to on the dstChain _amount - amount of the tokens to transfer _useZro - indicates to use zro to pay L0 fees _adapterParam - flexible bytes array to indicate messaging adapter services in L0"
            },
            "name()": {
              "details": "Returns the name of the token."
            },
            "owner()": {
              "details": "Returns the address of the current owner."
            },
            "renounceOwnership()": {
              "details": "Leaves the contract without owner. It will not be possible to call `onlyOwner` functions. Can only be called by the current owner. NOTE: Renouncing ownership will leave the contract without an owner, thereby disabling any functionality that is only available to the owner."
            },
            "sendFrom(address,uint16,bytes,uint256,address,address,bytes)": {
              "details": "send `_amount` amount of token to (`_dstChainId`, `_toAddress`) from `_from` `_from` the owner of token `_dstChainId` the destination chain identifier `_toAddress` can be any size depending on the `dstChainId`. `_amount` the quantity of tokens in wei `_refundAddress` the address LayerZero refunds if too much message fee is sent `_zroPaymentAddress` set to address(0x0) if not paying in ZRO (LayerZero Token) `_adapterParams` is a flexible bytes array to indicate messaging adapter services"
            },
            "symbol()": {
              "details": "Returns the symbol of the token, usually a shorter version of the name."
            },
            "token()": {
              "details": "returns the address of the ERC20 token"
            },
            "totalSupply()": {
              "details": "See {IERC20-totalSupply}."
            },
            "transfer(address,uint256)": {
              "details": "See {IERC20-transfer}. Requirements: - `to` cannot be the zero address. - the caller must have a balance of at least `value`."
            },
            "transferFrom(address,address,uint256)": {
              "details": "See {IERC20-transferFrom}. Emits an {Approval} event indicating the updated allowance. This is not required by the EIP. See the note at the beginning of {ERC20}. NOTE: Does not update the allowance if the current allowance is the maximum `uint256`. Requirements: - `from` and `to` cannot be the zero address. - `from` must have a balance of at least `value`. - the caller must have allowance for ``from``'s tokens of at least `value`."
            },
            "transferOwnership(address)": {
              "details": "Transfers ownership of the contract to a new account (`newOwner`). Can only be called by the current owner."
            }
          },
          "version": 1
        },
        "userdoc": {
          "kind": "user",
          "methods": {},
          "version": 1
        }
      },
      "settings": {
        "remappings": [
          ":@layerzerolabs/solidity-examples/=lib/solidity-examples/",
          ":@openzeppelin/=lib/openzeppelin-contracts/",
          ":@openzeppelin/contracts-upgradeable/=lib/openzeppelin-contracts-upgradeable/contracts/",
          ":@openzeppelin/contracts/=lib/openzeppelin-contracts/contracts/",
          ":@upgradeable/=lib/openzeppelin-contracts-upgradeable/",
          ":@upgradeable/safeAccount/=lib/openzeppelin-contracts-upgradeable/",
          ":ds-test/=lib/forge-std/lib/ds-test/src/",
          ":erc4626-tests/=lib/openzeppelin-contracts/lib/erc4626-tests/",
          ":forge-std/=lib/forge-std/src/",
          ":openzeppelin-contracts-upgradeable/=lib/openzeppelin-contracts-upgradeable/",
          ":openzeppelin-contracts/=lib/openzeppelin-contracts/",
          ":solidity-examples/=lib/solidity-examples/contracts/"
        ],
        "optimizer": {
          "enabled": true,
          "runs": 200
        },
        "metadata": {
          "bytecodeHash": "ipfs"
        },
        "compilationTarget": {
          "src/MultiChainToken.sol": "MultiChainToken"
        },
        "libraries": {}
      },
      "sources": {
        "lib/openzeppelin-contracts/contracts/access/Ownable.sol": {
          "keccak256": "0xff6d0bb2e285473e5311d9d3caacb525ae3538a80758c10649a4d61029b017bb",
          "urls": [
            "bzz-raw://8ed324d3920bb545059d66ab97d43e43ee85fd3bd52e03e401f020afb0b120f6",
            "dweb:/ipfs/QmfEckWLmZkDDcoWrkEvMWhms66xwTLff9DDhegYpvHo1a"
          ],
          "license": "MIT"
        },
        "lib/openzeppelin-contracts/contracts/governance/utils/IVotes.sol": {
          "keccak256": "0x5e2b397ae88fd5c68e4f6762eb9f65f65c36702eb57796495f471d024ce70947",
          "urls": [
            "bzz-raw://348fc8e291d54314bb22437b532f443d5dbfb80c8cc9591567c1af6554ccf856",
            "dweb:/ipfs/QmP8ZTyitZinxcpwAHeYHhwj7u21zPpKXSiww38V74sXC2"
          ],
          "license": "MIT"
        },
        "lib/openzeppelin-contracts/contracts/governance/utils/Votes.sol": {
          "keccak256": "0xb8f69828d41b3594afd7a8c6393565901c205d8b5baf5bd2e42dbac637172979",
          "urls": [
            "bzz-raw://c790253821191ac46b2050d87df820d4209871f90c616381e2c2c00ff3eaac34",
            "dweb:/ipfs/QmcPETTyuZBzDRL39JNXj3SBMdx3Y9o4fPQLSZ27py5Jim"
          ],
          "license": "MIT"
        },
        "lib/openzeppelin-contracts/contracts/interfaces/IERC5267.sol": {
          "keccak256": "0x92aa1df62dc3d33f1656d63bede0923e0df0b706ad4137c8b10b0a8fe549fd92",
          "urls": [
            "bzz-raw://c5c0f29195ad64cbe556da8e257dac8f05f78c53f90323c0d2accf8e6922d33a",
            "dweb:/ipfs/QmQ61TED8uaCZwcbh8KkgRSsCav7x7HbcGHwHts3U4DmUP"
          ],
          "license": "MIT"
        },
        "lib/openzeppelin-contracts/contracts/interfaces/IERC5805.sol": {
          "keccak256": "0x4b9b89f91adbb7d3574f85394754cfb08c5b4eafca8a7061e2094a019ab8f818",
          "urls": [
            "bzz-raw://7373d5dbb8eb2381aa0883a456fac89283fcaf52f42fa805d4188f270716742a",
            "dweb:/ipfs/QmVnZDmT4ABvNhRJMaQnbCzsCA8HpyHPVaxi4fCi92LFv2"
          ],
          "license": "MIT"
        },
        "lib/openzeppelin-contracts/contracts/interfaces/IERC6372.sol": {
          "keccak256": "0xeb2857b7dafb7e0d8526dbfe794e6c047df2851c9e6ee91dc4a55f3c34af5d33",
          "urls": [
            "bzz-raw://49bf13f6c2a38a9bcc7b852d4e2b9cebb4068b832642cce61069cdb5f06bb2fb",
            "dweb:/ipfs/QmdKAJVE7rR2kENCZnEM1yKswrGii7WuE9gZpsQvnXJhwn"
          ],
          "license": "MIT"
        },
        "lib/openzeppelin-contracts/contracts/interfaces/draft-IERC6093.sol": {
          "keccak256": "0x60c65f701957fdd6faea1acb0bb45825791d473693ed9ecb34726fdfaa849dd7",
          "urls": [
            "bzz-raw://ea290300e0efc4d901244949dc4d877fd46e6c5e43dc2b26620e8efab3ab803f",
            "dweb:/ipfs/QmcLLJppxKeJWqHxE2CUkcfhuRTgHSn8J4kijcLa5MYhSt"
          ],
          "license": "MIT"
        },
        "lib/openzeppelin-contracts/contracts/token/ERC20/ERC20.sol": {
          "keccak256": "0xc3e1fa9d1987f8d349dfb4d6fe93bf2ca014b52ba335cfac30bfe71e357e6f80",
          "urls": [
            "bzz-raw://c5703ccdeb7b1d685e375ed719117e9edf2ab4bc544f24f23b0d50ec82257229",
            "dweb:/ipfs/QmTdwkbQq7owpCiyuzE7eh5LrD2ddrBCZ5WHVsWPi1RrTS"
          ],
          "license": "MIT"
        },
        "lib/openzeppelin-contracts/contracts/token/ERC20/IERC20.sol": {
          "keccak256": "0xc6a8ff0ea489379b61faa647490411b80102578440ab9d84e9a957cc12164e70",
          "urls": [
            "bzz-raw://0ea104e577e63faea3b69c415637e99e755dcbf64c5833d7140c35a714d6d90c",
            "dweb:/ipfs/Qmau6x4Ns9XdyynRCNNp3RhLqijJjFm7z5fyZazfYFGYdq"
          ],
          "license": "MIT"
        },
        "lib/openzeppelin-contracts/contracts/token/ERC20/extensions/ERC20Permit.sol": {
          "keccak256": "0xc858a86a35701004d89022a5e98819aac46ccbdc4072fc9dd43928a676b1a2ee",
          "urls": [
            "bzz-raw://18acebb483c512c0eaafcb437f09c839972c3f0d36f0201ea7baa2926b987dd2",
            "dweb:/ipfs/Qmd9bf2noaDSYDtf6FMSzKu7LPhuf91jsVNmcoCuTCuGic"
          ],
          "license": "MIT"
        },
        "lib/openzeppelin-contracts/contracts/token/ERC20/extensions/ERC20Votes.sol": {
          "keccak256": "0x2a650f6e593cfe5ff2e514a17ea7f593ee70cefa1888066bc983a6308acff4b1",
          "urls": [
            "bzz-raw://9a3477b9665a4b6d19f86bf2cfbfa8c08ba41193f15e68c0d75c0cab7e1fc753",
            "dweb:/ipfs/QmbcurrTatN1PBmkCWdrED8zhAqx5ah9Qp6uR8YwkKWA8V"
          ],
          "license": "MIT"
        },
        "lib/openzeppelin-contracts/contracts/token/ERC20/extensions/IERC20Metadata.sol": {
          "keccak256": "0xaa761817f6cd7892fcf158b3c776b34551cde36f48ff9703d53898bc45a94ea2",
          "urls": [
            "bzz-raw://0ad7c8d4d08938c8dfc43d75a148863fb324b80cf53e0a36f7e5a4ac29008850",
            "dweb:/ipfs/QmcrhfPgVNf5mkdhQvy1pMv51TFokD3Y4Wa5WZhFqVh8UV"
          ],
          "license": "MIT"
        },
        "lib/openzeppelin-contracts/contracts/token/ERC20/extensions/IERC20Permit.sol": {
          "keccak256": "0x6008dabfe393240d73d7dd7688033f72740d570aa422254d29a7dce8568f3aff",
          "urls": [
            "bzz-raw://f5196ec75139918c6c7bb4251b36395e668f1fa6d206beba7e7520e74913940d",
            "dweb:/ipfs/QmSyqjksXxmm2mCG6qRd1yuwLykypkSVBbnBnGqJRcuJMi"
          ],
          "license": "MIT"
        },
        "lib/openzeppelin-contracts/contracts/utils/Context.sol": {
          "keccak256": "0x493033a8d1b176a037b2cc6a04dad01a5c157722049bbecf632ca876224dd4b2",
          "urls": [
            "bzz-raw://6a708e8a5bdb1011c2c381c9a5cfd8a9a956d7d0a9dc1bd8bcdaf52f76ef2f12",
            "dweb:/ipfs/Qmax9WHBnVsZP46ZxEMNRQpLQnrdE4dK8LehML1Py8FowF"
          ],
          "license": "MIT"
        },
        "lib/openzeppelin-contracts/contracts/utils/Nonces.sol": {
          "keccak256": "0x0082767004fca261c332e9ad100868327a863a88ef724e844857128845ab350f",
          "urls": [
            "bzz-raw://132dce9686a54e025eb5ba5d2e48208f847a1ec3e60a3e527766d7bf53fb7f9e",
            "dweb:/ipfs/QmXn1a2nUZMpu2z6S88UoTfMVtY2YNh86iGrzJDYmMkKeZ"
          ],
          "license": "MIT"
        },
        "lib/openzeppelin-contracts/contracts/utils/ShortStrings.sol": {
          "keccak256": "0x18a7171df639a934592915a520ecb97c5bbc9675a1105607aac8a94e72bf62c6",
          "urls": [
            "bzz-raw://7478e1f13da69a2867ccd883001d836b75620362e743f196376d63ed0c422a1c",
            "dweb:/ipfs/QmWywcQ9TNfwtoqAxbn25d8C5VrV12PrPS9UjtGe6pL2BA"
          ],
          "license": "MIT"
        },
        "lib/openzeppelin-contracts/contracts/utils/StorageSlot.sol": {
          "keccak256": "0x32ba59b4b7299237c8ba56319110989d7978a039faf754793064e967e5894418",
          "urls": [
            "bzz-raw://1ae50c8b562427df610cc4540c9bf104acca7ef8e2dcae567ae7e52272281e9c",
            "dweb:/ipfs/QmTHiadFCSJUPpRjNegc5SahmeU8bAoY8i9Aq6tVscbcKR"
          ],
          "license": "MIT"
        },
        "lib/openzeppelin-contracts/contracts/utils/Strings.sol": {
          "keccak256": "0x55f102ea785d8399c0e58d1108e2d289506dde18abc6db1b7f68c1f9f9bc5792",
          "urls": [
            "bzz-raw://6e52e0a7765c943ef14e5bcf11e46e6139fa044be564881378349236bf2e3453",
            "dweb:/ipfs/QmZEeeXoFPW47amyP35gfzomF9DixqqTEPwzBakv6cZw6i"
          ],
          "license": "MIT"
        },
        "lib/openzeppelin-contracts/contracts/utils/cryptography/ECDSA.sol": {
          "keccak256": "0xeed0a08b0b091f528356cbc7245891a4c748682d4f6a18055e8e6ca77d12a6cf",
          "urls": [
            "bzz-raw://ba80ba06c8e6be852847e4c5f4492cef801feb6558ae09ed705ff2e04ea8b13c",
            "dweb:/ipfs/QmXRJDv3xHLVQCVXg1ZvR35QS9sij5y9NDWYzMfUfAdTHF"
          ],
          "license": "MIT"
        },
        "lib/openzeppelin-contracts/contracts/utils/cryptography/EIP712.sol": {
          "keccak256": "0x999f705a027ed6dc2d4e0df2cc4a509852c6bfd11de1c8161bf88832d0503fd0",
          "urls": [
            "bzz-raw://0798def67258d9a3cc20b2b4da7ebf351a5cefe0abfdd665d2d81f8e32f89b21",
            "dweb:/ipfs/QmPEvJosnPfzHNjKvCv2D3891mA2Ww8eUwkqrxBjuYdHCt"
          ],
          "license": "MIT"
        },
        "lib/openzeppelin-contracts/contracts/utils/cryptography/MessageHashUtils.sol": {
          "keccak256": "0xba333517a3add42cd35fe877656fc3dfcc9de53baa4f3aabbd6d12a92e4ea435",
          "urls": [
            "bzz-raw://2ceacff44c0fdc81e48e0e0b1db87a2076d3c1fb497341de077bf1da9f6b406c",
            "dweb:/ipfs/QmRUo1muMRAewxrKQ7TkXUtknyRoR57AyEkoPpiuZQ8FzX"
          ],
          "license": "MIT"
        },
        "lib/openzeppelin-contracts/contracts/utils/introspection/ERC165.sol": {
          "keccak256": "0x9e8778b14317ba9e256c30a76fd6c32b960af621987f56069e1e819c77c6a133",
          "urls": [
            "bzz-raw://1777404f1dcd0fac188e55a288724ec3c67b45288e49cc64723e95e702b49ab8",
            "dweb:/ipfs/QmZFdC626GButBApwDUvvTnUzdinevC3B24d7yyh57XkiA"
          ],
          "license": "MIT"
        },
        "lib/openzeppelin-contracts/contracts/utils/introspection/IERC165.sol": {
          "keccak256": "0x4296879f55019b23e135000eb36896057e7101fb7fb859c5ef690cf14643757b",
          "urls": [
            "bzz-raw://87b3541437c8c443ccd36795e56a338ed12855eec17f8da624511b8d1a7e14df",
            "dweb:/ipfs/QmeJQCtZrQjtJLr6u7ZHWeH3pBnjtLWzvRrKViAi7UZqxL"
          ],
          "license": "MIT"
        },
        "lib/openzeppelin-contracts/contracts/utils/math/Math.sol": {
          "keccak256": "0x005ec64c6313f0555d59e278f9a7a5ab2db5bdc72a027f255a37c327af1ec02d",
          "urls": [
            "bzz-raw://4ece9f0b9c8daca08c76b6b5405a6446b6f73b3a15fab7ff56e296cbd4a2c875",
            "dweb:/ipfs/QmQyRpyPRL5SQuAgj6SHmbir3foX65FJjbVTTQrA2EFg6L"
          ],
          "license": "MIT"
        },
        "lib/openzeppelin-contracts/contracts/utils/math/SafeCast.sol": {
          "keccak256": "0xe19a4d5f31d2861e7344e8e535e2feafb913d806d3e2b5fe7782741a2a7094fe",
          "urls": [
            "bzz-raw://4aed79c0fa6f0546ed02f2f683e8f77f0fd2ed7eb34d8bbf3d373c9a6d95b13c",
            "dweb:/ipfs/QmWqVz6UAVqmnWU5pqYPt1o6iDEZyPaBraAA3rKfTTSfYj"
          ],
          "license": "MIT"
        },
        "lib/openzeppelin-contracts/contracts/utils/math/SignedMath.sol": {
          "keccak256": "0x5f7e4076e175393767754387c962926577f1660dd9b810187b9002407656be72",
          "urls": [
            "bzz-raw://7d533a1c97cd43a57cd9c465f7ee8dd0e39ae93a8fb8ff8e5303a356b081cdcc",
            "dweb:/ipfs/QmVBEei6aTnvYNZp2CHYVNKyZS4q1KkjANfY39WVXZXVoT"
          ],
          "license": "MIT"
        },
        "lib/openzeppelin-contracts/contracts/utils/structs/Checkpoints.sol": {
          "keccak256": "0xbdc5e074d7dd6678f67e92b1a51a20226801a407b0e1af3da367c5d1ff4519ad",
          "urls": [
            "bzz-raw://a36cca6b22fff3db16fc789ff6c60eea71d4b156065d4d0c83a0bc5e91a77a8b",
            "dweb:/ipfs/QmYN3exd5AemxjBrN8XMB1p5LbbE16uC3sjbYjwi8AjcGR"
          ],
          "license": "MIT"
        },
        "lib/openzeppelin-contracts/contracts/utils/types/Time.sol": {
          "keccak256": "0xc7755af115020049e4140f224f9ee88d7e1799ffb0646f37bf0df24bf6213f58",
          "urls": [
            "bzz-raw://7f09bf94d5274334ec021f61a04659db303f31e60460e14b709c9bf187740111",
            "dweb:/ipfs/QmNvgomZYUwFAt4cZbPWAiTeSZQreGehY9BK5xyVJsUttb"
          ],
          "license": "MIT"
        },
        "lib/solidity-examples/contracts/libraries/BytesLib.sol": {
          "keccak256": "0x7e64cccdf22a03f513d94960f2145dd801fb5ec88d971de079b5186a9f5e93c4",
          "urls": [
            "bzz-raw://99d1b3433e5ee2cc86ff06b428875d1e8593163d941595ef0d7801f67de33798",
            "dweb:/ipfs/QmXjaGuGPn99QeFLMMVdekZEgLTScHMWY6dD7c4eiaEhVd"
          ],
          "license": "Unlicense"
        },
        "lib/solidity-examples/contracts/libraries/ExcessivelySafeCall.sol": {
          "keccak256": "0xd4e52af409b5ec80432292d86fb01906785eb78ac31da3bab4565aabcd6e3e56",
          "urls": [
            "bzz-raw://d9e3ced69d534bc3d2e13c097bfa51fcd514c636a5747ad4decca4a6d52b4a55",
            "dweb:/ipfs/QmWrywTjTXgHxSSQtg2aLdAQspR19aae3AfvAx4hf5FUs7"
          ],
          "license": "MIT OR Apache-2.0"
        },
        "lib/solidity-examples/contracts/lzApp/LzApp.sol": {
          "keccak256": "0x309c994bdcf69ad63c6789694a28eb72a773e2d9db58fe572ab2b34a475972ce",
          "urls": [
            "bzz-raw://050db330c03be5da7e4bd5452ce7a7baa0830e4f2484a155671f83f07b8e0e1c",
            "dweb:/ipfs/QmSGbBgAQwzHZFpmoVEamJacFdFcKC9xVS8fz5uGyV9X5h"
          ],
          "license": "MIT"
        },
        "lib/solidity-examples/contracts/lzApp/NonblockingLzApp.sol": {
          "keccak256": "0xf4bd9e0ecfa4eb18e7305eb66da44c8a4610c3d5afeaf6a3b44c4bf4b7169b40",
          "urls": [
            "bzz-raw://b46f827b40690ef64a60faece2c1c70ee0ef059f2f4df7dcf375afb8e877c6e0",
            "dweb:/ipfs/QmNZ9NEYcmn6Usvd1BU4eJLvkJpU2UXW4jU3JxZVRvwKuS"
          ],
          "license": "MIT"
        },
        "lib/solidity-examples/contracts/lzApp/interfaces/ILayerZeroEndpoint.sol": {
          "keccak256": "0xab7fcacc672251c850f00c0abd4100df9afcc4ad70b8d331a2fd4cb07acab9f4",
          "urls": [
            "bzz-raw://b1ec2cf50fa66402158702689fa05290ca8ec18ce77dea6d5094da645b0feb51",
            "dweb:/ipfs/QmbpixkLDpNiWk9FTTGsGannvnrXdM5K8tp4d5mw1LuQ9h"
          ],
          "license": "MIT"
        },
        "lib/solidity-examples/contracts/lzApp/interfaces/ILayerZeroReceiver.sol": {
          "keccak256": "0xac1966c1229bd4dc36b6c69eeb94a537bd9aa2198d7623b9ba7f8f7dbe79bb4c",
          "urls": [
            "bzz-raw://e981cbe707042648a10d2bb9b3f8b7c27206939050be58eb401c5ac9c9b4252f",
            "dweb:/ipfs/QmZXq7PwGcG7TLgTfnPEN6CBzx6CkSpEnbNDbfHfjRLqAo"
          ],
          "license": "MIT"
        },
        "lib/solidity-examples/contracts/lzApp/interfaces/ILayerZeroUserApplicationConfig.sol": {
          "keccak256": "0xb4df93aeb0fb46373a4fb728ad2603edc8b9a1577eee8d801768dc115bf96498",
          "urls": [
            "bzz-raw://b4a6f353e7b6823f98ecb34e3c6e79e2d3a08bb42e956e5b7768d78f3d585b64",
            "dweb:/ipfs/QmcJP5F13NANjAu4kHrj41kabvNZAktpQ1cRTgvj776Fwt"
          ],
          "license": "MIT"
        },
        "lib/solidity-examples/contracts/token/oft/v1/OFTCore.sol": {
          "keccak256": "0xca1426a15ebb32fee675a336d2f20ae7d6a688fecd3321731a3c3c7c987e3b39",
          "urls": [
            "bzz-raw://fdac2f580ef2de220fb7279697dcdbd94ef2405520ebeb568b012830929ac51c",
            "dweb:/ipfs/QmUwW9uypi26qSXTC77di4KizwBuSPkVjoUH1JqDytK65G"
          ],
          "license": "MIT"
        },
        "lib/solidity-examples/contracts/token/oft/v1/interfaces/IOFT.sol": {
          "keccak256": "0x102ab1f2484ffa58d3b913e469529e10a4843c655c529c9614468d1e9cf0ff8c",
          "urls": [
            "bzz-raw://f3b82006999c9b68a37b2f91bad1b017151d1bb716458caf76554c01018b7678",
            "dweb:/ipfs/Qmcf4khMQ8dpvDrogU2KEWd2qwwRzPcdQFoRePuB2aczT1"
          ],
          "license": "MIT"
        },
        "lib/solidity-examples/contracts/token/oft/v1/interfaces/IOFTCore.sol": {
          "keccak256": "0xc19c158682e42cad701a6c1f70011b039a2f928b3b491377af981bd5ffebbab8",
          "urls": [
            "bzz-raw://588094c947b80a667083b5f50e0f83cf099c8467758608339a0b6a354cbadb94",
            "dweb:/ipfs/QmY5C55jxN56AvfihRyusQyAuQvh2hqRjKduG4bZkXUP2Y"
          ],
          "license": "MIT"
        },
        "src/MultiChainToken.sol": {
          "keccak256": "0xa4154177e86506c7fb962cf91486802104993f126c617488f7ea222b9b6dd9a4",
          "urls": [
            "bzz-raw://6ef9b6b9d88b743509b4d3c790924f8bf53be475d3a4757abd07921edc5815ba",
            "dweb:/ipfs/QmSxBG8fm7Ki85GFk1MEhxVvNRrNv3K9jcpq6KF7pUnSWR"
          ],
          "license": "MIT"
        },
        "src/OFTToken.sol": {
          "keccak256": "0x80e997467117cd4cb5c9bfec74c896f5eb2856f5afdf2689aea2ba7a5f0d0649",
          "urls": [
            "bzz-raw://5367aa5756f1517a341c183681a8c254f14ea2c1aad8ea3179ef3a4345c0a94f",
            "dweb:/ipfs/QmUKt4id8nSMkWYGAVBGjPpHF8EdsK6awH6Ku9Lf3T8E6t"
          ],
          "license": "MIT"
        }
      },
      "version": 1
    },
    "ast": {
      "absolutePath": "src/MultiChainToken.sol",
      "id": 50558,
      "exportedSymbols": {
        "BytesLib": [
          48899
        ],
        "Checkpoints": [
          48291
        ],
        "Context": [
          42470
        ],
        "ECDSA": [
          43468
        ],
        "EIP712": [
          43695
        ],
        "ERC165": [
          43793
        ],
        "ERC20": [
          42014
        ],
        "ERC20Permit": [
          42246
        ],
        "ERC20Votes": [
          42378
        ],
        "ExcessivelySafeCall": [
          48996
        ],
        "IERC165": [
          43805
        ],
        "IERC20": [
          42092
        ],
        "IERC20Permit": [
          42440
        ],
        "ILayerZeroEndpoint": [
          49924
        ],
        "ILayerZeroReceiver": [
          49938
        ],
        "ILayerZeroUserApplicationConfig": [
          49969
        ],
        "IOFT": [
          50317
        ],
        "IOFTCore": [
          50396
        ],
        "LzApp": [
          49538
        ],
        "MultiChainToken": [
          50557
        ],
        "NonblockingLzApp": [
          49779
        ],
        "Nonces": [
          42538
        ],
        "OFTCore": [
          50307
        ],
        "OFTToken": [
          50696
        ],
        "Ownable": [
          40681
        ],
        "Votes": [
          41311
        ]
      },
      "nodeType": "SourceUnit",
      "src": "32:1038:55",
      "nodes": [
        {
          "id": 50459,
          "nodeType": "PragmaDirective",
          "src": "32:23:55",
          "nodes": [],
          "literals": [
            "solidity",
            "^",
            "0.8",
            ".0"
          ]
        },
        {
          "id": 50460,
          "nodeType": "ImportDirective",
          "src": "58:24:55",
          "nodes": [],
          "absolutePath": "src/OFTToken.sol",
          "file": "./OFTToken.sol",
          "nameLocation": "-1:-1:-1",
          "scope": 50558,
          "sourceUnit": 50697,
          "symbolAliases": [],
          "unitAlias": ""
        },
        {
          "id": 50461,
          "nodeType": "ImportDirective",
          "src": "83:72:55",
          "nodes": [],
          "absolutePath": "lib/openzeppelin-contracts/contracts/token/ERC20/extensions/ERC20Permit.sol",
          "file": "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol",
          "nameLocation": "-1:-1:-1",
          "scope": 50558,
          "sourceUnit": 42247,
          "symbolAliases": [],
          "unitAlias": ""
        },
        {
          "id": 50557,
          "nodeType": "ContractDefinition",
          "src": "158:912:55",
          "nodes": [
            {
              "id": 50486,
              "nodeType": "FunctionDefinition",
              "src": "202:201:55",
              "nodes": [],
              "body": {
                "id": 50485,
                "nodeType": "Block",
                "src": "353:50:55",
                "nodes": [],
                "statements": [
                  {
                    "expression": {
                      "arguments": [
                        {
                          "expression": {
                            "id": 50480,
                            "name": "msg",
                            "nodeType": "Identifier",
                            "overloadedDeclarations": [],
                            "referencedDeclaration": -15,
                            "src": "369:3:55",
                            "typeDescriptions": {
                              "typeIdentifier": "t_magic_message",
                              "typeString": "msg"
                            }
                          },
                          "id": 50481,
                          "isConstant": false,
                          "isLValue": false,
                          "isPure": false,
                          "lValueRequested": false,
                          "memberLocation": "373:6:55",
                          "memberName": "sender",
                          "nodeType": "MemberAccess",
                          "src": "369:10:55",
                          "typeDescriptions": {
                            "typeIdentifier": "t_address",
                            "typeString": "address"
                          }
                        },
                        {
                          "id": 50482,
                          "name": "_initialSupply",
                          "nodeType": "Identifier",
                          "overloadedDeclarations": [],
                          "referencedDeclaration": 50465,
                          "src": "381:14:55",
                          "typeDescriptions": {
                            "typeIdentifier": "t_uint256",
                            "typeString": "uint256"
                          }
                        }
                      ],
                      "expression": {
                        "argumentTypes": [
                          {
                            "typeIdentifier": "t_address",
                            "typeString": "address"
                          },
                          {
                            "typeIdentifier": "t_uint256",
                            "typeString": "uint256"
                          }
                        ],
                        "id": 50479,
                        "name": "_mint",
                        "nodeType": "Identifier",
                        "overloadedDeclarations": [],
                        "referencedDeclaration": 41854,
                        "src": "363:5:55",
                        "typeDescriptions": {
                          "typeIdentifier": "t_function_internal_nonpayable$_t_address_$_t_uint256_$returns$__$",
                          "typeString": "function (address,uint256)"
                        }
                      },
                      "id": 50483,
                      "isConstant": false,
                      "isLValue": false,
                      "isPure": false,
                      "kind": "functionCall",
                      "lValueRequested": false,
                      "nameLocations": [],
                      "names": [],
                      "nodeType": "FunctionCall",
                      "src": "363:33:55",
                      "tryCall": false,
                      "typeDescriptions": {
                        "typeIdentifier": "t_tuple$__$",
                        "typeString": "tuple()"
                      }
                    },
                    "id": 50484,
                    "nodeType": "ExpressionStatement",
                    "src": "363:33:55"
                  }
                ]
              },
              "implemented": true,
              "kind": "constructor",
              "modifiers": [
                {
                  "arguments": [
                    {
                      "hexValue": "5768616c652046696e616e636520546f6b656e",
                      "id": 50470,
                      "isConstant": false,
                      "isLValue": false,
                      "isPure": true,
                      "kind": "string",
                      "lValueRequested": false,
                      "nodeType": "Literal",
                      "src": "276:21:55",
                      "typeDescriptions": {
                        "typeIdentifier": "t_stringliteral_a3f437f72542412f7bf751855b4828a98231e60456fca2dd9ea68ab4078a92c5",
                        "typeString": "literal_string \"Whale Finance Token\""
                      },
                      "value": "Whale Finance Token"
                    },
                    {
                      "hexValue": "5748414c45",
                      "id": 50471,
                      "isConstant": false,
                      "isLValue": false,
                      "isPure": true,
                      "kind": "string",
                      "lValueRequested": false,
                      "nodeType": "Literal",
                      "src": "299:7:55",
                      "typeDescriptions": {
                        "typeIdentifier": "t_stringliteral_ed4b80c86c7954bdbf516c492acb4a2899eb0ee85b7c74e26d85e55a07562c95",
                        "typeString": "literal_string \"WHALE\""
                      },
                      "value": "WHALE"
                    },
                    {
                      "id": 50472,
                      "name": "_lzEndpoint",
                      "nodeType": "Identifier",
                      "overloadedDeclarations": [],
                      "referencedDeclaration": 50467,
                      "src": "308:11:55",
                      "typeDescriptions": {
                        "typeIdentifier": "t_address",
                        "typeString": "address"
                      }
                    }
                  ],
                  "id": 50473,
                  "kind": "baseConstructorSpecifier",
                  "modifierName": {
                    "id": 50469,
                    "name": "OFTToken",
                    "nameLocations": [
                      "267:8:55"
                    ],
                    "nodeType": "IdentifierPath",
                    "referencedDeclaration": 50696,
                    "src": "267:8:55"
                  },
                  "nodeType": "ModifierInvocation",
                  "src": "267:53:55"
                },
                {
                  "arguments": [
                    {
                      "expression": {
                        "id": 50475,
                        "name": "msg",
                        "nodeType": "Identifier",
                        "overloadedDeclarations": [],
                        "referencedDeclaration": -15,
                        "src": "337:3:55",
                        "typeDescriptions": {
                          "typeIdentifier": "t_magic_message",
                          "typeString": "msg"
                        }
                      },
                      "id": 50476,
                      "isConstant": false,
                      "isLValue": false,
                      "isPure": false,
                      "lValueRequested": false,
                      "memberLocation": "341:6:55",
                      "memberName": "sender",
                      "nodeType": "MemberAccess",
                      "src": "337:10:55",
                      "typeDescriptions": {
                        "typeIdentifier": "t_address",
                        "typeString": "address"
                      }
                    }
                  ],
                  "id": 50477,
                  "kind": "baseConstructorSpecifier",
                  "modifierName": {
                    "id": 50474,
                    "name": "Ownable",
                    "nameLocations": [
                      "329:7:55"
                    ],
                    "nodeType": "IdentifierPath",
                    "referencedDeclaration": 40681,
                    "src": "329:7:55"
                  },
                  "nodeType": "ModifierInvocation",
                  "src": "329:19:55"
                }
              ],
              "name": "",
              "nameLocation": "-1:-1:-1",
              "parameters": {
                "id": 50468,
                "nodeType": "ParameterList",
                "parameters": [
                  {
                    "constant": false,
                    "id": 50465,
                    "mutability": "mutable",
                    "name": "_initialSupply",
                    "nameLocation": "222:14:55",
                    "nodeType": "VariableDeclaration",
                    "scope": 50486,
                    "src": "214:22:55",
                    "stateVariable": false,
                    "storageLocation": "default",
                    "typeDescriptions": {
                      "typeIdentifier": "t_uint256",
                      "typeString": "uint256"
                    },
                    "typeName": {
                      "id": 50464,
                      "name": "uint256",
                      "nodeType": "ElementaryTypeName",
                      "src": "214:7:55",
                      "typeDescriptions": {
                        "typeIdentifier": "t_uint256",
                        "typeString": "uint256"
                      }
                    },
                    "visibility": "internal"
                  },
                  {
                    "constant": false,
                    "id": 50467,
                    "mutability": "mutable",
                    "name": "_lzEndpoint",
                    "nameLocation": "246:11:55",
                    "nodeType": "VariableDeclaration",
                    "scope": 50486,
                    "src": "238:19:55",
                    "stateVariable": false,
                    "storageLocation": "default",
                    "typeDescriptions": {
                      "typeIdentifier": "t_address",
                      "typeString": "address"
                    },
                    "typeName": {
                      "id": 50466,
                      "name": "address",
                      "nodeType": "ElementaryTypeName",
                      "src": "238:7:55",
                      "stateMutability": "nonpayable",
                      "typeDescriptions": {
                        "typeIdentifier": "t_address",
                        "typeString": "address"
                      }
                    },
                    "visibility": "internal"
                  }
                ],
                "src": "213:45:55"
              },
              "returnParameters": {
                "id": 50478,
                "nodeType": "ParameterList",
                "parameters": [],
                "src": "353:0:55"
              },
              "scope": 50557,
              "stateMutability": "nonpayable",
              "virtual": false,
              "visibility": "public"
            },
            {
              "id": 50495,
              "nodeType": "FunctionDefinition",
              "src": "409:91:55",
              "nodes": [],
              "body": {
                "id": 50494,
                "nodeType": "Block",
                "src": "474:26:55",
                "nodes": [],
                "statements": [
                  {
                    "expression": {
                      "hexValue": "3138",
                      "id": 50492,
                      "isConstant": false,
                      "isLValue": false,
                      "isPure": true,
                      "kind": "number",
                      "lValueRequested": false,
                      "nodeType": "Literal",
                      "src": "491:2:55",
                      "typeDescriptions": {
                        "typeIdentifier": "t_rational_18_by_1",
                        "typeString": "int_const 18"
                      },
                      "value": "18"
                    },
                    "functionReturnParameters": 50491,
                    "id": 50493,
                    "nodeType": "Return",
                    "src": "484:9:55"
                  }
                ]
              },
              "baseFunctions": [
                41578
              ],
              "functionSelector": "313ce567",
              "implemented": true,
              "kind": "function",
              "modifiers": [],
              "name": "decimals",
              "nameLocation": "418:8:55",
              "overrides": {
                "id": 50488,
                "nodeType": "OverrideSpecifier",
                "overrides": [],
                "src": "449:8:55"
              },
              "parameters": {
                "id": 50487,
                "nodeType": "ParameterList",
                "parameters": [],
                "src": "426:2:55"
              },
              "returnParameters": {
                "id": 50491,
                "nodeType": "ParameterList",
                "parameters": [
                  {
                    "constant": false,
                    "id": 50490,
                    "mutability": "mutable",
                    "name": "",
                    "nameLocation": "-1:-1:-1",
                    "nodeType": "VariableDeclaration",
                    "scope": 50495,
                    "src": "467:5:55",
                    "stateVariable": false,
                    "storageLocation": "default",
                    "typeDescriptions": {
                      "typeIdentifier": "t_uint8",
                      "typeString": "uint8"
                    },
                    "typeName": {
                      "id": 50489,
                      "name": "uint8",
                      "nodeType": "ElementaryTypeName",
                      "src": "467:5:55",
                      "typeDescriptions": {
                        "typeIdentifier": "t_uint8",
                        "typeString": "uint8"
                      }
                    },
                    "visibility": "internal"
                  }
                ],
                "src": "466:7:55"
              },
              "scope": 50557,
              "stateMutability": "view",
              "virtual": true,
              "visibility": "public"
            },
            {
              "id": 50508,
              "nodeType": "FunctionDefinition",
              "src": "506:87:55",
              "nodes": [],
              "body": {
                "id": 50507,
                "nodeType": "Block",
                "src": "557:36:55",
                "nodes": [],
                "statements": [
                  {
                    "expression": {
                      "arguments": [
                        {
                          "id": 50503,
                          "name": "_to",
                          "nodeType": "Identifier",
                          "overloadedDeclarations": [],
                          "referencedDeclaration": 50497,
                          "src": "573:3:55",
                          "typeDescriptions": {
                            "typeIdentifier": "t_address",
                            "typeString": "address"
                          }
                        },
                        {
                          "id": 50504,
                          "name": "_amount",
                          "nodeType": "Identifier",
                          "overloadedDeclarations": [],
                          "referencedDeclaration": 50499,
                          "src": "578:7:55",
                          "typeDescriptions": {
                            "typeIdentifier": "t_uint256",
                            "typeString": "uint256"
                          }
                        }
                      ],
                      "expression": {
                        "argumentTypes": [
                          {
                            "typeIdentifier": "t_address",
                            "typeString": "address"
                          },
                          {
                            "typeIdentifier": "t_uint256",
                            "typeString": "uint256"
                          }
                        ],
                        "id": 50502,
                        "name": "_mint",
                        "nodeType": "Identifier",
                        "overloadedDeclarations": [],
                        "referencedDeclaration": 41854,
                        "src": "567:5:55",
                        "typeDescriptions": {
                          "typeIdentifier": "t_function_internal_nonpayable$_t_address_$_t_uint256_$returns$__$",
                          "typeString": "function (address,uint256)"
                        }
                      },
                      "id": 50505,
                      "isConstant": false,
                      "isLValue": false,
                      "isPure": false,
                      "kind": "functionCall",
                      "lValueRequested": false,
                      "nameLocations": [],
                      "names": [],
                      "nodeType": "FunctionCall",
                      "src": "567:19:55",
                      "tryCall": false,
                      "typeDescriptions": {
                        "typeIdentifier": "t_tuple$__$",
                        "typeString": "tuple()"
                      }
                    },
                    "id": 50506,
                    "nodeType": "ExpressionStatement",
                    "src": "567:19:55"
                  }
                ]
              },
              "functionSelector": "40c10f19",
              "implemented": true,
              "kind": "function",
              "modifiers": [],
              "name": "mint",
              "nameLocation": "515:4:55",
              "parameters": {
                "id": 50500,
                "nodeType": "ParameterList",
                "parameters": [
                  {
                    "constant": false,
                    "id": 50497,
                    "mutability": "mutable",
                    "name": "_to",
                    "nameLocation": "528:3:55",
                    "nodeType": "VariableDeclaration",
                    "scope": 50508,
                    "src": "520:11:55",
                    "stateVariable": false,
                    "storageLocation": "default",
                    "typeDescriptions": {
                      "typeIdentifier": "t_address",
                      "typeString": "address"
                    },
                    "typeName": {
                      "id": 50496,
                      "name": "address",
                      "nodeType": "ElementaryTypeName",
                      "src": "520:7:55",
                      "stateMutability": "nonpayable",
                      "typeDescriptions": {
                        "typeIdentifier": "t_address",
                        "typeString": "address"
                      }
                    },
                    "visibility": "internal"
                  },
                  {
                    "constant": false,
                    "id": 50499,
                    "mutability": "mutable",
                    "name": "_amount",
                    "nameLocation": "541:7:55",
                    "nodeType": "VariableDeclaration",
                    "scope": 50508,
                    "src": "533:15:55",
                    "stateVariable": false,
                    "storageLocation": "default",
                    "typeDescriptions": {
                      "typeIdentifier": "t_uint256",
                      "typeString": "uint256"
                    },
                    "typeName": {
                      "id": 50498,
                      "name": "uint256",
                      "nodeType": "ElementaryTypeName",
                      "src": "533:7:55",
                      "typeDescriptions": {
                        "typeIdentifier": "t_uint256",
                        "typeString": "uint256"
                      }
                    },
                    "visibility": "internal"
                  }
                ],
                "src": "519:30:55"
              },
              "returnParameters": {
                "id": 50501,
                "nodeType": "ParameterList",
                "parameters": [],
                "src": "557:0:55"
              },
              "scope": 50557,
              "stateMutability": "nonpayable",
              "virtual": false,
              "visibility": "public"
            },
            {
              "id": 50532,
              "nodeType": "FunctionDefinition",
              "src": "599:203:55",
              "nodes": [],
              "body": {
                "id": 50531,
                "nodeType": "Block",
                "src": "665:137:55",
                "nodes": [],
                "statements": [
                  {
                    "expression": {
                      "arguments": [
                        {
                          "commonType": {
                            "typeIdentifier": "t_uint256",
                            "typeString": "uint256"
                          },
                          "id": 50519,
                          "isConstant": false,
                          "isLValue": false,
                          "isPure": false,
                          "lValueRequested": false,
                          "leftExpression": {
                            "id": 50516,
                            "name": "_chainId",
                            "nodeType": "Identifier",
                            "overloadedDeclarations": [],
                            "referencedDeclaration": 50510,
                            "src": "683:8:55",
                            "typeDescriptions": {
                              "typeIdentifier": "t_uint256",
                              "typeString": "uint256"
                            }
                          },
                          "nodeType": "BinaryOperation",
                          "operator": "==",
                          "rightExpression": {
                            "expression": {
                              "id": 50517,
                              "name": "block",
                              "nodeType": "Identifier",
                              "overloadedDeclarations": [],
                              "referencedDeclaration": -4,
                              "src": "695:5:55",
                              "typeDescriptions": {
                                "typeIdentifier": "t_magic_block",
                                "typeString": "block"
                              }
                            },
                            "id": 50518,
                            "isConstant": false,
                            "isLValue": false,
                            "isPure": false,
                            "lValueRequested": false,
                            "memberLocation": "701:7:55",
                            "memberName": "chainid",
                            "nodeType": "MemberAccess",
                            "src": "695:13:55",
                            "typeDescriptions": {
                              "typeIdentifier": "t_uint256",
                              "typeString": "uint256"
                            }
                          },
                          "src": "683:25:55",
                          "typeDescriptions": {
                            "typeIdentifier": "t_bool",
                            "typeString": "bool"
                          }
                        },
                        {
                          "hexValue": "4d756c7469436861696e546f6b656e3a20636861696e4964206e6f74206d61746368",
                          "id": 50520,
                          "isConstant": false,
                          "isLValue": false,
                          "isPure": true,
                          "kind": "string",
                          "lValueRequested": false,
                          "nodeType": "Literal",
                          "src": "710:36:55",
                          "typeDescriptions": {
                            "typeIdentifier": "t_stringliteral_5f1577599a1526dfaa5c7798c37b7eaaad98ba1d64eeb65ded2678d1c03b246d",
                            "typeString": "literal_string \"MultiChainToken: chainId not match\""
                          },
                          "value": "MultiChainToken: chainId not match"
                        }
                      ],
                      "expression": {
                        "argumentTypes": [
                          {
                            "typeIdentifier": "t_bool",
                            "typeString": "bool"
                          },
                          {
                            "typeIdentifier": "t_stringliteral_5f1577599a1526dfaa5c7798c37b7eaaad98ba1d64eeb65ded2678d1c03b246d",
                            "typeString": "literal_string \"MultiChainToken: chainId not match\""
                          }
                        ],
                        "id": 50515,
                        "name": "require",
                        "nodeType": "Identifier",
                        "overloadedDeclarations": [
                          -18,
                          -18
                        ],
                        "referencedDeclaration": -18,
                        "src": "675:7:55",
                        "typeDescriptions": {
                          "typeIdentifier": "t_function_require_pure$_t_bool_$_t_string_memory_ptr_$returns$__$",
                          "typeString": "function (bool,string memory) pure"
                        }
                      },
                      "id": 50521,
                      "isConstant": false,
                      "isLValue": false,
                      "isPure": false,
                      "kind": "functionCall",
                      "lValueRequested": false,
                      "nameLocations": [],
                      "names": [],
                      "nodeType": "FunctionCall",
                      "src": "675:72:55",
                      "tryCall": false,
                      "typeDescriptions": {
                        "typeIdentifier": "t_tuple$__$",
                        "typeString": "tuple()"
                      }
                    },
                    "id": 50522,
                    "nodeType": "ExpressionStatement",
                    "src": "675:72:55"
                  },
                  {
                    "expression": {
                      "arguments": [
                        {
                          "expression": {
                            "id": 50524,
                            "name": "msg",
                            "nodeType": "Identifier",
                            "overloadedDeclarations": [],
                            "referencedDeclaration": -15,
                            "src": "768:3:55",
                            "typeDescriptions": {
                              "typeIdentifier": "t_magic_message",
                              "typeString": "msg"
                            }
                          },
                          "id": 50525,
                          "isConstant": false,
                          "isLValue": false,
                          "isPure": false,
                          "lValueRequested": false,
                          "memberLocation": "772:6:55",
                          "memberName": "sender",
                          "nodeType": "MemberAccess",
                          "src": "768:10:55",
                          "typeDescriptions": {
                            "typeIdentifier": "t_address",
                            "typeString": "address"
                          }
                        },
                        {
                          "hexValue": "30",
                          "id": 50526,
                          "isConstant": false,
                          "isLValue": false,
                          "isPure": true,
                          "kind": "number",
                          "lValueRequested": false,
                          "nodeType": "Literal",
                          "src": "780:1:55",
                          "typeDescriptions": {
                            "typeIdentifier": "t_rational_0_by_1",
                            "typeString": "int_const 0"
                          },
                          "value": "0"
                        },
                        {
                          "hexValue": "",
                          "id": 50527,
                          "isConstant": false,
                          "isLValue": false,
                          "isPure": true,
                          "kind": "string",
                          "lValueRequested": false,
                          "nodeType": "Literal",
                          "src": "783:2:55",
                          "typeDescriptions": {
                            "typeIdentifier": "t_stringliteral_c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470",
                            "typeString": "literal_string \"\""
                          },
                          "value": ""
                        },
                        {
                          "id": 50528,
                          "name": "_amount",
                          "nodeType": "Identifier",
                          "overloadedDeclarations": [],
                          "referencedDeclaration": 50512,
                          "src": "787:7:55",
                          "typeDescriptions": {
                            "typeIdentifier": "t_uint256",
                            "typeString": "uint256"
                          }
                        }
                      ],
                      "expression": {
                        "argumentTypes": [
                          {
                            "typeIdentifier": "t_address",
                            "typeString": "address"
                          },
                          {
                            "typeIdentifier": "t_rational_0_by_1",
                            "typeString": "int_const 0"
                          },
                          {
                            "typeIdentifier": "t_stringliteral_c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470",
                            "typeString": "literal_string \"\""
                          },
                          {
                            "typeIdentifier": "t_uint256",
                            "typeString": "uint256"
                          }
                        ],
                        "id": 50523,
                        "name": "_debitFrom",
                        "nodeType": "Identifier",
                        "overloadedDeclarations": [
                          50675
                        ],
                        "referencedDeclaration": 50675,
                        "src": "757:10:55",
                        "typeDescriptions": {
                          "typeIdentifier": "t_function_internal_nonpayable$_t_address_$_t_uint16_$_t_bytes_memory_ptr_$_t_uint256_$returns$_t_uint256_$",
                          "typeString": "function (address,uint16,bytes memory,uint256) returns (uint256)"
                        }
                      },
                      "id": 50529,
                      "isConstant": false,
                      "isLValue": false,
                      "isPure": false,
                      "kind": "functionCall",
                      "lValueRequested": false,
                      "nameLocations": [],
                      "names": [],
                      "nodeType": "FunctionCall",
                      "src": "757:38:55",
                      "tryCall": false,
                      "typeDescriptions": {
                        "typeIdentifier": "t_uint256",
                        "typeString": "uint256"
                      }
                    },
                    "id": 50530,
                    "nodeType": "ExpressionStatement",
                    "src": "757:38:55"
                  }
                ]
              },
              "functionSelector": "c3e806d2",
              "implemented": true,
              "kind": "function",
              "modifiers": [],
              "name": "debitFromChain",
              "nameLocation": "608:14:55",
              "parameters": {
                "id": 50513,
                "nodeType": "ParameterList",
                "parameters": [
                  {
                    "constant": false,
                    "id": 50510,
                    "mutability": "mutable",
                    "name": "_chainId",
                    "nameLocation": "631:8:55",
                    "nodeType": "VariableDeclaration",
                    "scope": 50532,
                    "src": "623:16:55",
                    "stateVariable": false,
                    "storageLocation": "default",
                    "typeDescriptions": {
                      "typeIdentifier": "t_uint256",
                      "typeString": "uint256"
                    },
                    "typeName": {
                      "id": 50509,
                      "name": "uint256",
                      "nodeType": "ElementaryTypeName",
                      "src": "623:7:55",
                      "typeDescriptions": {
                        "typeIdentifier": "t_uint256",
                        "typeString": "uint256"
                      }
                    },
                    "visibility": "internal"
                  },
                  {
                    "constant": false,
                    "id": 50512,
                    "mutability": "mutable",
                    "name": "_amount",
                    "nameLocation": "649:7:55",
                    "nodeType": "VariableDeclaration",
                    "scope": 50532,
                    "src": "641:15:55",
                    "stateVariable": false,
                    "storageLocation": "default",
                    "typeDescriptions": {
                      "typeIdentifier": "t_uint256",
                      "typeString": "uint256"
                    },
                    "typeName": {
                      "id": 50511,
                      "name": "uint256",
                      "nodeType": "ElementaryTypeName",
                      "src": "641:7:55",
                      "typeDescriptions": {
                        "typeIdentifier": "t_uint256",
                        "typeString": "uint256"
                      }
                    },
                    "visibility": "internal"
                  }
                ],
                "src": "622:35:55"
              },
              "returnParameters": {
                "id": 50514,
                "nodeType": "ParameterList",
                "parameters": [],
                "src": "665:0:55"
              },
              "scope": 50557,
              "stateMutability": "nonpayable",
              "virtual": false,
              "visibility": "public"
            },
            {
              "id": 50556,
              "nodeType": "FunctionDefinition",
              "src": "808:196:55",
              "nodes": [],
              "body": {
                "id": 50555,
                "nodeType": "Block",
                "src": "879:125:55",
                "nodes": [],
                "statements": [
                  {
                    "expression": {
                      "arguments": [
                        {
                          "commonType": {
                            "typeIdentifier": "t_uint256",
                            "typeString": "uint256"
                          },
                          "id": 50545,
                          "isConstant": false,
                          "isLValue": false,
                          "isPure": false,
                          "lValueRequested": false,
                          "leftExpression": {
                            "id": 50542,
                            "name": "_chainId",
                            "nodeType": "Identifier",
                            "overloadedDeclarations": [],
                            "referencedDeclaration": 50534,
                            "src": "897:8:55",
                            "typeDescriptions": {
                              "typeIdentifier": "t_uint256",
                              "typeString": "uint256"
                            }
                          },
                          "nodeType": "BinaryOperation",
                          "operator": "==",
                          "rightExpression": {
                            "expression": {
                              "id": 50543,
                              "name": "block",
                              "nodeType": "Identifier",
                              "overloadedDeclarations": [],
                              "referencedDeclaration": -4,
                              "src": "909:5:55",
                              "typeDescriptions": {
                                "typeIdentifier": "t_magic_block",
                                "typeString": "block"
                              }
                            },
                            "id": 50544,
                            "isConstant": false,
                            "isLValue": false,
                            "isPure": false,
                            "lValueRequested": false,
                            "memberLocation": "915:7:55",
                            "memberName": "chainid",
                            "nodeType": "MemberAccess",
                            "src": "909:13:55",
                            "typeDescriptions": {
                              "typeIdentifier": "t_uint256",
                              "typeString": "uint256"
                            }
                          },
                          "src": "897:25:55",
                          "typeDescriptions": {
                            "typeIdentifier": "t_bool",
                            "typeString": "bool"
                          }
                        },
                        {
                          "hexValue": "4d756c7469436861696e546f6b656e3a20636861696e4964206e6f74206d61746368",
                          "id": 50546,
                          "isConstant": false,
                          "isLValue": false,
                          "isPure": true,
                          "kind": "string",
                          "lValueRequested": false,
                          "nodeType": "Literal",
                          "src": "924:36:55",
                          "typeDescriptions": {
                            "typeIdentifier": "t_stringliteral_5f1577599a1526dfaa5c7798c37b7eaaad98ba1d64eeb65ded2678d1c03b246d",
                            "typeString": "literal_string \"MultiChainToken: chainId not match\""
                          },
                          "value": "MultiChainToken: chainId not match"
                        }
                      ],
                      "expression": {
                        "argumentTypes": [
                          {
                            "typeIdentifier": "t_bool",
                            "typeString": "bool"
                          },
                          {
                            "typeIdentifier": "t_stringliteral_5f1577599a1526dfaa5c7798c37b7eaaad98ba1d64eeb65ded2678d1c03b246d",
                            "typeString": "literal_string \"MultiChainToken: chainId not match\""
                          }
                        ],
                        "id": 50541,
                        "name": "require",
                        "nodeType": "Identifier",
                        "overloadedDeclarations": [
                          -18,
                          -18
                        ],
                        "referencedDeclaration": -18,
                        "src": "889:7:55",
                        "typeDescriptions": {
                          "typeIdentifier": "t_function_require_pure$_t_bool_$_t_string_memory_ptr_$returns$__$",
                          "typeString": "function (bool,string memory) pure"
                        }
                      },
                      "id": 50547,
                      "isConstant": false,
                      "isLValue": false,
                      "isPure": false,
                      "kind": "functionCall",
                      "lValueRequested": false,
                      "nameLocations": [],
                      "names": [],
                      "nodeType": "FunctionCall",
                      "src": "889:72:55",
                      "tryCall": false,
                      "typeDescriptions": {
                        "typeIdentifier": "t_tuple$__$",
                        "typeString": "tuple()"
                      }
                    },
                    "id": 50548,
                    "nodeType": "ExpressionStatement",
                    "src": "889:72:55"
                  },
                  {
                    "expression": {
                      "arguments": [
                        {
                          "hexValue": "30",
                          "id": 50550,
                          "isConstant": false,
                          "isLValue": false,
                          "isPure": true,
                          "kind": "number",
                          "lValueRequested": false,
                          "nodeType": "Literal",
                          "src": "981:1:55",
                          "typeDescriptions": {
                            "typeIdentifier": "t_rational_0_by_1",
                            "typeString": "int_const 0"
                          },
                          "value": "0"
                        },
                        {
                          "id": 50551,
                          "name": "_to",
                          "nodeType": "Identifier",
                          "overloadedDeclarations": [],
                          "referencedDeclaration": 50536,
                          "src": "984:3:55",
                          "typeDescriptions": {
                            "typeIdentifier": "t_address",
                            "typeString": "address"
                          }
                        },
                        {
                          "id": 50552,
                          "name": "_amount",
                          "nodeType": "Identifier",
                          "overloadedDeclarations": [],
                          "referencedDeclaration": 50538,
                          "src": "989:7:55",
                          "typeDescriptions": {
                            "typeIdentifier": "t_uint256",
                            "typeString": "uint256"
                          }
                        }
                      ],
                      "expression": {
                        "argumentTypes": [
                          {
                            "typeIdentifier": "t_rational_0_by_1",
                            "typeString": "int_const 0"
                          },
                          {
                            "typeIdentifier": "t_address",
                            "typeString": "address"
                          },
                          {
                            "typeIdentifier": "t_uint256",
                            "typeString": "uint256"
                          }
                        ],
                        "id": 50549,
                        "name": "_creditTo",
                        "nodeType": "Identifier",
                        "overloadedDeclarations": [
                          50695
                        ],
                        "referencedDeclaration": 50695,
                        "src": "971:9:55",
                        "typeDescriptions": {
                          "typeIdentifier": "t_function_internal_nonpayable$_t_uint16_$_t_address_$_t_uint256_$returns$_t_uint256_$",
                          "typeString": "function (uint16,address,uint256) returns (uint256)"
                        }
                      },
                      "id": 50553,
                      "isConstant": false,
                      "isLValue": false,
                      "isPure": false,
                      "kind": "functionCall",
                      "lValueRequested": false,
                      "nameLocations": [],
                      "names": [],
                      "nodeType": "FunctionCall",
                      "src": "971:26:55",
                      "tryCall": false,
                      "typeDescriptions": {
                        "typeIdentifier": "t_uint256",
                        "typeString": "uint256"
                      }
                    },
                    "id": 50554,
                    "nodeType": "ExpressionStatement",
                    "src": "971:26:55"
                  }
                ]
              },
              "functionSelector": "dc396e5b",
              "implemented": true,
              "kind": "function",
              "modifiers": [],
              "name": "credit",
              "nameLocation": "817:6:55",
              "parameters": {
                "id": 50539,
                "nodeType": "ParameterList",
                "parameters": [
                  {
                    "constant": false,
                    "id": 50534,
                    "mutability": "mutable",
                    "name": "_chainId",
                    "nameLocation": "832:8:55",
                    "nodeType": "VariableDeclaration",
                    "scope": 50556,
                    "src": "824:16:55",
                    "stateVariable": false,
                    "storageLocation": "default",
                    "typeDescriptions": {
                      "typeIdentifier": "t_uint256",
                      "typeString": "uint256"
                    },
                    "typeName": {
                      "id": 50533,
                      "name": "uint256",
                      "nodeType": "ElementaryTypeName",
                      "src": "824:7:55",
                      "typeDescriptions": {
                        "typeIdentifier": "t_uint256",
                        "typeString": "uint256"
                      }
                    },
                    "visibility": "internal"
                  },
                  {
                    "constant": false,
                    "id": 50536,
                    "mutability": "mutable",
                    "name": "_to",
                    "nameLocation": "850:3:55",
                    "nodeType": "VariableDeclaration",
                    "scope": 50556,
                    "src": "842:11:55",
                    "stateVariable": false,
                    "storageLocation": "default",
                    "typeDescriptions": {
                      "typeIdentifier": "t_address",
                      "typeString": "address"
                    },
                    "typeName": {
                      "id": 50535,
                      "name": "address",
                      "nodeType": "ElementaryTypeName",
                      "src": "842:7:55",
                      "stateMutability": "nonpayable",
                      "typeDescriptions": {
                        "typeIdentifier": "t_address",
                        "typeString": "address"
                      }
                    },
                    "visibility": "internal"
                  },
                  {
                    "constant": false,
                    "id": 50538,
                    "mutability": "mutable",
                    "name": "_amount",
                    "nameLocation": "863:7:55",
                    "nodeType": "VariableDeclaration",
                    "scope": 50556,
                    "src": "855:15:55",
                    "stateVariable": false,
                    "storageLocation": "default",
                    "typeDescriptions": {
                      "typeIdentifier": "t_uint256",
                      "typeString": "uint256"
                    },
                    "typeName": {
                      "id": 50537,
                      "name": "uint256",
                      "nodeType": "ElementaryTypeName",
                      "src": "855:7:55",
                      "typeDescriptions": {
                        "typeIdentifier": "t_uint256",
                        "typeString": "uint256"
                      }
                    },
                    "visibility": "internal"
                  }
                ],
                "src": "823:48:55"
              },
              "returnParameters": {
                "id": 50540,
                "nodeType": "ParameterList",
                "parameters": [],
                "src": "879:0:55"
              },
              "scope": 50557,
              "stateMutability": "nonpayable",
              "virtual": false,
              "visibility": "public"
            }
          ],
          "abstract": false,
          "baseContracts": [
            {
              "baseName": {
                "id": 50462,
                "name": "OFTToken",
                "nameLocations": [
                  "186:8:55"
                ],
                "nodeType": "IdentifierPath",
                "referencedDeclaration": 50696,
                "src": "186:8:55"
              },
              "id": 50463,
              "nodeType": "InheritanceSpecifier",
              "src": "186:8:55"
            }
          ],
          "canonicalName": "MultiChainToken",
          "contractDependencies": [],
          "contractKind": "contract",
          "fullyImplemented": true,
          "linearizedBaseContracts": [
            50557,
            50696,
            50317,
            42014,
            41404,
            42404,
            42092,
            50307,
            50396,
            43793,
            43805,
            49779,
            49538,
            49969,
            49938,
            40681,
            42470
          ],
          "name": "MultiChainToken",
          "nameLocation": "167:15:55",
          "scope": 50558,
          "usedErrors": [
            40547,
            40552,
            41374,
            41379,
            41384,
            41393,
            41398,
            41403
          ],
          "usedEvents": [
            40558,
            42026,
            42035,
            49038,
            49044,
            49050,
            49058,
            49576,
            49586,
            50382,
            50391,
            50395
          ]
        }
      ],
      "license": "MIT"
    },
    "id": 55
  }

  

export const MultiChainTokenAbi = MultichainToken["abi"];