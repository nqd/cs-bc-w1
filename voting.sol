pragma solidity ^0.4.18;


contract Voting {
    address public owner;

    function Voting() public {
        owner = msg.sender;
    }

    function kill() public {
        if (msg.sender == owner) selfdestruct(owner);
    }
}