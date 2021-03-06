'use strict'

const fs = require('fs')
const web3 = require('./web3Client')
const code = fs.readFileSync('Lotto.sol').toString()
const solc = require('solc')
const compiledCode = solc.compile(code)
const abiDefinition = JSON.parse(compiledCode.contracts[':Lotto'].interface)

const LottoContract = web3.eth.contract(abiDefinition)
const byteCode = compiledCode.contracts[':Lotto'].bytecode

module.exports = (minBet, triggerCall) => {
    const deployedContract = LottoContract.new(
        minBet,
        triggerCall,
        { data: byteCode, from: web3.eth.accounts[0], gas: 4700000 }
    )
    return deployedContract
}
