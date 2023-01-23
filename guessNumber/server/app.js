const express = require("express"),
  app = express();
const { Game } = require("./Game.js");
const MIN = 1;
const MAX = 100;
const ATTEMPTS = 20;
let game;

port = process.env.PORT || 3030;
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin",'*');
  res.setHeader("Access-Control-Allow-Methods", "GET,POST");
  next();
});

app.use(express.static("./../client/"))
// creates game instance and returns sucess event

app.get("/initiate", (req, res) => {
  game = new Game(MIN, MAX, ATTEMPTS);
  console.log('initiated')
  res.status(200).json({msg: "game intiated"});
});

// returns MIN MAX range, Current Player and max attempts
app.get("/start", (req, res) => {
  res.status(200).json({
    min: MIN,
    max: MAX,
    current_player: game.players[game.currentPlayerIdx].name,
    max_attempts: game.attempts
  });
});

// creates players and returns players array in reponse
app.get("/player", (req, res) => {
  game.createPlayer(req.query.name);
  res.status(200).json({
    no_players:game.players.length,
    players: game.players
  });
});

// valids guess returning number of attempts, status(win, lose, not ended)
app.get("/guess", (req, res) => {
  game.guess(req.query.guess_number);
  var payload = {
    status: game.status,
    current_player: game.players[game.currentPlayerIdx].name,
    attempts: game.status == 'win' ? game.attemptsLeft++ : game.attemptsLeft
  };

  if(game.status.match(/win|lose/i)){
   payload.players = game.players;
  }

  res.status(200).json(payload);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}..... `);
});

