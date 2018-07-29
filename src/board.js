var Square = require('./square')

module.exports = class Board {
  constructor (game) {
    this.squares = []
    this.squareList = []
    for (let x = 0; x < 4; x++) {
      this.squares[x] = []
      for (let y = 0; y < 4; y++) {
        this.squares[x][y] = []
        for (let a = 0; a < 4; a++) {
          this.squares[x][y][a] = []
          for (let b = 0; b < 4; b++) {
            let square = new Square([x, y, a, b])
            this.squares[x][y][a][b] = square
            this.squareList.push(square)
          }
        }
      }
    }
    this.game = game
  }

  update () {
    for (let square of this.squareList) {
      square.attacked = [false, false]
      square.piece = null
    }
    for (let piece of this.game.pieces) {
      this.at(piece.spot).piece = piece.captured ? null : piece
    }
    for (let piece of this.game.pieces) {
      let possibleMoves = this.game.possiblePreliminaryMoves(piece)
      piece.possibleMoves = possibleMoves.filter(move => this.game.checkFilter(move))
    }
    this.game.players[0].possibleMoves = []
    this.game.players[1].possibleMoves = []
    for (let piece of this.game.pieces) {
      for (let move of piece.possibleMoves) {
        this.game.players[piece.side].possibleMoves.push(move)
      }
    }
    if (this.game.players[this.game.turn].possibleMoves < 1 && this.game.moves.length > 0) {
      this.game.lastMove.mate = true
    }
  }

  at (p) {
    if (p[0] < 4 && p[0] >= 0 && p[1] < 4 && p[1] >= 0 &&
        p[2] < 4 && p[2] >= 0 && p[3] < 4 && p[3] >= 0) {
      return this.squares[p[0]][p[1]][p[2]][p[3]]
    } else {
      return {occupied: true, out: true}
    }
  }
}
