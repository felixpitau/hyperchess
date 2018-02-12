module.exports = class Piece {
  constructor (side, type, position) {
    this.side = side
    this.type = type
    this.spot = position
    this.moved = 0
    this.captured = false
    this.possibleMoves = []
  }

  get enemySide () {
    return (this.side === 0 ? 1 : 0)
  }

  get name () {
    return (this.side === 0 ? 'white' : 'black') + ' ' + this.type
  }

  get description () {
    return this.name + (this.captured ? ' captured' : '') + ' at ' + this.spot.join()
  }
}
