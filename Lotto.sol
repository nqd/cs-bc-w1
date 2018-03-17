pragma solidity ^0.4.21;


contract Lotto {
    uint256 public minBet;
    uint256 public triggerCall;
    address public owner;
    uint256 public totalBet;
    uint256 public totalCall;
    address[] private players;

    struct Bet {
        uint256 bet; // the money user want to bet
        uint select; // the value use choose
        uint count; // the number of bet
    }

    // a mapping from player to player's bet
    mapping(address => Bet) public playerInfo;

    function Lotto(uint256 min, uint256 call) public {
        owner = msg.sender;
        minBet = min;
        triggerCall = call;
    }

    function pickNumber(uint number) public payable {
        require(number >= 1 && number <= 10);
        require(msg.value >= minBet);

        playerInfo[msg.sender].bet = msg.value;
        playerInfo[msg.sender].select = number;
        playerInfo[msg.sender].count++;

        // keep tract of player
        players.push(msg.sender);

        totalBet += msg.value;
        totalCall++;

        if (totalCall >= triggerCall) {
            generateNumberWinner();
        }
    }

    function generateNumberWinner() public {
        uint chosenNumber = random();
        distributePrizes(chosenNumber);
    }

    function distributePrizes(uint chosenNumber) public {
        address[] winnerPlayers;
        // calculate the number of winners
        for (uint256 i = 0; i < players.length; i++) {
            address player = players[i];
            // find the winner
            if (playerInfo[player].select == chosenNumber) {
                winnerPlayers.push(player);
            }
        }

        // if no winner, exit
        if (winnerPlayers.length == 0) {
            return;
        }

        uint256 winnerEtherAmount = totalBet / winnerPlayers.length;
        for (uint256 j = 0; j < winnerPlayers.length; j++) {
            winnerPlayers[j].transfer(winnerEtherAmount);
        }

        // distribute the prize
        // then initialize the contract
    }

    function kill() public {
        if (msg.sender == owner) selfdestruct(owner);
    }

    function random() private returns (uint) {
        return uint8(uint256(keccak256(block.timestamp, block.difficulty))%10);
    }
}