const { assert } = require('chai')

const Versus = artifacts.require('./Versus.sol')

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('Versus', (accounts) => {
  let versusDeployed

  before(async () => {
    versusDeployed = await Versus.deployed()
  })

  describe('deployment', async () => {
    it('deploys successfully', async () => {
      const address = versusDeployed.address
      //todo add owner code and check
      //const ownerAddress = versusDeployed.ownerOf()
      assert.notEqual(address, 0x0)
      assert.notEqual(address, '')
      assert.notEqual(address, null)
      assert.notEqual(address, undefined)
      //assert.equal(ownerAddress, versusDeployed.owner() )
    })
  })

  describe('deposit eth player1', async () => {
    let depositAmount = 0.1
    let depositAmountInWei = web3.utils.toWei(depositAmount.toString(), 'ether')
    let initialPlayerBalance
    let account = accounts[1] //change account here

    it('funds received', async () => {
      let initialContractBalance = await versusDeployed.getContractBalance.call()
      initialPlayerBalance = await versusDeployed.getPlayerBalance.call(account)
      await versusDeployed.sendTransaction({value: depositAmountInWei, from: account})

      let contractBalance = await versusDeployed.getContractBalance.call()
      assert.equal(Number(contractBalance), Number(initialContractBalance)+Number(depositAmountInWei))
    })

    it('player balance updated', async () => {
      let playerBalance = await versusDeployed.getPlayerBalance.call(account)
      assert.equal(Number(playerBalance), Number(initialPlayerBalance)+Number(depositAmountInWei))
    })
  })

  describe('deposit eth player2', async () => {
    let depositAmount = 0.1
    let depositAmountInWei = web3.utils.toWei(depositAmount.toString(), 'ether')
    let initialPlayerBalance
    let account = accounts[2] //change account here

    it('funds received', async () => {
      let initialContractBalance = await versusDeployed.getContractBalance.call()
      initialPlayerBalance = await versusDeployed.getPlayerBalance.call(account)
      await versusDeployed.sendTransaction({value: depositAmountInWei, from: account})

      let contractBalance = await versusDeployed.getContractBalance.call()
      assert.equal(Number(contractBalance), Number(initialContractBalance)+Number(depositAmountInWei))
    })

    it('player balance updated', async () => {
      let playerBalance = await versusDeployed.getPlayerBalance.call(account)
      assert.equal(Number(playerBalance), Number(initialPlayerBalance)+Number(depositAmountInWei))
    })
  })

  describe('Start Game', async () => {
    let wager = 0.05
    let wagerInWei = web3.utils.toWei(wager.toString(), 'ether')
    let gameId = 1

    it('pending game created', async () => {
      let player1InitialBalance = await versusDeployed.getPlayerBalance.call(accounts[1])

      const idOut = await versusDeployed.newGame(wagerInWei, {from: accounts[1]})

      /*versusDeployed.newGame(wagerInWei, {from: accounts[1]}).on('transactionHash', (hash) => {
        versusDeployed.contract.events.NewGame({}, async (error, event) => {
          const eventGameId = event
          console.log(eventGameId)
        });
      });

      versusDeployed.newGame(wagerInWei, {from: accounts[1]}, (err,txHash) => {
        versusDeployed.NewGame().get((err,logs) => {
          console.log(logs[0].args.gameId.toString())
        });
      });*/


      //TODO: get id from event
      //TODO: figure out how to listen to events
      //console.log(idOut.args)

      let {id, amount, player1, isValid} = await versusDeployed.pendingGames.call(gameId)
      let player1Balance = await versusDeployed.getPlayerBalance.call(accounts[1])

      /*console.log(gameId)
      console.log(id)
      console.log(wagerInWei)
      console.log(Number(amount))
      console.log(accounts[1])
      console.log(player1)*/
      
      assert.equal(Number(player1Balance), player1InitialBalance-wagerInWei, 'player1 balance deducted')
      assert.equal(id, gameId)
      assert.equal(amount, wagerInWei)
      assert.equal(player1, accounts[1])
      assert.equal(isValid, true)
    })

    /*it('player 3 joins game', async () => {
      assert(await versusDeployed.joinGame(gameId, {from: accounts[3]}))
    })*/

    it('player 2 joins game', async () => {
      let player2InitialBalance = await versusDeployed.getPlayerBalance.call(accounts[2])

      await versusDeployed.joinGame(gameId, {from: accounts[2]})
      
      //test getters for game and player info for in progress game
      const {0: player11, 1: link11, 2: player21, 3:link21} = await versusDeployed.getinProgressGamePlayerFields.call(accounts[2])
      const {0: amount1, 1: isValid1} = await versusDeployed.getinProgressGameGameFields.call(accounts[2])

      //test getter for all fields
      const {0: amount2,1:player12,2:link12,3:player22,4:link22,5:isValid2} = await versusDeployed.getinProgressGameFields.call(accounts[1])

      let player2Balance = await versusDeployed.getPlayerBalance.call(accounts[2])
      const {0: pendingId, 1:pendingAmount, 2:pendingPlayer1, 3:pendingIsValid} = await versusDeployed.pendingGames.call(gameId)
      // console.log(wagerInWei)
      // console.log(Number(amount1))
      // console.log(accounts[1])
      // console.log(player11)
      // console.log('link_to_server_1')
      // console.log(link11)
      // console.log(accounts[2])
      // console.log(player21)
      // console.log('link_to_server_2')
      // console.log(link21)
      // console.log(isValid1)

      // console.log(wagerInWei)
      // console.log(Number(amount2))
      // console.log(accounts[1])
      // console.log(player12)
      // console.log('link_to_server_1')
      // console.log(link12)
      // console.log(accounts[2])
      // console.log(player22)
      // console.log('link_to_server_2')
      // console.log(link22)
      // console.log(isValid2)

      // console.log(Number(player2Balance))
      // console.log(Number(player2InitialBalance)-Number(wagerInWei))
      
      assert.equal(Number(player2Balance), Number(player2InitialBalance)-Number(wagerInWei), 'player2 balance deducted')
      
      assert.equal(Number(amount1), wagerInWei)
      assert.equal(player11, accounts[1])
      assert.equal(link11, 'link_to_server_1')
      assert.equal(player21, accounts[2])
      assert.equal(link21, 'link_to_server_2')
      assert.equal(isValid1, true)

      assert.equal(Number(amount2), wagerInWei)
      assert.equal(player12, accounts[1])
      assert.equal(link12, 'link_to_server_1')
      assert.equal(player22, accounts[2])
      assert.equal(link22, 'link_to_server_2')
      assert.equal(isValid2, true)

      assert.equal(pendingIsValid, false, "Pending game is now not valid")
    })
  })

  describe('End Game', async () => {
    
    // it('Game ended by wrong account', async () => {
    //   assert.Throw(await versusDeployed.endGame({from: accounts[5]}), "Error, Can only call end game if you are a player in the game")
    // })
    let player = accounts[1]
    let player1
    let player2
    let player1InitialBalance
    let player2InitialBalance
    let player1Wins = true;

    if(player1Wins){
      it('Player1 Wins', async () => {
        //get player1 address
        const {0: amount ,1:player1,2:link1,3:player2,4:link2,5:isValid} = await versusDeployed.getinProgressGameFields.call(accounts[1])
        
        player1InitialBalance = await versusDeployed.getPlayerBalance.call(player1)
        player2InitialBalance = await versusDeployed.getPlayerBalance.call(player2)
        
        await versusDeployed.endGame(player1, {from: accounts[1]})

        let player1Balance = await versusDeployed.getPlayerBalance.call(player1)
        let player2Balance = await versusDeployed.getPlayerBalance.call(player2)

        const {0: amount1, 1: isValid1} = await versusDeployed.getinProgressGameGameFields.call(accounts[2])


        assert.equal(Number(player1InitialBalance)+2*Number(amount), Number(player1Balance))
        assert.equal(Number(player2InitialBalance), Number(player2Balance))
        assert.equal(isValid1, false)
      })
    }else{
      it('Player2 Wins', async () => {

      })
    }

  })


  describe('withdraw eth player 1', async () => {
    let withdrawnAmount = 0.05
    //let amountInWei = web3.utils.toWei(withdrawnAmount.toString(), 'ether')
    //use above line if you DO NOT want to completely empty the account
    let amountInWei 
    let contractInitialBalance
    let contractBalance

    let playerInitialBalance
    let playerBalance

    let account = accounts[1]

    it('funds taken from contract balance', async () => {
      //empty entire account balance
      amountInWei = await versusDeployed.getPlayerBalance.call(account)
      contractInitialBalance = await versusDeployed.getContractBalance.call()
      playerInitialBalance = await versusDeployed.getPlayerBalance.call(account)
      await versusDeployed.withdrawEther(amountInWei, {from: account})
      
      contractBalance = await versusDeployed.getContractBalance.call()
      
      //console.log("Initial Contract balance: " + contractInitialBalance.toString())
      //console.log("Withdrawn amount: " + amountInWei.toString())
      //console.log("Resultant contract balance: " + contractBalance.toString())

      assert.equal(contractBalance,contractInitialBalance-amountInWei, 'funds pulled out of contract')
    })

    it('player balance updated', async () => {
      playerBalance = await versusDeployed.getPlayerBalance.call(account)
      //console.log("Initial player balance: " + playerInitialBalance.toString())
      //console.log("Withdrawn amount player balance: " + amountInWei.toString())
      //console.log("Resultant player balance: " + playerBalance.toString())
      assert.equal(playerBalance,playerInitialBalance-amountInWei, 'player balance updated')
    })
  })

})
