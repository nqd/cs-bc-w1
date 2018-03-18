'use strict'

const express = require('express')
const contract = require('./contract.js')
const app = express()
const bodyParser = require('body-parser')
const path = require('path')

const web3 = require('./web3Client')

let contractInstance
const CONTRACTGAS = 4700000

app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + 'public/index.html'))
})

// start the game
app.post('/game', (req, res) => {
  if (!req.body.minBet && !req.body.triggerCall) {
    return res.status(400).send('Invalid arg')
  }

  try {
    contractInstance = contract(
      web3.toWei(req.body.minBet),
      req.body.triggerCall)
    return res.send({ ok: true })
  } catch (e) {
    res.status(500).send(e)
  }
})

// lets bet
app.post('/bet', (req, res) => {
  if (!req.body.account && !req.body.number && !req.body.value) {
    return res.status(400).send('Invalid arg')
  }
  // todo:
  // - req.body.account is in [0, 9]
  // - req.body.number is in [1, 10]

  try {
    contractInstance.pickNumber(
      req.body.number,
      {
        from: web3.eth.accounts[req.body.account],
        // all smart contracts have to calculate ether values in Wei
        value: web3.toWei(req.body.value),
        gas: CONTRACTGAS
      }, (err) => {
        if (err) {
          console.log('pickNumber err', err)
          return res.status(400).send(err)
        }
        return res.send({ ok: true })
      })
  } catch (e) {
    console.log(e)
    res.status(500).send(e)
  }
})

app.get('/balances', (req, res) => {
  let balances = {}
  for (let i = 0; i < 10; i++) {
    const balance = web3.eth.getBalance(web3.eth.accounts[i])
    const eth = web3.fromWei(balance.toNumber())
    balances[i] = eth
  }
  res.send(balances)
})

app.listen(3000, function () {
  console.log('Server is running at :3000')
});