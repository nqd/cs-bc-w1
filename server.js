'use strict'

const express = require('express')
const contractInstance = require('./deployContract.js')
const web3 = require('./web3Client.js')
const app = express()
const bodyParser = require('body-parser')
const candidates = require('./candidates.js')
const path = require('path')

app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.json())

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + 'public/index.html'))
})


app.listen(3000, function () {
  console.log('server is at :3000')
});