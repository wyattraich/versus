// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts v4.4.1 (access/Ownable.sol)

pragma solidity ^0.5.16;

library SafeMath {
    /**
     * @dev Returns the addition of two unsigned integers, reverting on
     * overflow.
     *
     * Counterpart to Solidity's `+` operator.
     *
     * Requirements:
     *
     * - Addition cannot overflow.
     */
    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        require(c >= a, "SafeMath: addition overflow");

        return c;
    }

    /**
     * @dev Returns the subtraction of two unsigned integers, reverting on
     * overflow (when the result is negative).
     *
     * Counterpart to Solidity's `-` operator.
     *
     * Requirements:
     *
     * - Subtraction cannot overflow.
     */
    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        return sub(a, b, "SafeMath: subtraction overflow");
    }

    /**
     * @dev Returns the subtraction of two unsigned integers, reverting with custom message on
     * overflow (when the result is negative).
     *
     * Counterpart to Solidity's `-` operator.
     *
     * Requirements:
     *
     * - Subtraction cannot overflow.
     */
    function sub(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
        require(b <= a, errorMessage);
        uint256 c = a - b;

        return c;
    }

    /**
     * @dev Returns the multiplication of two unsigned integers, reverting on
     * overflow.
     *
     * Counterpart to Solidity's `*` operator.
     *
     * Requirements:
     *
     * - Multiplication cannot overflow.
     */
    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        // Gas optimization: this is cheaper than requiring 'a' not being zero, but the
        // benefit is lost if 'b' is also tested.
        // See: https://github.com/OpenZeppelin/openzeppelin-contracts/pull/522
        if (a == 0) {
            return 0;
        }

        uint256 c = a * b;
        require(c / a == b, "SafeMath: multiplication overflow");

        return c;
    }

    /**
     * @dev Returns the integer division of two unsigned integers. Reverts on
     * division by zero. The result is rounded towards zero.
     *
     * Counterpart to Solidity's `/` operator. Note: this function uses a
     * `revert` opcode (which leaves remaining gas untouched) while Solidity
     * uses an invalid opcode to revert (consuming all remaining gas).
     *
     * Requirements:
     *
     * - The divisor cannot be zero.
     */
    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        return div(a, b, "SafeMath: division by zero");
    }

    /**
     * @dev Returns the integer division of two unsigned integers. Reverts with custom message on
     * division by zero. The result is rounded towards zero.
     *
     * Counterpart to Solidity's `/` operator. Note: this function uses a
     * `revert` opcode (which leaves remaining gas untouched) while Solidity
     * uses an invalid opcode to revert (consuming all remaining gas).
     *
     * Requirements:
     *
     * - The divisor cannot be zero.
     */
    function div(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
        require(b > 0, errorMessage);
        uint256 c = a / b;
        // assert(a == b * c + a % b); // There is no case in which this doesn't hold

        return c;
    }

    /**
     * @dev Returns the remainder of dividing two unsigned integers. (unsigned integer modulo),
     * Reverts when dividing by zero.
     *
     * Counterpart to Solidity's `%` operator. This function uses a `revert`
     * opcode (which leaves remaining gas untouched) while Solidity uses an
     * invalid opcode to revert (consuming all remaining gas).
     *
     * Requirements:
     *
     * - The divisor cannot be zero.
     */
    function mod(uint256 a, uint256 b) internal pure returns (uint256) {
        return mod(a, b, "SafeMath: modulo by zero");
    }

    /**
     * @dev Returns the remainder of dividing two unsigned integers. (unsigned integer modulo),
     * Reverts with custom message when dividing by zero.
     *
     * Counterpart to Solidity's `%` operator. This function uses a `revert`
     * opcode (which leaves remaining gas untouched) while Solidity uses an
     * invalid opcode to revert (consuming all remaining gas).
     *
     * Requirements:
     *
     * - The divisor cannot be zero.
     */
    function mod(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
        require(b != 0, errorMessage);
        return a % b;
    }
}

//import "https://raw.githubusercontent.com/smartcontractkit/chainlink/master/evm-contracts/src/v0.6/VRFConsumerBase.sol";
//import "https://github.com/smartcontractkit/chainlink/blob/master/evm-contracts/src/v0.6/interfaces/AggregatorV3Interface.sol"; /* !UPDATE, import aggregator contract */

