module.exports = class Player {
  constructor (side, name) {
    this.side = side
    this.name = name
    this.pieces = []
    this.possibleMoves = []
  }

  get livePieces () {
    let pieces = []
    for (let piece of pieces) {
      if (!piece.captured) {
        pieces.push(piece)
      }
    }
    return pieces
  }

  get capturedPieces () {
    let pieces = []
    for (let piece of pieces) {
      if (piece.captured) {
        pieces.push(piece)
      }
    }
    return pieces
  }
}
