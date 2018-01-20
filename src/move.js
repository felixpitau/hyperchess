module.exports = class Move {
  constructor (piece, spot, args = {time: 0, capture: false, castle: false, enpassant: false, capturedPiece: false, promotion: false}) {
    this.piece = piece
    this.spot = spot
    this.fromSpot = Object.assign({}, this.piece.spot)
    this.time = args.time
    this.capture = args.capture
    this.castle = args.castle
    this.enpassant = args.enpassant
    this.capturedPiece = args.capturedPiece
    this.promotion = args.promotion
  }
}
