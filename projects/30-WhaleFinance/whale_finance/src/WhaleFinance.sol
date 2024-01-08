// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./interface/IERC6551Registry.sol";
import "@openzeppelin/contracts/proxy/beacon/BeaconProxy.sol";
import "@openzeppelin/contracts/proxy/beacon/IBeacon.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/proxy/beacon/BeaconProxy.sol";
import "./QuotaToken.sol";
import "./interface/IV2SwapRouter.sol";
import "./SafeAccount.sol";

struct OpenRedeemProposal {
    uint256 fundId;
    uint256 newTimestamp;
    uint256 deadline;
    bool accepted;
    string name;        
}

struct SwapProposal {
    uint256 fundId;
    uint256 amountIn;
    uint256 amountOutMin;
    address[] path;
    address to;
    uint256 deadlineSwap;
    uint256 deadlineVote;
    bool accepted;
    string name;
}

contract WhaleFinance is ERC721, Ownable {
    //GLOBAL VARIABLES FOR THE PLATFORM
    uint256 public _fundIdCounter;
    IERC6551Registry public fundsRegister;
    address public erc6551Implementation;
    address public quotaTokenImplementation;
    IERC20 public stablecoin;
    mapping(address => bool) public whiteListedTokens;

    //VOTING FEATURES
    uint256 public proposalIdCounter;

    uint256 public percentageToWin = 5000; // in bps, 5000 = 50.00%

    mapping(uint256 => OpenRedeemProposal) public openRedeemProposals; // proposalId => OpenRedeemProposal
    mapping(uint256 => uint256) public proposalsVotes; // proposalId => proposalsVotes
    mapping(uint256 => mapping(address => uint256)) public redemmVotes; // proposalId => (voter => voted)

    mapping(uint256 => SwapProposal) public swapProposals; // proposalId => SwapProposal
    mapping(uint256 => mapping(address => uint256)) public swapVotes; // proposalId => (voter => voted)
    mapping(uint256 => uint256) public swapProposalsVotes; // proposalId => proposalsVotes

    event NewOpenRedeemProposal(uint256 indexed proposalId, uint256 indexed fundId, uint256 newTimestamp, string name);
    event Voted(uint256 indexed proposalId, address indexed voter, uint256 amount, string votingType);
    event VotingTokensWithdrawn(uint256 indexed proposalId, address indexed voter, uint256 amount);
    event OpenRedeemProposalAccepted(uint256 indexed proposalId, uint256 indexed fundId, uint256 newTimestamp, string name);
    event NewDelegatedSwapProposal(uint256 indexed proposalId, uint256 indexed fundId, uint256 amountIn, uint256 amountOutMin, string name);
    event DelegatedSwapProposalAccepted(uint256 indexed proposalId, uint256 indexed fundId, uint256 amountIn, uint256 amountOutMin, string name);

    // SWAP ROUTER
    IV2SwapRouter public swapRouter = IV2SwapRouter(0xcbC9ce7898517049175280288f3838593Adcc660);

    // MAPPINGS TO THE NFTS
    mapping(uint256 => address) public fundsAddresses;
    mapping(uint256 => string) public fundsNames;
    mapping(uint256 => uint256) public admFees;
    mapping(uint256 => uint256) public perfFees;
    mapping(uint256 => uint256) public initialAmounts; // think
    mapping(uint256 => uint256) public openInvestimentTimestamps;
    mapping(uint256 => uint256) public closeInvestimentTimestamps;
    mapping(uint256 => uint256) public openRedeemTimestamps;
    mapping(uint256 => address[]) public fundsAllowedTokens;
    mapping(uint256 => address) public quotasAddresses;

    //EVENTS
    event FundCreated(address indexed fundAddress, address indexed quotaTokenAddress);
    event InvestimentMade(address indexed fundAddress, address indexed investor, uint256 amount);
    event RedeemMade(address indexed fundAddress, address indexed investor, uint256 amount);
    event OpenRedeemTimestampChanged(address indexed fundId, uint256 newTimestamp);


    constructor(address _fundsRegister, address _erc6551Implementation, address _erc20Implementation, address _stablecoin) Ownable(_msgSender()) ERC721("WhaleFinance", "WFI")  {
        fundsRegister = IERC6551Registry(_fundsRegister);
        erc6551Implementation = _erc6551Implementation; //ERC 6551 Implementation
        stablecoin = IERC20(_stablecoin);
        quotaTokenImplementation = _erc20Implementation;
    }

    function createFund(string calldata _name, string calldata _symbol, address _to, address[] memory _allowedTokens, 
                    uint256 _admFee, uint256 _perfFee, uint256 _openInvestiment, uint256 _closeInvestiments, uint256 _openRedeem) 
                    public returns(uint256){
        
        uint256 fundId = _fundIdCounter;
        _fundIdCounter++;
        

        for(uint256 i = 0; i < _allowedTokens.length; i++) {
            if(!whiteListedTokens[_allowedTokens[i]]){
                revert("You tried to create a fund with a non whitelisted token");
            }

            fundsAllowedTokens[fundId].push(_allowedTokens[i]);
        }

        _mint(address(this), fundId); // minting to Whale Finance at first
        address createdFundAddress = fundsRegister.createAccount(
            address(erc6551Implementation),
            block.chainid,
            address(this),
            fundId,
            0,
            ""
        );

        SafeAccount(payable(createdFundAddress)).setWhaleFinance(address(this)); // setting whale Finance for delegated swaps 
        _transfer(address(this), _to, fundId); //transfering to real owner


        fundsAddresses[fundId] = createdFundAddress;
        fundsNames[fundId] = _name;
        admFees[fundId] = _admFee; // the fee is in bps, if admFee = 100, the fee is 1%
        perfFees[fundId] = _perfFee; // the fee is in bps, if admFee = 100, the fee is 1%
        openInvestimentTimestamps[fundId] = _openInvestiment;
        closeInvestimentTimestamps[fundId] = _closeInvestiments;
        openRedeemTimestamps[fundId] = _openRedeem;
        BeaconProxy newQuotaTokenAddress = new BeaconProxy(quotaTokenImplementation,
            abi.encodeWithSelector(QuotaToken(address(0)).initialize.selector,
            _symbol, address(this), _openInvestiment));

        quotasAddresses[fundId] = address(newQuotaTokenAddress);
        emit FundCreated(createdFundAddress, address(newQuotaTokenAddress));
        return fundId;
    }

    function invest(uint256 _amount, uint256 fundId) public {
        require(_amount > 0, "You need to invest more than 0");
        require(block.timestamp >= openInvestimentTimestamps[fundId], "Investiment is not open yet");
        require(block.timestamp <= closeInvestimentTimestamps[fundId], "Investiment is closed");

        address fundTargetAddress = fundsAddresses[fundId];
        require(fundTargetAddress != address(0), "Fund not found");

        uint256 managerAdmFee = _amount * admFees[fundId] / 10000;
        uint256 amountInvestor = _amount - managerAdmFee;

        stablecoin.transferFrom(msg.sender, fundTargetAddress, amountInvestor);
        stablecoin.transferFrom(msg.sender, ownerOf(fundId), managerAdmFee); // paying adm fee to manager

        initialAmounts[fundId] += amountInvestor;

        address fundQuotaAddress = quotasAddresses[fundId];
        QuotaToken(fundQuotaAddress).mint(msg.sender, amountInvestor);
        emit InvestimentMade(fundTargetAddress, msg.sender, _amount);
    }

    function redeemYield(uint256 fundId) public {
        require(block.timestamp >= openRedeemTimestamps[fundId], "Redeem is not open yet");
        address fundQuotaAddress = quotasAddresses[fundId];
        uint256 amountQuotas = QuotaToken(fundQuotaAddress).balanceOf(msg.sender);
        
        uint256 redeemableAmount = (amountQuotas/initialAmounts[fundId]) * stablecoin.balanceOf(fundsAddresses[fundId]);

        stablecoin.transferFrom(fundsAddresses[fundId], msg.sender, redeemableAmount);

        QuotaToken(fundQuotaAddress).burn(amountQuotas);

        emit RedeemMade(fundsAddresses[fundId], msg.sender, redeemableAmount);
    }

    function setWhiteListedToken(address _token) public onlyOwner {
        whiteListedTokens[_token] = true;
    }

    function removeWhiteListedToken(address _token) public onlyOwner {
        whiteListedTokens[_token] = false;
    }


    //VOTING OPEN REDEEM TIMESTAMP FUNCTIONS

    function changeOpenRedeemTimestamp(uint256 _proposalId) public {
        uint256 fundId = openRedeemProposals[_proposalId].fundId;
        uint256 newTimestamp = openRedeemProposals[_proposalId].newTimestamp;
        uint256 deadline = openRedeemProposals[_proposalId].deadline;
        require(newTimestamp > block.timestamp, "You need to set a timestamp in the future");
        require(newTimestamp > closeInvestimentTimestamps[fundId], "You need to set a timestamp after the close investiment timestamp");
        require(block.timestamp < deadline, "The voting period is over");
        require(fundId < _fundIdCounter, "Fund not found");

        uint256 totalVotingTokens = IERC20(quotasAddresses[fundId]).totalSupply();
        uint256 totalVotes = proposalsVotes[_proposalId];

        if(totalVotes > totalVotingTokens * percentageToWin / 10000) {
            openRedeemProposals[_proposalId].accepted = true;
        } else{
            revert("The proposal was not accepted yet");
        } 
        emit OpenRedeemProposalAccepted(_proposalId, fundId, newTimestamp, openRedeemProposals[_proposalId].name);
   
        openRedeemTimestamps[fundId] = newTimestamp;
        emit OpenRedeemTimestampChanged(fundsAddresses[fundId], newTimestamp);

    }

    function proposeNewOpenRedeemTimestamp(uint256 _fundId, uint256 _newTimestamp, uint256 _deadline, string memory _name) public returns(uint256) {
                
        openRedeemProposals[proposalIdCounter] = OpenRedeemProposal({
            fundId: _fundId,
            newTimestamp: _newTimestamp,
            deadline: _deadline,
            accepted: false,
            name: _name
        });
        proposalIdCounter++;

        emit NewOpenRedeemProposal(proposalIdCounter -1, _fundId, _newTimestamp, _name);
        return proposalIdCounter-1;
    }


    function voteForChangingOpenRedeem(uint256 _proposalId, uint256 _amount) public {
        require(_proposalId <= proposalIdCounter, "Proposal not found");
        require(block.timestamp < openRedeemProposals[_proposalId].deadline, "The voting period is over");
        require(!openRedeemProposals[_proposalId].accepted, "The proposal was already accepted");

        uint256 fundId = openRedeemProposals[_proposalId].fundId;
        require(fundId < _fundIdCounter, "Fund not found");

        require(IERC20(quotasAddresses[fundId]).allowance(msg.sender, address(this)) >= _amount, "Not enough allowance");

        IERC20(quotasAddresses[fundId]).transferFrom(msg.sender, address(this), _amount);

        redemmVotes[_proposalId][msg.sender] += _amount;
        proposalsVotes[_proposalId] += _amount;

        emit Voted(_proposalId, msg.sender, _amount, "openRedeem");
    }

    function getVoterRedeemBalance(uint256 _proposalId, address _voter) public view returns(uint256) {
        return redemmVotes[_proposalId][_voter];
    }

    function getTotalRedeemProposalVotes(uint256 _proposalId) public view returns(uint256) {
        return proposalsVotes[_proposalId];
    }

    function withdrawVotingTokensFromOpenRedeemProposal(uint256 _proposalId) public {
        require(block.timestamp > openRedeemProposals[_proposalId].deadline || openRedeemProposals[_proposalId].accepted, "The voting period is not over yet");
        
        uint256 fundId = openRedeemProposals[_proposalId].fundId;
        require(fundId < _fundIdCounter, "Fund not found");

        uint256 amount = redemmVotes[_proposalId][msg.sender];
        require(amount > 0, "You don't have any voting tokens");

        IERC20(quotasAddresses[fundId]).transfer(msg.sender, amount);
        redemmVotes[_proposalId][msg.sender] = 0;

        emit VotingTokensWithdrawn(_proposalId, msg.sender, amount);
        
    }

    //VOTING DELEGATED SWAPS FUNCTIONS

    function executeProposedSwap(uint256 _proposalId) public {
        uint256 fundId = swapProposals[_proposalId].fundId;
        uint256 amountIn = swapProposals[_proposalId].amountIn;
        uint256 amountOutMin = swapProposals[_proposalId].amountOutMin;
        address[] memory path = swapProposals[_proposalId].path;
        address to = swapProposals[_proposalId].to;
        require(block.timestamp < swapProposals[_proposalId].deadlineVote, "The voting period is over");
        require(!swapProposals[_proposalId].accepted, "The proposal was already accepted");
        require(fundId < _fundIdCounter, "Fund not found");

        uint256 totalVotingTokens = IERC20(quotasAddresses[fundId]).totalSupply();
        uint256 totalVotes = swapProposalsVotes[_proposalId];

        if(totalVotes > totalVotingTokens * percentageToWin / 10000) {
            swapProposals[_proposalId].accepted = true;
        } else{
            revert("The proposal was not accepted yet");
        } 
        emit DelegatedSwapProposalAccepted(_proposalId, fundId, amountIn, amountOutMin, swapProposals[_proposalId].name);

        SafeAccount(payable(fundsAddresses[fundId])).executeProposedSwap(amountIn, amountOutMin, path, to, swapProposals[_proposalId].deadlineSwap);

    }


    function proposeNewDelegatedSwap(uint256 _fundId, uint256 _amountIn, uint256 _amountOutMin, address[] memory _path, 
                    address _to, uint256 _deadlineSwap, uint256 _deadlineVote, string memory _name) public returns(uint256) {
                
        swapProposals[proposalIdCounter] = SwapProposal({
            fundId: _fundId,
            amountIn: _amountIn,
            amountOutMin: _amountOutMin,
            path: _path,
            to: _to,
            deadlineSwap: _deadlineSwap,
            deadlineVote: _deadlineVote,
            accepted: false,
            name: _name
        });
        proposalIdCounter++;

        emit NewDelegatedSwapProposal(proposalIdCounter -1, _fundId, _amountIn, _amountOutMin,  _name);
        return proposalIdCounter-1;
    }

    function voteForDelegatedSwap(uint256 _proposalId, uint256 _amount) public {
        require(_proposalId <= proposalIdCounter, "Proposal not found");
        require(block.timestamp < swapProposals[_proposalId].deadlineVote, "The voting period is over");
        require(!swapProposals[_proposalId].accepted, "The proposal was already accepted");

        uint256 fundId = swapProposals[_proposalId].fundId;
        require(fundId < _fundIdCounter, "Fund not found");

        require(IERC20(quotasAddresses[fundId]).allowance(msg.sender, address(this)) >= _amount, "Not enough allowance");

        IERC20(quotasAddresses[fundId]).transferFrom(msg.sender, address(this), _amount);

        swapVotes[_proposalId][msg.sender] += _amount;
        swapProposalsVotes[_proposalId] += _amount;

        emit Voted(_proposalId, msg.sender, _amount, "delegatedSwap");
    }

    function getVoterDelegatedSwapBalance(uint256 _proposalId, address _voter) public view returns(uint256) {
        return swapVotes[_proposalId][_voter];
    }

    function getTotalDelegatedSwapProposalVotes(uint256 _proposalId) public view returns(uint256) {
        return swapProposalsVotes[_proposalId];
    }

    function withdrawVotingTokensFromDelegatedSwapProposal(uint256 _proposalId) public {
        require(block.timestamp > swapProposals[_proposalId].deadlineVote || swapProposals[_proposalId].accepted, "The voting period is not over yet");
        
        uint256 fundId = swapProposals[_proposalId].fundId;
        require(fundId < _fundIdCounter, "Fund not found");

        uint256 amount = swapVotes[_proposalId][msg.sender];
        require(amount > 0, "You don't have any voting tokens");

        IERC20(quotasAddresses[fundId]).transfer(msg.sender, amount);
        swapVotes[_proposalId][msg.sender] = 0;

        emit VotingTokensWithdrawn(_proposalId, msg.sender, amount);    
    }
    
}