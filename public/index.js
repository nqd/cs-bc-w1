const headers = new Headers({
  "Content-Type": "application/json",
});

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

function bet0() { bet(0) }
function bet1() { bet(1) }
function bet2() { bet(2) }
function bet3() { bet(3) }
function bet4() { bet(4) }

function bet(i) {
  const player = parseInt($(`#player${i}`).val())
  const bet = parseFloat($(`#bet${i}`).val())
  const number = parseInt($(`#number${i}`).val())

  fetch('/bet', {
    method: 'post',
    headers: headers,
    body: JSON.stringify({
      account: player,
      number: number,
      value: bet
    }),
  })
    .then(res => res.json())
    .then(res => {
      console.log('bet response', res)
      updatePlayerBalances()
    }).catch(function (e) {
      // Error
      console.log(e)
    });
}

function updatePlayerBalances() {
  const headers = new Headers({
    "Content-Type": "application/json",
  });

  fetch('/balances', {
    method: 'get',
    headers: headers
  })
    .then(res => res.json())
    .then(res => {
      console.log(res)
      for (let i = 0; i < 10; i++) {
        document.getElementById(`balance${i}`).innerHTML = Math.round(res[i] * 100) / 100
      }
    })
}
