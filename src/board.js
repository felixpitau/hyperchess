var Square = require('./square.js');

module.exports = class Board {

  constructor (game) {
    this.squares = [];
    for (let x = 0; x < 4; x++) {
      this.squares[x] = [];
      for (let y = 0; y < 4; y++) {
        this.squares[x][y] = [];
        for (let a = 0; a < 4; a++) {
          this.squares[x][y][a] = [];
          for (let b = 0; b < 4; b++) {
            this.squares[x][y][a][b] = new Square([x, y, a, b]);
          }
        }
      }
    }
  }

  update (game) {
    for (let piece of game.pieces) {
      this.at(piece.spot).piece = piece;
    }
    for (let piece of game.pieces) {
      piece.possibleMoves = game.possibleMoves(piece);
    }
  }

  at (p) {
    if (p[0] < 4 && p[0] >= 0 && p[1] < 4 && p[1] >= 0 &&
        p[2] < 4 && p[2] >= 0 && p[3] < 4 && p[3] >= 0) {
      return this.squares[p[0]][p[1]][p[2]][p[3]];
    } else {
      return {occupied: true, out: true};
    }
  }

}
