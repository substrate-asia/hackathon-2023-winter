// SPDX-License-Identifier: MIT
pragma solidity >=0.8.21;

import {ERC1155} from 'solmate/src/tokens/ERC1155.sol';

contract AnswerNFT is ERC1155 {

  //
  // Structs
  //

  struct Answer {
    uint256 id;
    uint256 questionId;
    address creator;
    string  uri;
  }

  enum ActionType {
    MINT,
    BUY,
    SELL
  }

  //
  // Storage
  //

  uint256 public nextId = 1;
  mapping(uint256 => Answer) public answers;
  mapping(uint256 => uint256) public totalSupply;
  mapping(uint256 => uint256) public pool;

  //
  // Constants
  //
  uint256 public constant CREATOR_PREMINT_SHARE = 1 ether;
  uint256 public constant CREATOR_FEE_PERCENT = 0.05 ether;

  //
  // Events
  //
  event Created(uint256 indexed id, uint256 indexed questionId, address indexed creator, string uri);
  event Bought(uint256 indexed id, address indexed sender, uint256 amount, uint256 price, uint256 fee);
  event Sold(uint256 indexed id, address indexed sender, uint256 amount, uint256 price, uint256 fee);

  //
  // Functions
  //

  function create(address creator, uint256 questionId, string memory _uri) public {
    // TODO only attestor can call create.
    uint256 id = nextId++;
    answers[id] = Answer(id, questionId, creator, _uri);
    totalSupply[id] += CREATOR_PREMINT_SHARE;

    _mint(creator, id, CREATOR_PREMINT_SHARE, '');
    emit Created(id, questionId, creator, _uri);
  }

  function buy(uint256 id, uint256 amount) external payable {
    require(id < nextId, "Token not exists.");
    require(amount > 0, "amount must be greater than 0.");

    uint256 price = getBuyPrice(id, amount);
    uint256 fee = (price * CREATOR_FEE_PERCENT) / 1 ether;

    require(msg.value >= price + fee, "Insufficient funds.");

    totalSupply[id] += amount;
    pool[id] += price;

    _mint(msg.sender, id, amount, "");
    emit Bought(id, msg.sender, amount, price, fee);

    (bool success, ) = answers[id].creator.call{value: fee}("");
    require(success, "Send creator fee failed.");
  }

  function sell(uint256 id, uint256 amount) external {
    require(id < nextId, "Token not exists.");
    require(amount > 0, 'amount must be greater than 0.');
    require(balanceOf[msg.sender][id] >= amount, 'Insufficient funds.');
    uint256 suply = totalSupply[id];
    require(suply - amount >= CREATOR_PREMINT_SHARE, 'Insufficient supply.');

    uint256 price = getSellPrice(id, amount);
    uint256 fee = price * CREATOR_FEE_PERCENT / 1 ether;

    _burn(msg.sender, id, amount);
    totalSupply[id] -= amount;
    pool[id] -= price;
    emit Sold(id, msg.sender, amount, price, fee);

    (bool sentPayment, ) = payable(msg.sender).call{value: price - fee}("");
    require(sentPayment, "Send payment failed.");
    (bool sentFee, ) = payable(answers[id].creator).call{value: fee}("");
    require(sentFee, "Send creator fee failed.");
  }

  //
  // Price calculator
  //

  function _curve(uint x) private pure returns (uint y) {
    if (x <= CREATOR_PREMINT_SHARE) {
      return 0;
    }
    uint256 base = x - CREATOR_PREMINT_SHARE;
    return base ** 3;
  }

  function getBuyPrice(uint256 id, uint256 amount) public view returns (uint256) {
    uint256 current = totalSupply[id];
    return (_curve(current + amount) - _curve(current)) / 1 ether / 1 ether / 50_000;
  }

  function getSellPrice(uint256 id, uint256 amount) public view returns (uint256) {
    uint256 current = totalSupply[id];
    return (_curve(current) - _curve(current - amount)) / 1 ether / 1 ether / 50_000;
  }

  function getBuyPriceWithFee(uint256 id, uint256 amount) public view returns (uint256) {
    uint256 price = getBuyPrice(id, amount);
    uint256 fee = (price * CREATOR_FEE_PERCENT) / 1 ether;
    return price + fee;
  }

  function getSellPriceWithFee(uint256 id, uint256 amount) public view returns (uint256) {
    uint256 price = getSellPrice(id, amount);
    uint256 fee = (price * CREATOR_FEE_PERCENT) / 1 ether;
    return price - fee;
  }

  //
  // Overrides
  //
  function uri(uint256 id) public view override returns (string memory) {
    return answers[id].uri;
  }
}
