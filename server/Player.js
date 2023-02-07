class Player {
  constructor(id, name) {
    this.id = id;
    this.name = name;
    this.guesses = [];
    
  }

  guess(number){
    this.guesses.push(number)
    console.log('player: ' + this.name + ' guessed ' + number);
  }
}

module.exports = {
  Player
};
