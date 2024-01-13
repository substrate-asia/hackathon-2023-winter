// SPDX-License-Identifier: MIT
pragma solidity >=0.8.21;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract QuestionNFT is ERC721URIStorage {
  IERC20 public token;

  struct Question {
    uint256 amount;
    address questioner;
    address payable answerer;
    bool isAnswered;
  }

  mapping(uint256 => Question) public questions;

  // Events
  event RewardCreated(address indexed creator, uint256 questionId, uint256 amount, string uri);
  event RewardGranted(address indexed answerer, uint256 questionId, uint256 amount);

  constructor (address _token) ERC721("DeQ Question Token", "DQT") {
    token = IERC20(_token);
  }

  function createReward(uint256 questionId, uint256 amount, string memory _uri) public {
    require(amount > 0, "Amount should be greater than 0.");
    token.transferFrom(msg.sender, address(this), amount);
    questions[questionId] = Question(amount, msg.sender, payable(address(0)), false);

    _mint(msg.sender, questionId);
    _setTokenURI(questionId, _uri);
    emit RewardCreated(msg.sender, questionId, amount, _uri);
  }

  function grantReward(uint256 questionId, address payable answerer) public {
    require(ownerOf(questionId) == msg.sender, "Only the NFT owner can grant the reward.");

    Question storage question = questions[questionId];

    require(!question.isAnswered, "Question is already answered.");
    require(question.amount > 0, "The question doesn't exist or the question amount is zero.");

    token.transfer(answerer, question.amount);

    question.isAnswered = true;
    question.answerer = answerer;

    emit RewardGranted(answerer, questionId, question.amount);
  }

  function getQuestion(uint256 questionId) public view returns (uint256, address, address, bool) {
    Question storage question = questions[questionId];
    return (question.amount, question.questioner, question.answerer, question.isAnswered);
  }
}
