function voteForCandidate() {
  candidateName = $('#candidate').val()
  contractInstance.voteForCandidate(candidateName, { from: web3.eth.accounts[0] }, function () {
    let div_id = candidates[candidateName]
    $('#' + div_id).html(contractInstance.totalVotesFor.call(candidateName).toString())
  })
}

function createGame() {
  const owner = $('#gameOwner').val()
  const minBet = parseFloat($('#gameMinBet').val())
  const votes = parseInt($('#gameVote').val())

  const headers = new Headers({
    "Content-Type": "application/json",
  });

  fetch('/game', {
    method: 'post',
    headers: headers,
    body: JSON.stringify({
      minBet: minBet,
      triggerCall: votes
    }),
  })
  .then(res => res.json())
  .then(res => {
    console.log('createGame response', res)
  }).catch(function (e) {
    // Error
    console.log(e)
  });
}

$(document).ready(function () {
  candidateNames = Object.keys(candidates)
  for (var i = 0; i < candidateNames.length; i++) {
    let name = candidateNames[i]
    let val = contractInstance.totalVotesFor.call(name).toString()
    $('#' + candidates[name]).html(val)
  }
})
