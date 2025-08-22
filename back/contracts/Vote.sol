// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Vote {
    string public title;
    string[] public candidates;            // index = candidateId
    mapping(uint => uint) public votes;    // candidateId => count
    mapping(address => bool) public hasVoted;

    event Voted(address indexed voter, uint indexed candidateId);

    constructor(string memory _title, string[] memory _candidates) {
        require(_candidates.length >= 2, "At least two candidates");
        title = _title;
        for (uint i = 0; i < _candidates.length; i++) {
            candidates.push(_candidates[i]);
        }
    }

    function candidatesCount() external view returns (uint) {
        return candidates.length;
    }

    function vote(uint candidateId) external {
        require(candidateId < candidates.length, "Invalid candidate");
        require(!hasVoted[msg.sender], "Already voted");
        hasVoted[msg.sender] = true;
        votes[candidateId] += 1;
        emit Voted(msg.sender, candidateId);
    }

    function getResults() external view returns (string[] memory names, uint[] memory counts) {
        uint len = candidates.length;
        names = new string[](len);
        counts = new uint[](len);
        for (uint i = 0; i < len; i++) {
            names[i] = candidates[i];
            counts[i] = votes[i];
        }
    }
}
