module.exports = class Move {
  constructor (piece, spot, args = {}) {
    args = Object.assign({time: 0, capture: false, castle: false, twoStep: false, enpassant: false, capturedPiece: false, promotion: false, promotionType: 'queen', check: false, mate: false}, args)
    this.piece = piece
    this.spot = spot
    this.fromSpot = JSON.parse(JSON.stringify(piece.spot))
    this.time = args.time
    this.capture = args.capture
    this.castle = args.castle
    this.twoStep = args.twoStep
    this.enpassant = args.enpassant
    this.capturedPiece = args.capturedPiece
    this.promotion = args.promotion
    this.promotionType = args.promotionType
    this.check = args.check
    this.mate = args.mate
    if (typeof spot === 'undefined') throw new Error('Spot set to undefined')
  }

  get toSpot () {
    return this.spot
  }

  set toSpot (spot) {
    this.spot = spot
  }

  get checkmate () {
    return this.mate
  }

  set checkmate (mate) {
    this.mate = mate
  }

  get description () {
    let toSpot = this.spot.join('')
    let fromSpot = this.fromSpot.join('')
    return 'a ' + this.piece.name + (this.twoStep ? ' two steps' : ' moves') + ' from ' + fromSpot + ' to ' + toSpot +
        (this.castle ? ' by castling' : '') +
        (this.capture ? ' capturing a ' + this.capturedPiece.name : '') +
        (this.enpassant ? ' en passant' : '') +
        (this.promotion ? ' promoting to a ' + this.promotionType : '') +
        (this.check ? ' and putting ' + (this.piece.enemySide === 0 ? 'white' : 'black') + ' in check' +
        (this.mate ? 'mate' : '') : '')
  }
}