contract Versus {
  using SafeMath for uint256;

  //pendingGame public myPendingGame;

  uint256 private _maxFee = 10;
  uint256 private _fee = 3;
  uint256 private _pendingGameId;
  uint256 private inProgressGameId;

  mapping(uint256 => pendingGame) public pendingGames;
  mapping(uint256 => inProgressGame) private inProgressGames;
  mapping(address => uint256) private playerBalances;

  string link1;
  string link2;

  struct pendingGame{
    uint256 id;
    uint256 amount;
    address payable player1;
  }
  
  struct inProgressGame{
    uint256 id;
    uint256 amount;
    address payable player1;
    string link1;
    address payable player2;
    string link2;
  }
  
  event Withdraw(address admin, uint256 amount);
  event Result(uint256 id, address player1, address player2, address winner, uint256 winAmount, uint256 time);
  event Received(address, uint);

  /* Allows this contract to receive payments */
  function() external payable {
    playerBalances[msg.sender]+=msg.value;
    emit Received(msg.sender, msg.value);
  }

  //All of the getters
  function getContractBalance() public view returns (uint256) {
      return address(this).balance;
  }

  function getPlayerBalance(address player) public view returns (uint256) {
    return playerBalances[player];
  }

  function getPendingGameId() public view returns (uint256) {
    return _pendingGameId;
  }

  function getInProgressGameId() public view returns (uint256) {
    return inProgressGameId;
  }

  function getPendingGameFields(uint256 pendingGameId) public view returns (uint256 id, uint256 amount, address payable player1){
    return (pendingGames[pendingGameId].id, pendingGames[pendingGameId].amount, pendingGames[pendingGameId].player1);
  }

  /*
  function getPendingGameid(uint256 pendingGameId) public view returns (uint256) {
    return pendingGames[pendingGameId].id;
  }

  function getPendingGameAmount(uint256 pendingGameId) public view returns (uint256) {
    return pendingGames[pendingGameId].amount;
  }

  function getPendingGamePlayer1(uint256 pendingGameId) public view returns (address payable) {
    return pendingGames[pendingGameId].player1;
  }

  function getMyPendingGameid() public view returns (uint256) {
    return myPendingGame.id;
  }*/

  /*function setFeePercent(uint256 fee) external onlyOwner() {
    require(fee <= _maxFee, "Invalid fee, too high"); //fix 02 WORKS
    _fee = fee;
  }*/
  
  /**
   * Taking bets function.
   * By winning, user 2x his betAmount.
   * Chances to win and lose are the same.
   */
  function newGame(address payable player1, uint256 wager) public payable returns (uint256) {
    //vault balance must be at least equal to wager
    require(playerBalances[player1]>=wager, 'Error, insufficent account balance');
    _pendingGameId+=1;
    uint256 pendingGameId = _pendingGameId;
    
    playerBalances[player1]-=wager;
    pendingGames[pendingGameId] = pendingGame(pendingGameId, wager, player1);

    //myPendingGame = pendingGame(1, wager, player1);
    return pendingGameId;
  }

  function joinGame(uint256 pendingGameId, address payable player2) public payable returns (uint256) {
    require(playerBalances[player2]>=inProgressGames[pendingGameId].amount, 'Error, insufficent account balance to join game.');
    playerBalances[player2]-=inProgressGames[pendingGameId].amount;
    inProgressGameId+=1;
    //call to oracle to get link to lobby and send inProgressGameId for it to keep track of
    link1 = 'link_to_server_1';
    link2 = 'link_to_server_2';

    inProgressGames[inProgressGameId] = inProgressGame(inProgressGameId, inProgressGames[pendingGameId].amount, inProgressGames[pendingGameId].player1, link1, player2, link2);
    
    return inProgressGameId;
  }
  
  /**
   * Send rewards to the winners.
   * I am thinking we have a constant java api call that just indicates weather a game is complete or not and the id. This could have winner info in there as well, but
   * then we also still call the same api in the oracle so it is blockchain verifiable and we verify that the game is complete through oracle.
   * if someone tampered with java code, it would just create additional gas fees for the users, no one would profit
   */
  function verdict(uint256 finishedGameID) public payable {
    //call to oracle to verify game is finished and get winner address
    bool gameFinished = true;
    require(gameFinished,'Oracle reports game is not finished.');
    address winner = inProgressGames[finishedGameID].player1; //player 1 always winner for now
    address loser = inProgressGames[finishedGameID].player2;

    //TODO add in taking tax for versus and game dev
    playerBalances[loser]-=inProgressGames[finishedGameID].amount.mul(2);
    playerBalances[winner]+=inProgressGames[finishedGameID].amount.mul(2);

    emit Result(finishedGameID, inProgressGames[finishedGameID].player1, inProgressGames[finishedGameID].player2, winner, inProgressGames[finishedGameID].amount.mul(2), block.timestamp);
  }
  
  /**
   * Withdraw Ether from this contract (admin option).
   */
  function withdrawEther(address payable player, uint256 amount) external payable {
    require(playerBalances[player]>=amount, 'Error, insufficent balance');
    //TODO update truffle and compiler so we can use call
    //(bool success,) = player.call{value: amount}("");
    //require(success, "Failed to withdraw currency");
    player.transfer(amount);
    playerBalances[player]-=amount; //update player balance
    emit Withdraw(player, amount);
  }

}