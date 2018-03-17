const fs = require('fs');
const Web3 = require('web3')
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
const code = fs.readFileSync('Lotto.sol').toString();
const solc = require('solc');
const compiledCode = solc.compile(code);
const abiDefinition = JSON.parse(compiledCode.contracts[':Lotto'].interface);
const VotingContract = web3.eth.contract(abiDefinition);
const byteCode = compiledCode.contracts[':Lotto'].bytecode;
const deployedContract = VotingContract.new(1, 2, { data: byteCode, from: web3.eth.accounts[0], gas: 4700000 });

// const contractInstance = VotingContract.new(deployedContract.address)
// deployedContract.pickNumber(5, { from: web3.eth.accounts[0], value: web3.toDecimal(4), gas: 4700000}, (err) => {
//     console.log('err', err)
// })

// deployedContract.pickNumber(1, {from: web3.eth.accounts[3], value: web3.toDecimal(4), gas: 4700000}, (err) => {console.log(err)})