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
  event RewardCreated(address indexed creator, uint256 questionId, uint256 amount);
  event RewardGranted(address indexed answerer, uint256 questionId, uint256 amount);

  constructor (address _token) ERC721("DeQ Question Token", "DQT") {
    token = IERC20(_token);
  }

  function createReward(uint256 _questionId, uint256 _amount) public {
    require(_amount > 0, "Amount should be greater than 0.");
    token.transferFrom(msg.sender, address(this), _amount);
    questions[_questionId] = Question(_amount, msg.sender, payable(address(0)), false);

    _mint(msg.sender, _questionId);
    emit RewardCreated(msg.sender, _questionId, _amount);
  }

  function grantReward(uint256 _questionId, address payable _answerer) public {
    require(ownerOf(_questionId) == msg.sender, "Only the NFT owner can grant the reward.");

    Question storage question = questions[_questionId];

    require(!question.isAnswered, "Question is already answered.");
    require(question.amount > 0, "The question doesn't exist or the question amount is zero.");

    token.transfer(_answerer, question.amount);

    question.isAnswered = true;
    question.answerer = _answerer;

    emit RewardGranted(_answerer, _questionId, question.amount);
  }

  function getQuestion(uint256 _questionId) public view returns (uint256, address, address, bool) {
    Question storage question = questions[_questionId];
    return (question.amount, question.questioner, question.answerer, question.isAnswered);
  }
}
