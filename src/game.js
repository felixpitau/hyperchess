var Player = require('./player')
var Piece = require('./piece')
var Move = require('./move')
var Board = require('./board')
var Spot = require('./spot')

module.exports = class Game {
  constructor (whiteName = 'white', blackName = 'black', description = '') {
    this.players = [
      new Player(0, whiteName),
      new Player(1, blackName)
    ]
    this.pieces = [
      new Piece(0, 'bishop', [1, 0, 0, 0]),
      new Piece(0, 'king', [1, 0, 1, 0]),
      new Piece(0, 'king', [1, 0, 2, 0]),
      new Piece(0, 'bishop', [1, 0, 3, 0]),
      new Piece(0, 'pawn', [1, 0, 0, 1]),
      new Piece(0, 'pawn', [1, 0, 1, 1]),
      new Piece(0, 'pawn', [1, 0, 2, 1]),
      new Piece(0, 'pawn', [1, 0, 3, 1]),
      new Piece(0, 'knight', [2, 0, 0, 0]),
      new Piece(0, 'rook', [2, 0, 1, 0]),
      new Piece(0, 'rook', [2, 0, 2, 0]),
      new Piece(0, 'knight', [2, 0, 3, 0]),
      new Piece(0, 'pawn', [2, 0, 0, 1]),
      new Piece(0, 'pawn', [2, 0, 1, 1]),
      new Piece(0, 'pawn', [2, 0, 2, 1]),
      new Piece(0, 'pawn', [2, 0, 3, 1]),
      new Piece(1, 'pawn', [1, 3, 0, 2]),
      new Piece(1, 'pawn', [1, 3, 1, 2]),
      new Piece(1, 'pawn', [1, 3, 2, 2]),
      new Piece(1, 'pawn', [1, 3, 3, 2]),
      new Piece(1, 'knight', [1, 3, 0, 3]),
      new Piece(1, 'rook', [1, 3, 1, 3]),
      new Piece(1, 'rook', [1, 3, 2, 3]),
      new Piece(1, 'knight', [1, 3, 3, 3]),
      new Piece(1, 'pawn', [2, 3, 0, 2]),
      new Piece(1, 'pawn', [2, 3, 1, 2]),
      new Piece(1, 'pawn', [2, 3, 2, 2]),
      new Piece(1, 'pawn', [2, 3, 3, 2]),
      new Piece(1, 'bishop', [2, 3, 0, 3]),
      new Piece(1, 'king', [2, 3, 1, 3]),
      new Piece(1, 'king', [2, 3, 2, 3]),
      new Piece(1, 'bishop', [2, 3, 3, 3])
    ]
    for (let piece of this.pieces) {
      this.players[piece.side].pieces.push(piece)
    }
    this.moves = []
    this.description = description
    this.board = new Board(this)
    this.board.update()
  }

  checkFilter (move) {
    let kings = [[], []]
    let underAttack = [false, false]
    for (let piece in this.pieces) {
      if (piece.type === 'king') {
        kings[piece.side].push(piece)
      }
    }
    for (let i in [0, 1]) {
      let side = (i === 0 ? move.piece.side : move.piece.enemySide)
      let enemySide = (side === 0 ? 1 : 0)
      for (let king in kings[side]) {
        if (underAttack[i]) {
          break
        }
        let trySpot = (spot, typeFilter) => {
          let trySquare = this.board.at(Spot.add(king.spot, spot))
          if (!trySquare.occupied || (trySquare.occupied && move.fromSpot === spot)) {
            return
          }
          let piece
          if (trySquare.occupied) {
            piece = trySquare.piece
          }
          if (!trySquare.occupied && move.toSpot === spot) {
            piece = move.piece
          }
          if (piece.side === enemySide && typeFilter(piece)) {
            underAttack[i] = true
          }
        }
        for (let type in ['rook', 'bishop']) {
          let paths = Spot.getSpotsFor(type)
          for (let path in paths) {
            for (let spot in path) {
              trySpot(spot, piece => piece.type === type || piece.type === 'queen')
            }
          }
        }
        let spots = Spot.getSpotsFor('pawn')[enemySide]
        for (let spot in spots) {
          trySpot(spot, piece => piece.type === 'pawn')
        }
        for (let type in ['knight', 'king']) {
          spots = Spot.getSpotsFor(type)
          for (let spot in spots) {
            trySpot(spot, piece => piece.type === type)
          }
        }
      }
    }
    let turn = this.turn
    if (underAttack[turn]) {
      return false
    }
    if (underAttack[turn === 0 ? 1 : 0]) {
      move.check = true
      return true
    }
  }

  possiblePreliminaryMoves (piece) {
    let moves = []
    if (piece.constructor.name === 'Piece') {
      if (piece.side !== this.turn || piece.captured) {
        return []
      }
      if (piece.type === 'king') {
        let trySpots = Spot.getSpotsFor('king')
        while (trySpots.length > 0) {
          let trySpot = trySpots.pop()
          let trySquare = this.board.at(Spot.add(piece.spot, trySpot))
          if (!trySquare.out) {
            if (trySquare.occupied) {
              if (trySquare.piece.side !== piece.side) {
                moves.push(new Move(piece, trySquare.spot, {capture: true, capturedPiece: trySquare.piece}))
              } else if (trySquare.piece.type === 'rook' &&
                  trySquare.piece.moved === 0 &&
                  piece.moved === 0) {
                moves.push(new Move(piece, trySquare.spot, {castle: true}))
              }
            } else {
              moves.push(new Move(piece, trySquare.spot))
            }
            trySquare.attacked[piece.side] = true
          }
        }
      }
      if (piece.type === 'bishop' || piece.type === 'queen' || piece.type === 'rook') {
        let trySpots = Spot.getSpotsFor(piece.type)
        for (let i = 0; i < trySpots.length; i++) {
          while (trySpots[i].length > 0) {
            let trySpot = trySpots[i].shift()
            let trySquare = this.board.at(Spot.add(piece.spot, trySpot))
            if (!trySquare.out) {
              if (trySquare.occupied) {
                if (trySquare.piece.side !== piece.side) {
                  moves.push(new Move(piece, trySquare.spot, {capture: true, capturedPiece: trySquare.piece}))
                }
                break
              } else {
                moves.push(new Move(piece, trySquare.spot))
              }
              trySquare.attacked[piece.side] = true
            } else {
              break
            }
          }
        }
      }
      if (piece.type === 'knight') {
        let trySpots = Spot.getSpotsFor('knight')
        while (trySpots.length > 0) {
          let trySpot = trySpots.pop()
          let trySquare = this.board.at(Spot.add(piece.spot, trySpot))
          if (!trySquare.out) {
            if (trySquare.occupied) {
              if (trySquare.piece.side !== piece.side) {
                moves.push(new Move(piece, trySquare.spot, {capture: true, capturedPiece: trySquare.piece}))
              }
            } else {
              moves.push(new Move(piece, trySquare.spot))
            }
            trySquare.attacked[piece.side] = true
          }
        }
      }
      if (piece.type === 'pawn') {
        let trySpots = []
        if (piece.moved === 0) {
          let trySpotSets = Spot.getSpotsFor('pawn double step')[piece.side]
          while (trySpotSets.length > 0) {
            let trySpotSet = trySpotSets.pop()
            if (!this.board.at(Spot.add(piece.spot, trySpotSet[0])).occupied &&
                !this.board.at(Spot.add(piece.spot, trySpotSet[1])).occupied) {
              moves.push(new Move(piece, Spot.add(piece.spot, trySpotSet[1])))
            }
          }
        }
        trySpots = Spot.getSpotsFor('pawn step')[piece.side]
        while (trySpots.length > 0) {
          let trySpot = trySpots.pop()
          let trySquare = this.board.at(Spot.add(piece.spot, trySpot))
          if (!trySquare.occupied) {
            moves.push(new Move(piece, trySquare.spot))
          }
        }
        trySpots = Spot.getSpotsFor('pawn capture')[piece.side]
        while (trySpots.length > 0) {
          let trySpot = trySpots.pop()
          let trySquare = this.board.at(Spot.add(piece.spot, trySpot))
          if (trySquare.occupied &&
              !trySquare.out &&
              trySquare.piece.side !== piece.side) {
            moves.push(new Move(piece, trySquare.spot, {capture: true, capturedPiece: trySquare.piece}))
            trySquare.attacked[piece.side] = true
          }
        }

        // TODO: en passant and promotion
      }
    }
    return moves
  }

  makeMove (move) {
    if (move === null) return false
    if (!move.piece.possibleMoves.some(possibleMove => possibleMove === move)) {
      return false
    }
    // let lastMove = this.lastMove
    let piece = move.piece
    if (move.capture) {
      move.capturedPiece.capture = true
    }
    if (move.castle) {
      this.board.at(move.fromSpot).piece = this.board.at(move.toSpot).piece
      this.board.at(move.toSpot).piece = piece
    }
    piece.spot = move.toSpot
    piece.moved++
    this.moves.push(move)
    this.board.update()
    return true
  }

  undo () {
    if (this.moves.length > 0) {
      let lastMove = this.moves.pop()
      if (lastMove.capture) {
        this.pieces.push(lastMove.capturedPiece)
      }
    }
  }

  get turn () {
    return (this.moves.length % 2)
  }

  get check () {
    if (this.moves.length > 0) {
      return this.lastMove.check
    }
    return false
  }

  get mate () {
    if (this.moves.length > 0) {
      return this.lastMove.checkmate
    }
    return false
  }

  get lastMove () {
    if (this.moves.length > 0) {
      return this.moves[this.moves.length - 1]
    }
    return null
  }

  get playDescription () {
    let desc = this.players[0].name + ' as white versus ' + this.players[1].name + ' as black\n'
    for (let move of this.moves) {
      desc += move.description + '\n'
    }
    return desc
  }
}
