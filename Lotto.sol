pragma solidity ^0.4.21;


contract Lotto {
    uint256 public minBet;
    uint256 public triggerCall;

    uint constant MAXBET4APLAYER = 4; 

    address public owner;
    uint256 public totalBet;
    uint256 public totalCall;

    address[] private players;
    address[] private winnerPlayers;

    struct Bet {
        uint256 bet; // the money user want to bet
        uint select; // the value use choose
    }

    // a mapping from player to player's bet
    mapping(address => Bet[]) public playerInfo;

    function Lotto(uint256 min, uint256 call) public {
        owner = msg.sender;
        minBet = min;
        triggerCall = call;
    }

    function pickNumber(uint number) public payable {
        require(number >= 1 && number <= 10);
        require(msg.value >= minBet);

        // one player can not bet more than a certain times
        require(playerInfo[msg.sender].length + 1 <= MAXBET4APLAYER);

        Bet b = Bet({bet: msg.value, select: number});
        playerInfo[msg.sender].push(b);

        // keep tract of player
        savePlayer(msg.sender);

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

    function savePlayer(address a) private {
        for (uint256 i = 0; i < players.length; i++) {
            if (players[i] == a) {
                return;
            }
        }
        players.push(a);
    }
}