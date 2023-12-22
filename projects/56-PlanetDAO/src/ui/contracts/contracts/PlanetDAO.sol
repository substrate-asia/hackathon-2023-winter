// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import '@openzeppelin/contracts/utils/Strings.sol';
import '@openzeppelin/contracts/token/ERC20/ERC20.sol';

contract PlanetDAO {
    struct dao_uri_struct {
        string dao_wallet;
        string dao_uri;
        string finished;
    }
    struct goal_uri_struct {
        uint256 dao_id;
        string goal_uri;
    }

    struct ideas_uri_struct {
        uint256 goal_id;
        string ideas_uri;
        uint256 donation;
    }

    struct donation_struct {
        uint256 ideas_id;
        string wallet;
        uint256 donation;
    }

    struct smart_contract_uri_struct {
        uint256 smart_contract_id;
        uint256 ideas_id;
        string smart_contract_uri;
    }
    struct goal_ideas_votes_struct {
        uint256 goal_id;
        uint256 ideas_id;
        string wallet;
    }
    struct message_struct {
        uint256 message_id;
        uint256 ideas_id;
        string message;
        string sender;
    }
    struct message_read_struct {
        uint256 message_id;
        uint256 ideas_id;
        string wallet;
        string msg_type;
    }
    struct reply_struct {
        uint256 reply_id;
        uint256 message_id;
        uint256 ideas_id;
        string message;
    }

    struct UnbondingRequest {
        int64 completionTime;
        uint256 amount;
    }

    struct join_struct {
        uint256 daoid;
        string wallet;
    }

    struct user_badge_struct {
        string wallet;
        bool dao;
        bool joined;
        bool goal;
        bool ideas;
        bool vote;
        bool donation;
        bool comment;
        bool reply;
    }
    uint256 public _dao_ids;
    uint256 public _donations_ids;
    uint256 public _goal_ids;
    uint256 public _ideas_ids;
    uint256 public _join_ids;
    uint256 public _smart_contract_ids;
    uint256 public _ideas_vote_ids;
    uint256 public _message_ids;
    uint256 public _message_read_ids;
    uint256 public _reply_ids;
    mapping(uint256 => dao_uri_struct) public _dao_uris; //_dao_ids              => (Dao)                    Dao Wallet + Dao URI   + Finished
    mapping(uint256 => string) public _template_uris; //_dao_ids              => (Dao)                   Template HTML Code
    mapping(uint256 => join_struct) public _joined_person; //_join_ids             => (Dao)                  join_struct

    mapping(uint256 => goal_uri_struct) public _goal_uris; //_goal_ids             => (Goal)                   Dao ID + Goal URI
    mapping(uint256 => ideas_uri_struct) public _ideas_uris; //_ideas_ids            => (Ideas)                  Goal ID + Ideas URI
    mapping(string => uint256) public _donated; //string            => (Donated to ideas)                amount
    mapping(uint256 => donation_struct) public _donations; //uint256            => donation_struct
    mapping(uint256 => smart_contract_uri_struct) public _smart_contracts_uris; //_smart_contract_ids   => (Ideas Smart contract)   Goal ID + Ideas URI
    mapping(uint256 => goal_ideas_votes_struct) public all_goal_ideas_votes; //_ideas_vote_ids       => (Vote)                   Goal ID + Ideas ID + Wallet

    mapping(uint256 => message_struct) public all_messages; // all_messages        => _message_ids + message_struct

    mapping(uint256 => message_read_struct) public all_read_messages; // all_read_messages        => _message_read_ids + message_read_struct

    mapping(uint256 => reply_struct) public all_replies; // all_messages        => _reply_ids + reply_struct
    mapping(string => user_badge_struct) public _user_badges; //string            => user_badge_struct

    //Daos
    function create_dao(string memory _dao_wallet, string memory _dao_uri, string memory _template) public returns (uint256) {
        //Create Dao into _dao_uris
        _dao_uris[_dao_ids] = dao_uri_struct(_dao_wallet, _dao_uri, 'False');
        _template_uris[_dao_ids] = _template;
        _user_badges[_dao_wallet].dao = true;
        _dao_ids++;

        return _dao_ids;
    }

    function update_template(uint256 _dao_id, string memory _template) public {
        _template_uris[_dao_id] = _template;
    }

    function set_dao(uint256 _dao_id, string memory _dao_wallet, string memory _dao_uri) public {
        //Set Dao of wallet and uri
        _dao_uris[_dao_id].dao_wallet = _dao_wallet;
        _dao_uris[_dao_id].dao_uri = _dao_uri;
    }

    function get_all_daos() public view returns (string[] memory) {
        //Getting all doas
        string[] memory _StoreInfo = new string[](_dao_ids);
        for (uint256 i = 0; i < _dao_ids; i++) {
            _StoreInfo[i] = _dao_uris[i].dao_uri;
        }

        return _StoreInfo;
    }

    function dao_uri(uint256 _dao_id) public view returns (string memory) {
        //Getting one dao URI
        return _dao_uris[_dao_id].dao_uri;
    }

    //Goals
    function create_goal(string memory _goal_uri, uint256 _dao_id,string memory _wallet) public returns (uint256) {
        //Create goal into _goal_uris
        _goal_uris[_goal_ids] = goal_uri_struct(_dao_id, _goal_uri);
        _user_badges[_wallet].goal = true;
        _goal_ids++;

        return _goal_ids;
    }

    function set_goal(uint256 _goal_id, string memory _goal_uri) public {
        //Set goal uri
        _goal_uris[_goal_id].goal_uri = _goal_uri;
    }

    function get_all_goals() public view returns (string[] memory) {
        //Getting all goals
        string[] memory _StoreInfo = new string[](_goal_ids);
        for (uint256 i = 0; i < _goal_ids; i++) {
            _StoreInfo[i] = _goal_uris[i].goal_uri;
        }

        return _StoreInfo;
    }

    function get_all_goals_by_dao_id(uint256 _dao_id) public view returns (string[] memory) {
        //Getting all goals by dao id
        string[] memory _StoreInfo = new string[](_goal_ids);
        uint256 _store_id;
        for (uint256 i = 0; i < _goal_ids; i++) {
            if (_goal_uris[i].dao_id == _dao_id) {
                _StoreInfo[_store_id] = _goal_uris[i].goal_uri;
                _store_id++;
            }
        }

        return _StoreInfo;
    }

    function get_goal_id_by_goal_uri(string memory _goal_uri) public view returns (uint256) {
        //Getting goal id by uri
        for (uint256 i = 0; i < _goal_ids; i++) {
            if (keccak256(bytes(_goal_uris[i].goal_uri)) == keccak256(bytes(_goal_uri))) return i;
        }

        return 0;
    }

    function goal_uri(uint256 _goal_id) public view returns (string memory) {
        //Getting one goal URI
        return _goal_uris[_goal_id].goal_uri;
    }

    //Ideas
    function create_ideas(string memory _ideas_uri, uint256 _goal_id, string[] memory _smart_contracts,string memory _wallet) public returns (uint256) {
        //Create ideas into _ideas_uris
        _ideas_uris[_ideas_ids] = ideas_uri_struct(_goal_id, _ideas_uri, 0);
        _user_badges[_wallet].ideas = true;
        _ideas_ids++;

        for (uint256 i = 0; i < _smart_contracts.length; i++) {
            create_ideas_smart_contract(_ideas_ids, _smart_contract_ids, _smart_contracts[i]);
            _smart_contract_ids++;
        }

        return _ideas_ids;
    }

    function create_ideas_smart_contract(uint256 _ideas_id, uint256 _smart_contract_id, string memory _smart_contract) private {
        _smart_contracts_uris[_smart_contract_id] = smart_contract_uri_struct(_ideas_id, _smart_contract_id, _smart_contract);
    }

    function set_ideas(uint256 _ideas_id, string memory _ideas_uri) public {
        _ideas_uris[_ideas_id].ideas_uri = _ideas_uri;
    }

    function add_donation(uint256 _ideas_id, uint256 _doantion, string memory _donator) public {
        _user_badges[_donator].donation = true;
        _ideas_uris[_ideas_id].donation += _doantion;
        _donated[_donator] += _doantion;
        _donations[_donations_ids] = donation_struct(_ideas_id, _donator, _doantion);
        _donations_ids++;
    }

    function join_community(uint256 dao_id, string memory person) public {
        _user_badges[person].joined = true;
        _joined_person[_join_ids] = join_struct({daoid: dao_id, wallet: person});
        _join_ids++;
    }

    function is_person_joined(string memory wallet) public view returns (bool) {
        //Getting goal id by uri
        for (uint256 i = 0; i < _join_ids; i++) {
            if (keccak256(bytes(_joined_person[i].wallet)) == keccak256(bytes(wallet))) return true;
        }

        return false;
    }

    function get_all_ideas() public view returns (string[] memory) {
        //Getting all ideas
        string[] memory _StoreInfo = new string[](_ideas_ids);
        for (uint256 i = 0; i < _ideas_ids; i++) {
            _StoreInfo[i] = _ideas_uris[i].ideas_uri;
        }

        return _StoreInfo;
    }

    function get_all_ideas_by_goal_id(uint256 _goal_id) public view returns (string[] memory) {
        //Getting all ideas by goal id
        string[] memory _StoreInfo = new string[](_ideas_ids);
        uint256 _store_id;
        for (uint256 i = 0; i < _ideas_ids; i++) {
            if (_ideas_uris[i].goal_id == _goal_id) _StoreInfo[_store_id] = _ideas_uris[i].ideas_uri;
            _store_id++;
        }

        return _StoreInfo;
    }

    function get_ideas_id_by_ideas_uri(string memory _ideas_uri) public view returns (uint256) {
        //Getting ideas id by uri
        for (uint256 i = 0; i < _ideas_ids; i++) {
            if (keccak256(bytes(_ideas_uris[i].ideas_uri)) == keccak256(bytes(_ideas_uri))) return i;
        }

        return 0;
    }

    function get_goal_id_from_ideas_uri(string memory _ideas_uri) public view returns (uint256) {
        //Getting ideas id by uri
        for (uint256 i = 0; i < _ideas_ids; i++) {
            if (keccak256(bytes(_ideas_uris[i].ideas_uri)) == keccak256(bytes(_ideas_uri))) return _ideas_uris[i].goal_id;
        }

        return 0;
    }

    function ideas_uri(uint256 _ideas_id) public view returns (string memory) {
        //Getting one ideas URI
        return _ideas_uris[_ideas_id].ideas_uri;
    }

    //Votes
    function create_goal_ideas_vote(uint256 _goal_id, uint256 _ideas_id, string memory _wallet) public returns (uint256) {
         _user_badges[_wallet].vote = true;
        //Create votes into all_goal_ideas_votes
        all_goal_ideas_votes[_ideas_vote_ids] = goal_ideas_votes_struct(_goal_id, _ideas_id, _wallet);
        _ideas_vote_ids++;

        return _ideas_vote_ids;
    }

    function get_ideas_votes_from_goal(uint256 _goal_id, uint256 _ideas_id) public view returns (string[] memory) {
        //gets all ideas votes from goal
        string[] memory _StoreInfo = new string[](_ideas_vote_ids);
        uint256 _store_id;
        for (uint256 i = 0; i < _ideas_vote_ids; i++) {
            if (all_goal_ideas_votes[i].goal_id == _goal_id && all_goal_ideas_votes[i].ideas_id == _ideas_id) _StoreInfo[_store_id] = all_goal_ideas_votes[i].wallet;
            _store_id++;
        }
        return _StoreInfo;
    }

    //Messages
    function sendMsg(uint256 _ideas_id, string memory _message, string memory _sender) public returns (uint256) {
            _user_badges[_sender].comment = true;
        //Create messsage into all_messages
        all_messages[_message_ids] = message_struct(_message_ids, _ideas_id, _message, _sender);
        _message_ids++;

        return _message_ids;
    }

    function getMsgIDs(uint256 ideas_id) public view returns (uint256[] memory) {
        //Getting all messages ids by idea id
        uint256[] memory _All_Ideas_Messages = new uint256[](_message_ids);
        uint256 _msg_id;
        for (uint256 i = 0; i < _message_ids; i++) {
            if (all_messages[i].ideas_id == ideas_id) {
                _All_Ideas_Messages[_msg_id] = all_messages[i].message_id;
                _msg_id++;
            }
        }

        return _All_Ideas_Messages;
    }

    function sendReply(uint256 _message_id, string memory _reply,uint256 ideas_id,string memory _wallet) public returns (uint256) {
          _user_badges[_wallet].reply = true;
        //Create reply into all_replies
        all_replies[_reply_ids] = reply_struct(_reply_ids, _message_id,ideas_id, _reply);
        _reply_ids++;

        return _reply_ids;
    }

    function getReplyIDs(uint256 message_id) public view returns (uint256[] memory) {
        //Getting all messages ids by idea id
        uint256[] memory _All_Messages_Replys = new uint256[](_reply_ids);
        uint256 _reply_id;
        for (uint256 i = 0; i < _reply_ids; i++) {
            if (all_replies[i].message_id == message_id) {
                _All_Messages_Replys[_reply_id] = all_replies[i].reply_id;
                _reply_id++;
            }
        }

        return _All_Messages_Replys;
    }

    function sendReadMsg(uint256 _message_id, uint256 _ideas_id,string memory _wallet, string memory msg_type) public returns (uint256) {
        //Create messsage into all_messages
        all_read_messages[_message_read_ids] = message_read_struct(_message_id, _ideas_id, _wallet,msg_type);
        _message_read_ids++;

        return _message_read_ids;
    }



  function getReadMsg(uint256 _message_id, string memory msg_type)  public view returns (bool) {
       
       bool read = false;
        for (uint256 i = 0; i < _message_read_ids; i++) {
            if (all_read_messages[i].message_id == _message_id && keccak256(bytes(msg_type)) == keccak256(bytes(all_read_messages[i].msg_type))) {
               read = true; 
            }
        }

        return read;
    }



    function reset_all() public {
        for (uint256 i = 0; i < _dao_ids; i++) delete _dao_uris[i];
        for (uint256 i = 0; i < _goal_ids; i++) delete _goal_uris[i];
        for (uint256 i = 0; i < _ideas_ids; i++) delete _ideas_uris[i];
        for (uint256 i = 0; i < _goal_ids; i++) delete _smart_contracts_uris[i];
        for (uint256 i = 0; i < _message_ids; i++) delete all_messages[i];
        for (uint256 i = 0; i < _reply_ids; i++) delete all_replies[i];
        for (uint256 i = 0; i < _ideas_vote_ids; i++) delete all_goal_ideas_votes[i];
        _dao_ids = 0;
        _goal_ids = 0;
        _ideas_ids = 0;
        _message_ids = 0;
        _reply_ids = 0;
        _ideas_vote_ids = 0;
    }

    function addTempData() public {
        create_dao(
            '0x86bb6d6e18c5eeaca1e83c1e6162cc433dcc70a4',
            '{"title":"Asset Metadata","type":"object","properties":{"Title":{"type":"string","description":"Lake Nona, Orlando US"},"Description":{"type":"string","description":""},"Start_Date":{"type":"string","description":"2023-08-16T11:14"},"logo":{"type":"string","description":{"url":"https://bafybeicb5yy36ocs4yulph6zpx7ggsyeginsjwnft7ml7cxojywpbsjuq4.ipfs.nftstorage.link","type":"image/png"}},"wallet":{"type":"string","description":"0x86bb6d6e18c5eeaca1e83c1e6162cc433dcc70a4"},"SubsPrice":{"type":"number","description":"0.05"},"typeimg":{"type":"string","description":"Dao"},"allFiles":[{"url":"https://bafybeicb5yy36ocs4yulph6zpx7ggsyeginsjwnft7ml7cxojywpbsjuq4.ipfs.nftstorage.link","type":"image/png"}]}}',
            '<body><div id="dao-container"> <div class="flex flex-col gap-8"><img id="dao-image" src="https://bafybeicb5yy36ocs4yulph6zpx7ggsyeginsjwnft7ml7cxojywpbsjuq4.ipfs.nftstorage.link"/></div><div id="goal-container" class="flex flex-col gap-8">\n\n  </div></div></div></body><style>* { box-sizing: border-box; } body {margin: 0;}#dao-title{width:78%;}#iqokj{flex-direction:row-reverse;display:flex;}.py-2.px-4.gap-2.text-moon-14.rounded-moon-i-sm.relative.z-0.flex.justify-center.items-center.font-medium.no-underline.overflow-hidden.select-none.outline-none.transition.duration-200.active\\:scale-90.focus-visible\\:shadow-focus.btn-primary.create-goal-block.{position:relative;right:0px;}.py-2.px-4.gap-2.text-moon-14.rounded-moon-i-sm.z-0.flex.justify-center.items-center.font-medium.no-underline.overflow-hidden.select-none.outline-none.transition.duration-200.active\\:scale-90.focus-visible\\:shadow-focus.btn-primary.create-goal-block.{right:10px;position:absolute;}</style>'
        );
        create_goal('{"title":"Asset Metadata","type":"object","properties":{"Title":{"type":"string","description":"Renewable energy"},"Description":{"type":"string","description":"Our DAO is starting it\'s own renewable energy company that delivers energy for the whole community"},"Budget":{"type":"string","description":"$1,000,000"},"End_Date":{"type":"string","description":"2023-08-31T22:40"},"wallet":{"type":"string","description":"0x86bb6d6e18c5eeaca1e83c1e6162cc433dcc70a4"},"logo":{"type":"string","description":{"url":"https://bafybeic5g4xvj7myrgkb62lenld7orpl2hrspmzlzcdbzpyotc33tqygpe.ipfs.nftstorage.link","type":"image/jpeg"}},"allFiles":[{"url":"https://bafybeic5g4xvj7myrgkb62lenld7orpl2hrspmzlzcdbzpyotc33tqygpe.ipfs.nftstorage.link","type":"image/jpeg"}]}}', 0, '0x86bb6d6e18c5eeaca1e83c1e6162cc433dcc70a4');
        string[] memory row;
        create_ideas('{"title":"Asset Metadata","type":"object","properties":{"Title":{"type":"string","description":"Solar panels on the Consequences Nona community center "},"Description":{"type":"string","description":"We can ins\\n"},"StructureLeft":{"type":"string","description":["Representatives Berlin","Community","Children"]},"StructureRight":{"type":"string","description":["20%","70%","10%"]},"Qoutation":{"link":"https://uploadify.net/5273d350dfd001d1/quotation_Consequences_Nona_community_center.pdf","prize":"$48,071.55"},"wallet":{"type":"string","description":"0xD60bC0b00c1D8a718FB6fDeDc4466c7A1180868c"},"logo":{"type":"string","description":{"url":"https://bafybeif4fk6twikkcyopglhppdo7dd3l34bm6qedje3mxftec5e7b4he54.ipfs.nftstorage.link","type":"image/png"}},"allFiles":[{"url":"https://bafybeif4fk6twikkcyopglhppdo7dd3l34bm6qedje3mxftec5e7b4he54.ipfs.nftstorage.link","type":"image/png"}]}}', 0, row, '0x86bb6d6e18c5eeaca1e83c1e6162cc433dcc70a4');
    }
}
