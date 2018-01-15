module.exports = class Piece {

  constructor (side, type, position) {
    this.side = side;
    this.type = type;
    this.spot = position;
    this.moved = false;
    this.captured = false;
    if (type == 'pawn') {
      this.enpassant = [];
    }
    this.possibleMoves = [];
  }

}
