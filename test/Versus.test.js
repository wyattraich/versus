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
    let result
    let depositAmount = 0.1
    let depositAmountInWei = web3.utils.toWei(depositAmount.toString(), 'ether')

    it('funds received', async () => {
      await versusDeployed.sendTransaction({value: depositAmountInWei, from: accounts[1]})
      const versusDeployedAddress = await versusDeployed.address
      result = await versusDeployed.getContractBalance()
      assert.equal(result, depositAmountInWei)
    })

    it('player balance updated', async () => {
      result = await versusDeployed.getPlayerBalance(accounts[1])
      assert.equal(result, depositAmountInWei)
    })
  })

  describe('player 1 new game', async () => {
    let wager = 0.05
    let wagerInWei = web3.utils.toWei(wager.toString(), 'ether')
    let gameId
    //let id
    //let amount
    //let player1

    it('pending game created', async () => {
      gameId = await versusDeployed.newGame.call(accounts[1], wagerInWei)

      let {id,amount,player1} = await versusDeployed.getPendingGameFields(Number(gameId))

      //id = versusDeployed.myPendingGame.id
      //id = await versusDeployed.getMyPendingGameid()
      //id = await versusDeployed.getPendingGameid(Number(gameId))
      //amount = await versusDeployed.getPendingGameAmount(Number(gameId))
      //player1 = await versusDeployed.getPendingGamePlayer1(Number(gameId))
      
      console.log(gameId)
      console.log(id)
      console.log(wagerInWei)
      console.log(amount)
      console.log(accounts[1])
      console.log(player1)
      
      assert.equal(id, gameId)
      assert.equal(amount, wagerInWei)
      assert.equal(player1, accounts[1])
    })
  })

  /*describe('withdraw eth player 1', async () => {
    let withdrawnAmount = 0.05
    //= web3.utils.toWei(withdrawnAmount.toString(), 'ether')
    //use above line if you dont want to empty the account[1] after
    let amountInWei 
    let contractInitialBalance
    let contractBalance

    let playerInitialBalance
    let playerBalance

    //possibly test for funds added but also have to acct for gas so idk
    //let playerWalletInitialBalance
    //let playerWalletBalance

    it('funds taken from contract balance', async () => {
      amountInWei = await versusDeployed.getPlayerBalance(accounts[1])
      contractInitialBalance = await versusDeployed.getContractBalance()
      playerInitialBalance = await versusDeployed.getPlayerBalance(accounts[1])
      await versusDeployed.withdrawEther(accounts[1],amountInWei)
      
      contractBalance = await versusDeployed.getContractBalance()
      
      console.log("Initial Contract balance: " + contractInitialBalance.toString())
      console.log("Withdrawn amount: " + amountInWei.toString())
      console.log("Resultant contract balance: " + contractBalance.toString())

      assert.equal(contractBalance,contractInitialBalance-amountInWei, 'funds pulled out of contract')
    })

    it('player balance updated', async () => {
      playerBalance = await versusDeployed.getPlayerBalance(accounts[1])
      console.log("Initial player balance: " + playerInitialBalance.toString())
      console.log("Withdrawn amount player balance: " + amountInWei.toString())
      console.log("Resultant player balance: " + playerBalance.toString())
      assert.equal(playerBalance,playerInitialBalance-amountInWei, 'player balance updated')
    })
  })*/

    /*it('depotsits eth', async () => {
      await versusDeployed.mint(accounts[0], 'https://www.token-uri.com/nft')

      // It should increase the total supply
      result = await token.totalSupply()
      assert.equal(result.toString(), '1', 'total supply is correct')

      // It increments owner balance
      result = await token.balanceOf(accounts[0])
      assert.equal(result.toString(), '1', 'balanceOf is correct')

      // Token should belong to owner
      result = await token.ownerOf('1')
      assert.equal(result.toString(), accounts[0].toString(), 'ownerOf is correct')
      result = await token.tokenOfOwnerByIndex(accounts[0], 0)

      // Owner can see all tokens
      let balanceOf = await token.balanceOf(accounts[0])
      let tokenIds = []
      for (let i = 0; i < balanceOf; i++) {
        let id = await token.tokenOfOwnerByIndex(accounts[0], i)
        tokenIds.push(id.toString())
      }
      let expected = ['1']
      assert.equal(tokenIds.toString(), expected.toString(), 'tokenIds are correct')

      // Token URI Correct
      let tokenURI = await token.tokenURI('1')
      assert.equal(tokenURI, 'https://www.token-uri.com/nft')
    })*/

})
