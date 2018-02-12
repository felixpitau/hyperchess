var assert = require('assert')
var hyperchess = require('..')

let Game = hyperchess.Game
let Spot = hyperchess.Spot

/* global describe, it */
describe('Game', () => {
  describe('#constructor()', () => {
    let game = new Game()
    it('should default white player name to white', () => {
      assert.equal(game.players[0].name, 'white')
    })
    it('should default black player name to black', () => {
      assert.equal(game.players[1].name, 'black')
    })
    it('should have 32 pieces on the board', () => {
      assert.equal(game.pieces.length, 32)
    })
  })
  describe('#possibleMoves()', () => {
    let game = new Game()
    it('should have exactly 4 moves available for one of white\'s pawns', () => {
      let piece = game.pieces[4]
      assert.equal(piece.type, 'pawn')
      assert.equal(piece.side, 0)
      piece.possibleMoves.forEach(move => console.log(move.description))
      assert.equal(piece.possibleMoves.length, 4)
    })
    it('should have exactly 13 moves available for one of white\'s knights', () => {
      let piece = game.pieces[8]
      assert.equal(piece.type, 'knight')
      assert.equal(piece.side, 0)
      assert.equal(piece.possibleMoves.length, 13)
    })
    it('should have exactly 11 moves available for one of white\'s bishops', () => {
      let piece = game.pieces[0]
      assert.equal(piece.type, 'bishop')
      assert.equal(piece.side, 0)
      assert.equal(piece.possibleMoves.length, 11)
    })
    it('should have exactly 12 moves available for one of white\'s kings', () => {
      let piece = game.pieces[1]
      assert.equal(piece.type, 'king')
      assert.equal(piece.side, 0)
      assert.equal(piece.possibleMoves.length, 12)
    })
    it('should have exactly 4 moves available for one of white\'s rooks', () => {
      let piece = game.pieces[9]
      assert.equal(piece.type, 'rook')
      assert.equal(piece.side, 0)
      assert.equal(piece.possibleMoves.length, 4)
    })
    it('should have exactly 0 moves available for one of black\'s pawns', () => {
      let piece = game.pieces[16]
      assert.equal(piece.type, 'pawn')
      assert.equal(piece.side, 1)
      assert.equal(piece.possibleMoves.length, 0)
    })
  })
  describe('#makeMove()', () => {
    let game = new Game()
    var tryMove = (from, to) => {
      from = from.split('').map(n => parseInt(n))
      to = to.split('').map(n => parseInt(n))
      // console.log(from)
      // console.log(to)
      let square = game.board.at(from)
      // console.log(square)
      if (square.occupied && !square.out) {
        let piece = square.piece
        let tryMove = null
        for (let move of piece.possibleMoves) {
          if (Spot.equals(move.spot, to)) {
            tryMove = move
          }
        }
        return game.makeMove(tryMove)
      }
    }
    tryMove('1001', '1002') // 0: pawn movement
    tryMove('1313', '1013') // 1: rook movement
    tryMove('2030', '2220') // 2: knight movement
    tryMove('2333', '0133') // 3: bishop movement
    tryMove('1010', '1111') // 4: king movement

    tryMove('2303', '2000') // 5: bishop capture
    tryMove('1002', '1013') // 6: pawn capture
    tryMove('1323', '1123') // 7:
    tryMove('2220', '2322') // 8: knight capture
    tryMove('2323', '2322') // 9: king capture
    tryMove('2010', '2000') // 10: rook capture

    tryMove('2332', '2132') // 11: two step
    tryMove('2021', '2221') // 12: two step
    tryMove('2132', '2121') // 13: en passant

    tryMove('1020', '2020') // 14: castle

    tryMove('2121', '2120') // 15:
    tryMove('2011', '2211') // 16: two step
    tryMove('2313', '3323') // 17:
    tryMove('2020', '3021') // 18:

    tryMove('2120', '2020') // 19: promotion to rook
    tryMove('2211', '2212') // 20: check
    tryMove('2322', '3321') // 21:
    tryMove('2212', '2213') // 22:
    tryMove('2312', '2112') // 23: two step, check

    tryMove('1111', '1101') // 24:
    tryMove('2112', '2111') // 25:
    tryMove('2213', '2313') // 26: promotion to knight
    tryMove('2111', '2110') // 27:

    tryMove('1021', '1221') // 28: two step
    tryMove('2110', '2000') // 29: capture, promotion to queen
    tryMove('1221', '1222') // 30:
    tryMove('1113', '1103') // 31: check

    tryMove('1101', '1111') // 32:
    tryMove('2020', '2010') // 33:
    tryMove('1222', '1223') // 34:
    tryMove('0133', '2113') // 35:
    tryMove('1223', '1333') // 36: capture, promotion to bishop
    tryMove('2000', '2011') // 37: checkmate
    let moves = game.moves
    // moves.forEach(move => console.log(move.description))
    describe('Movement', () => {
      it('should accept a pawn movement from 1001 to 1002', () => {
        let move = moves[0]
        assert.ok(Spot.equals(move.fromSpot, [1, 0, 0, 1]))
        assert.ok(Spot.equals(move.toSpot, [1, 0, 0, 2]))
      })
      it('should accept a rook movement from 1313 to 1013', () => {
        let move = moves[1]
        assert.equal(move.piece.type, 'rook')
        assert.ok(Spot.equals(move.fromSpot, [1, 3, 1, 3]))
        assert.ok(Spot.equals(move.toSpot, [1, 0, 1, 3]))
      })
      it('should accept a knight movement from 2030 to 2220', () => {
        let move = moves[2]
        assert.equal(move.piece.type, 'knight')
        assert.ok(Spot.equals(move.fromSpot, [2, 0, 3, 0]))
        assert.ok(Spot.equals(move.toSpot, [2, 2, 2, 0]))
      })
      it('should accept a bishop movement from 2333 to 0133', () => {
        let move = moves[3]
        assert.equal(move.piece.type, 'bishop')
        assert.ok(Spot.equals(move.fromSpot, [2, 3, 3, 3]))
        assert.ok(Spot.equals(move.toSpot, [0, 1, 3, 3]))
      })
      it('should accept a king movement from 1010 to 1111', () => {
        let move = moves[4]
        assert.equal(move.piece.type, 'king')
        assert.ok(Spot.equals(move.fromSpot, [1, 0, 1, 0]))
        assert.ok(Spot.equals(move.toSpot, [1, 1, 1, 1]))
      })
    })
    describe('Capture', () => {
      it('should accept a bishop capture from 2303 to 2000', () => {
        let move = moves[5]
        assert.equal(move.piece.type, 'bishop')
        assert.ok(move.capture)
        assert.ok(Spot.equals(move.fromSpot, [2, 3, 0, 3]))
        assert.ok(Spot.equals(move.toSpot, [2, 0, 0, 0]))
      })
      it('should accept a pawn capture from 1002 to 1013', () => {
        let move = moves[6]
        assert.equal(move.piece.type, 'pawn')
        assert.ok(move.capture)
        assert.ok(Spot.equals(move.fromSpot, [1, 0, 0, 2]))
        assert.ok(Spot.equals(move.toSpot, [1, 0, 1, 3]))
      })
      it('should accept a knight capture from 2220 to 2322', () => {
        let move = moves[8]
        assert.equal(move.piece.type, 'knight')
        assert.ok(move.capture)
        assert.ok(Spot.equals(move.fromSpot, [2, 2, 2, 0]))
        assert.ok(Spot.equals(move.toSpot, [2, 3, 2, 2]))
      })
      it('should accept a king capture from 2323 to 2322', () => {
        let move = moves[9]
        assert.equal(move.piece.type, 'king')
        assert.ok(move.capture)
        assert.ok(Spot.equals(move.fromSpot, [2, 3, 2, 3]))
        assert.ok(Spot.equals(move.toSpot, [2, 3, 2, 2]))
      })
      it('should accept a rook capture from 2010 to 2000', () => {
        let move = moves[10]
        assert.equal(move.piece.type, 'rook')
        assert.ok(move.capture)
        assert.ok(Spot.equals(move.fromSpot, [2, 0, 1, 0]))
        assert.ok(Spot.equals(move.toSpot, [2, 0, 0, 0]))
      })
    })
    describe('Castling', () => {
      it('should accept a castling move 1020 with 2020', () => {
        let move = moves[14]
        assert.equal(move.piece.type, 'king')
        assert.ok(move.castle)
        assert.ok(Spot.equals(move.fromSpot, [1, 0, 2, 0]))
        assert.ok(Spot.equals(move.toSpot, [2, 0, 2, 0]))
      })
    })
    describe('En passant', () => {
      it('should accept a two step from 2332 to 2132', () => {
        let move = moves[11]
        assert.ok(move.twoStep)
        assert.ok(Spot.equals(move.fromSpot, [1, 0, 2, 0]))
        assert.ok(Spot.equals(move.toSpot, [2, 0, 2, 0]))
      })
      it('should accept a two step from 2021 to 2221', () => {
        let move = moves[12]
        assert.ok(move.twoStep)
        assert.ok(Spot.equals(move.fromSpot, [2, 0, 2, 1]))
        assert.ok(Spot.equals(move.toSpot, [2, 2, 2, 1]))
      })
      it('should accept an en passant from 2132 to 2121', () => {
        let move = moves[13]
        assert.ok(move.capture)
        assert.ok(move.enpassant)
        assert.ok(Spot.equals(move.fromSpot, [2, 1, 3, 2]))
        assert.ok(Spot.equals(move.toSpot, [2, 1, 2, 1]))
      })
    })
    describe('Promotion', () => {
      it('should accept a promotion to rook', () => {
        let move = moves[19]
        assert.equal(move.promotionType, 'rook')
        assert.ok(move.promotion)
        assert.ok(Spot.equals(move.fromSpot, [2, 1, 2, 0]))
        assert.ok(Spot.equals(move.toSpot, [2, 0, 2, 0]))
      })
      it('should accept a promotion to knight', () => {
        let move = moves[26]
        assert.equal(move.promotionType, 'knight')
        assert.ok(move.promotion)
        assert.ok(Spot.equals(move.fromSpot, [2, 2, 1, 3]))
        assert.ok(Spot.equals(move.toSpot, [2, 3, 1, 3]))
      })
      it('should accept a promotion to queen', () => {
        let move = moves[29]
        assert.equal(move.promotionType, 'queen')
        assert.ok(move.promotion)
        assert.ok(Spot.equals(move.fromSpot, [2, 1, 1, 0]))
        assert.ok(Spot.equals(move.toSpot, [2, 0, 0, 0]))
      })
      it('should accept a promotion to bishop', () => {
        let move = moves[36]
        assert.equal(move.promotionType, 'bishop')
        assert.ok(move.promotion)
        assert.ok(Spot.equals(move.fromSpot, [1, 2, 2, 3]))
        assert.ok(Spot.equals(move.toSpot, [1, 3, 3, 3]))
      })
    })
    describe('Check', () => {
      it('should accept a check on move 21', () => {
        let move = moves[20]
        assert.ok(move.check)
        assert.ok(Spot.equals(move.fromSpot, [2, 2, 1, 1]))
        assert.ok(Spot.equals(move.toSpot, [2, 2, 1, 2]))
      })
      it('should accept a check on move 24', () => {
        let move = moves[23]
        assert.ok(move.check)
        assert.ok(Spot.equals(move.fromSpot, [2, 3, 1, 2]))
        assert.ok(Spot.equals(move.toSpot, [2, 1, 1, 2]))
      })
      it('should accept a check on move 32', () => {
        let move = moves[31]
        assert.ok(move.check)
        assert.ok(Spot.equals(move.fromSpot, [1, 1, 1, 3]))
        assert.ok(Spot.equals(move.toSpot, [1, 1, 0, 3]))
      })
    })
    describe('Checkmate', () => {
      it('should accept a checkmate at move 38', () => {
        let move = moves[37]
        assert.ok(move.checkmate)
        assert.ok(Spot.equals(move.fromSpot, [2, 0, 0, 0]))
        assert.ok(Spot.equals(move.toSpot, [2, 0, 1, 1]))
      })
      /**/
    })
    console.log(game.playDescription)
  })
  describe('#lastMove', () => {
    let game = new Game()
    it('should give a move where black queen moves from 2000 to 2011', () => {
      let lastMove = game.lastMove
      assert.notEqual(lastMove, null)
      assert.equals(lastMove.piece.side, 1)
      assert.equals(lastMove.piece.type, 'queen')
      assert.ok(Spot.equals(lastMove.toSpot, [2, 0, 1, 1]))
      assert.ok(Spot.equals(lastMove.fromSpot, [2, 0, 0, 0]))
    })
  })
  describe('#undo()', () => {
    let game = new Game()
    it('should reverse checkmate', () => {
      game.undo()
      let lastMove = game.lastMove
      assert.notEqual(lastMove, null)
      assert.equals(lastMove.piece.side, 1)
      assert.equals(lastMove.piece.type, 'knight')
      assert.ok(Spot.equals(lastMove.spot, [1, 3, 0, 3]))
      assert.ok(Spot.equals(lastMove.fromSpot, [1, 0, 1, 0]))
    })
    it('should reverse mate', () => {
      game.undo()
      let lastMove = game.lastMove
      assert.notEqual(lastMove, null)
      assert.ok(false, 'Must implement test')
      // TODO: test
    })
    it('should reverse promotion', () => {
      game.undo()
      let lastMove = game.lastMove
      assert.notEqual(lastMove, null)
      assert.ok(false, 'Must implement test')
      // TODO: test
    })
    it('should reverse capture', () => {
      game.undo()
      let lastMove = game.lastMove
      assert.notEqual(lastMove, null)
      assert.ok(false, 'Must implement test')
      // TODO: test
    })
    it('should reverse castling', () => {
      game.undo()
      let lastMove = game.lastMove
      assert.notEqual(lastMove, null)
      assert.ok(false, 'Must implement test')
      // TODO: test
    })
    it('should reverse en passant', () => {
      game.undo()
      let lastMove = game.lastMove
      assert.notEqual(lastMove, null)
      assert.ok(false, 'Must implement test')
      // TODO: test
    })
    it('should reverse two step', () => {
      game.undo()
      let lastMove = game.lastMove
      assert.notEqual(lastMove, null)
      assert.ok(false, 'Must implement test')
      // TODO: test
    })
  })
  /**/
})
/**/
