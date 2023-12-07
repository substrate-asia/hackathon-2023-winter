// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import ".deps/npm/@openzeppelin/contracts/token/ERC20/IERC20.sol";

// NFT白名单服务合约
contract NFTWhitelist {
    mapping(address => bool) public whitelisted;
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    function addNFT(address nftAddress) external onlyOwner {
        whitelisted[nftAddress] = true;
    }

    function removeNFT(address nftAddress) external onlyOwner {
        whitelisted[nftAddress] = false;
    }
}

// 场外交易支持合约
contract Escrow {
    mapping(address => uint256) public deposits;

    function deposit(uint256 amount) external {
        deposits[msg.sender] += amount;
        // 将代币发送到合约
        // ...
    }

    function release(address recipient, uint256 amount) external {
        require(deposits[msg.sender] >= amount, "Insufficient balance");
        deposits[msg.sender] -= amount;
        // 执行代币转移操作
        // ...
    }
}

// 哈希锁定合约
contract HashTimeLockContract {
    struct Lock {
        address sender;
        address recipient;
        uint256 amount;
        bytes32 hashLock;
        uint256 expiration;
        bool withdrawn;
    }

    mapping(bytes32 => Lock) public locks;

    function lockFunds(
        address recipient,
        bytes32 hashLock,
        uint256 expiration
    ) external payable {
        require(msg.value > 0, "Invalid amount");
        require(expiration > block.timestamp, "Invalid expiration");

        bytes32 lockId = keccak256(abi.encodePacked(msg.sender, recipient, msg.value, hashLock, expiration));

        require(locks[lockId].amount == 0, "Funds already locked");

        locks[lockId] = Lock(msg.sender, recipient, msg.value, hashLock, expiration, false);
    }

    function withdraw(bytes32 preimage) external {
        bytes32 lockId = keccak256(abi.encodePacked(msg.sender, preimage));
        Lock storage lock = locks[lockId];

        require(lock.amount > 0, "No funds locked");
        require(lock.recipient == msg.sender, "Not recipient");
        require(lock.expiration > block.timestamp, "Lock expired");
        require(lock.hashLock == keccak256(abi.encodePacked(preimage)), "Invalid preimage");
        require(!lock.withdrawn, "Funds already withdrawn");

        lock.withdrawn = true;
        payable(msg.sender).transfer(lock.amount);
    }
}

// 链上钱包合约
contract ChainWallet {
    address public owner;
    IERC20 public token;
    NFTWhitelist public whitelist;
    Escrow public escrow;
    HashTimeLockContract public hashTimeLock;

    event Transfer(address indexed from, address indexed to, uint256 amount);

    constructor(address _token, address _whitelist, address _escrow, address _hashTimeLock) {
        owner = msg.sender;
        token = IERC20(_token);
        whitelist = NFTWhitelist(_whitelist);
        escrow = Escrow(_escrow);
        hashTimeLock = HashTimeLockContract(_hashTimeLock);
    }

    function deposit(uint256 amount) external {
        require(token.transferFrom(msg.sender, address(this), amount), "Transfer failed");
        emit Transfer(msg.sender, address(this), amount);
    }

    function withdraw(uint256 amount) external {
        require(msg.sender == owner, "Only owner can withdraw");
        require(token.transfer(owner, amount), "Transfer failed");
        emit Transfer(address(this), owner, amount);
    }

    function getBalance() public view returns (uint256) {
        return token.balanceOf(address(this));
    }

    function addToWhitelist(address nftAddress) external {
        whitelist.addNFT(nftAddress);
    }

    function removeFromWhitelist(address nftAddress) external {
        whitelist.removeNFT(nftAddress);
    }

    function depositToEscrow(uint256 amount) external {
        escrow.deposit(amount);
    }

    function releaseFromEscrow(address recipient, uint256 amount) external {
        escrow.release(recipient, amount);
    }

    function lockFunds(
        address recipient,
        bytes32 hashLock,
        uint256 expiration
    ) external payable {
        hashTimeLock.lockFunds{value: msg.value}(recipient, hashLock, expiration);
    }

    function withdrawFromHashTimeLock(bytes32 preimage) external {
        hashTimeLock.withdraw(preimage);
    }
}