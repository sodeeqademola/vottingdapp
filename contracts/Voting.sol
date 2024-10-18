// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

// import " hardhat/console.sol";

// import "@openzeppelin/contracts/utils/Counters.sol";

contract Voting {
// using Counters for Counters.Counter;
// Counters.Counter public _voterId;
// Counters.Counter public _candidateId;

uint256 public _voterId;
uint256 public _candidateId;

address public voteOrganizer;

// Candidates to be voted for
struct Candidate {
    uint256 candidateId;
    string age;
    string name;
    string image;
    uint256 voteCount;
    address _address;
    string ipfs;
}

event CandidateCreate(
    uint256 indexed candidateId,
    string age,
    string indexed name,
    string image,
    uint256 indexed voteCount,
    address _address,
    string ipfs
);

address [] public candidatesAddress;

mapping (address => Candidate) public Candidates;

  //end of candidates

  //voter to vote

address [] public votersAddress;
address [] public votedVoters;

struct Voter {
    uint256 voteId;
    string name;
    string image;
    address _address;
    uint256 allowed;
    bool voted;
    string ipfs;
    uint256 vote;
  } 

  event voterCreated(
    uint256 indexed voterId,
    string indexed name,
    string image,
    address _address,
    uint256 allowed,
    bool indexed voted,
    uint256 vote,
    string ipfs
  );

  mapping (address => Voter) Voters;
  //end of voters 

  constructor(){
    voteOrganizer = msg.sender;
  }
function setCandidate(address _address, string memory _age, string memory _image, string memory _name, string memory _ipfs ) public {
    _candidateId ++;
    uint256 id = _candidateId;
    require(voteOrganizer == msg.sender, "sorry you are not the organizer");
    Candidate storage candidate = Candidates[_address];
    candidate.candidateId = id;
    candidate.age = _age;
    candidate.name = _name;
    candidate.image = _image;
    candidate.ipfs = _ipfs;
    candidate._address = _address;
    candidate.voteCount = 0;

    candidatesAddress.push(_address);
    // Candidate[_address] = candidate;

    emit CandidateCreate(
        id,
        _age,
        _name,
        _image,
        candidate.voteCount,
        _address,
        _ipfs
    );

}

function getCandidatesAddress() public view returns (address [] memory) {
    return candidatesAddress;
}

function getCandidateLength() public view returns (uint256) {
    return candidatesAddress.length;
}

function getCandidateData(address _address) public view returns (uint256, string memory, string memory, string memory, uint256, address, string memory) {
    return(
        Candidates[_address].candidateId,
        Candidates[_address].age,
        Candidates[_address].name,
        Candidates[_address].image,
        Candidates[_address].voteCount,
        Candidates[_address]._address,
        Candidates[_address].ipfs
    );
}

function createVoters(address _address, string memory _name, string memory _image, string memory _ipfs ) public {
    require(voteOrganizer == msg.sender , "sorry you are not the organizer");
    _voterId++;
    uint256 id = _voterId;

    Voter storage voter = Voters[_address];

    require(voter.allowed == 0, "you are not allowed to vote");
    voter.voteId = id;
    voter.name = _name;
    voter.image = _image;
    voter._address = _address;
    voter.allowed = 1;
    voter.ipfs = _ipfs;
    voter.voted = false;
    voter.vote = 1000;

    votersAddress.push(_address);

    emit voterCreated(
    id,
    _name,
    _image,
    _address,
    voter.allowed,
    voter.voted,
    voter.vote,
    _ipfs
  );
}

function vote(address _candidateAddress, uint256 _candidateVoteId) external {
  require(Voters[msg.sender].allowed ==    1, "You are not allowed to vote");
  require(Voters[msg.sender].voted == false, "You have already voted");
  Voter storage voter = Voters[msg.sender];

  
  voter.voted = true;
  voter.vote = _candidateVoteId;

  votedVoters.push(msg.sender);
  Candidates[_candidateAddress].voteCount += voter.allowed;

}

function getVotersLength() public view returns (uint256) {
  return votersAddress.length;
}

function getVoterData(address _address) public view returns (uint256, string memory, string memory,address, uint256, bool, string memory) {

  return(
    Voters[_address].voteId,
    Voters[_address].name,
    Voters[_address].image,
    Voters[_address]._address,
    Voters[_address].allowed,
    Voters[_address].voted,
    Voters[_address].ipfs
  );
}

function getVotedVotersList() public view  returns (address[] memory) {
  return votedVoters;
}

function getVotersList() public view  returns (address[] memory) {
  return votersAddress;
}

}