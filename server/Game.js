const { Player } = require("./Player.js");

class Game {
  constructor(min, max, attempts = 10) {
    this.players = [];
    this.secretNumber = 10 //randomInteger(min, max);
    this.attempts = attempts;
    this.attemptsLeft = attempts;
    this.currentPlayerIdx = 0;
    this.moreOrLess = '';
    this.status = 'active';
  }

  createPlayer(name) {
    this.players.push(new Player(this.players.length + 1, name));
  }

  guess(number) {
    this.players[this.currentPlayerIdx].guess(number);

    this.attemptsLeft--;
    if (number == this.secretNumber || this.attemptsLeft == 0) {
      this.status = number == this.secretNumber ? 'win' : 'lose';
     // this.end(status);
      return;
    }

    if (number != this.secretNumber) {
        (this.currentPlayerIdx + 2 > this.players.length)
          ? this.currentPlayerIdx = 0
          : this.currentPlayerIdx++;

      this.moreOrLess = number > this.secretNumber ? '<' : '>'

          console.log('currentIndex',this.currentPlayerIdx)
    }
  }
}

module.exports = {
  Game,
};

// var a = new Game(1,20);
// a.createPlayer('Daniel');
// a.createPlayer("Jenny");
// a.guess(2);
// a.guess(3);
// a.guess(10);


function randomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
