module.exports = class Square {
  constructor (spot, piece = null) {
    this.spot = spot
    this.occupied = (piece !== null)
    this._piece = piece
    this.attacked = [false, false]
    this.out = false
  }

  get piece () {
    return this._piece
  }

  set piece (piece) {
    this.occupied = (piece !== null)
    this._piece = piece
  }
}
