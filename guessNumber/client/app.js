(function (window) {
  const URL = "http://localhost:3030";
  var players = [],
    max = 20,
    min = 1,
    attemptsLeft = 0,
    attempts = 0,
    currentPlayer = "";

  // event handlers
  const start = () => {
    // make api call to start info needed: MIN MAX, current player and max attempts
    if (!players.length) {
      document.getElementById("error").style.display = "block";
      return;
    }

    apiGETRequest("/start", startHandler);
  };
  const addPlayer = () => {
    // make api call return player array and populate players array on response
    const input =
      document.getElementById("name") && document.getElementById("name").value;
    if (!input) {
      document.getElementById("error").style.display = "block";
    } else {
      document.getElementById("error").style.display = "none";
      apiGETRequest("/player", playerHandler, "name=" + input);
    }
    // console.log("Player added!");
  };

  const guess = () => {
    // make api call to guess return number of attempts, status - if win or lose make another api call to end end point and return win lose screen else return current player
    var number =
      document.getElementById("number") &&
      document.getElementById("number").value &&
      Number(document.getElementById("number").value);
    document.getElementById("error").style.display = "none";

    // out of range or not a number
    if (number < min || number > max || isNaN(number)) {
      document.getElementById("error").style.display = "block";
      return;
    }

    apiGETRequest("/guess", guessHandler, "guess_number=" + number);

  };

  // common functions
  const displayHTML = (el, content, text) => {
    text
      ? (document.getElementById(el).textContent = content)
      : (document.getElementById(el).innerHTML = content);
  };

  const apiGETRequest = (path, callBackFn, data) => {
    var xhttp = new XMLHttpRequest(),
      path = data ? path + "?" + data : path,
      res;
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        res = JSON.parse(this.response);
        callBackFn(res);
      }
    };
    console.log("aa" + path);
    xhttp.open("GET", URL + path, true);
    xhttp.send();
  };

  // Api callback Fns
  const initiator = (res) => {
    console.log(res);
    displayHTML("main", inputFields);
    document.getElementById("start").addEventListener("click", start);
    document.getElementById("add").addEventListener("click", addPlayer);
  };

  const playerHandler = (res) => {
    players = res.players;
    var playerStr = [];
    players.forEach(function (player, index) {
      playerStr.push(`<p>Player ${player.id}: ${player.name}</p>`);
    });
    displayHTML("players", playerStr.join(`</br>`));
    document.getElementById("name").value = "";
  };

  const startHandler = (res) => {
    console.log(res.max);
    max = res.max;
    min = res.min;
    attemptsLeft = attempts = res.max_attempts;
    currentPlayer = res.current_player;
    displayHTML("main", gameStarted);
    displayHTML("range", `${min} and ${max}`, true);
    displayHTML("attempts", `${attemptsLeft} out of ${attempts}`, true);
    displayHTML("currentPlayer", currentPlayer, true);

    console.log(currentPlayer);

    document.getElementById("guess").addEventListener("click", guess);
  };

  const guessHandler = (res) => {
    console.log(res)
    var status = res.status;
    currentPlayer = res.current_player;
    attemptsLeft = res.attempts;

    // winning number or no attempts left
    if (status == "win" || status == 'lose') {
      var message = status == 'win' ? `Congratulations! WINNER with ${attemptsLeft} attempts left` : 'Oops out off attempts left You Lose!'
      players = res.players;
      displayHTML("main", endGame);
      displayHTML('resultMsg', message, true)
      loadPlayerStats(status);
      return;
    }

    // in range but wrong number
      document.getElementById("attemptMsg").style.display = "block";
      displayHTML("attempts", `${attemptsLeft} out of ${attempts}`, true);
      displayHTML("currentPlayer", currentPlayer, true);
  }

  const loadPlayerStats = (status) => {
    var playerStats = `<p> ${status == 'win' ? 'Winning' : 'Last'} guesser was ${currentPlayer}`;

    players.forEach(function(player){
      playerStats += `<p> ${player.name} guessed:</p>`
      playerStats += `<p> ${player.guesses.join(',')} </p>`
    })

    console.log(playerStats)
    displayHTML('playerStats', playerStats)
  }

  // Components
  const inputFields = `<input
          type="text"
          id="name"
          name="name"
          placeholder="Enter Player name"
        />
        <span class="button" id="add">Add Player</span>
        <span class="button" id="start">start</span>
        <div id="error" style="display:none";>please enter valid name</div>
        <div id="players"></div>`;

  const gameStarted = `
        <h2> Please pick a number between <span id="range">${min} and ${max}</span> <h2>
        <h3 id="attemptMsg" style="display:none"> That's not it try again! </h3>
        <p> You have <span id="attempts">${attemptsLeft} out of ${attempts}<span> attempts left </p>
         <p> It is your go <span id="currentPlayer">${currentPlayer}</span>! </p>
        <input
          type="text"
          id="number"
          placeholder="Enter Number"
        /> 
        <span class="button" id="guess">Guess</span>
        <div id="error" style="display:none;">please enter valid number between specified range</div>`;

  const endGame = ` 
      <h2 id=resultMsg></h2>
      <div id="playerStats"></div>
  `;
 

  // document load

  window.addEventListener("load", function () {
    apiGETRequest("/initiate", initiator);
  });

  // component functions
})(window);
