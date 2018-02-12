var assert = require('assert')
var hyperchess = require('..')

let Game = hyperchess.Game
let game = new Game()
let board = game.board

/* global describe, it */
describe('Board', () => {
  describe('#constructor()', () => {
    it('should not be empty of squares', () => {
      assert.notEqual(board.squares, [])
    })
    it('should be a 4x4x4x4 array filled with square instances', () => {
      for (let x = 0; x < 4; x++) {
        assert.equal(board.squares[x].length, 4)
        for (let y = 0; y < 4; y++) {
          assert.equal(board.squares[x][y].length, 4)
          for (let a = 0; a < 4; a++) {
            assert.equal(board.squares[x][y][a].length, 4)
            for (let b = 0; b < 4; b++) {
              assert.equal(board.squares[x][y][a][b].constructor.name, 'Square')
            }
          }
        }
      }
    })
  })
  describe('#at()', () => {
    it('should start with a white bishop on 1,0,0,0', () => {
      let whiteBishop = board.at([1, 0, 0, 0]).piece
      assert.equal(game.pieces[0], whiteBishop)
      assert.equal(whiteBishop.type, 'bishop')
      assert.equal(whiteBishop.side, 0)
    })
    it('should start with a white pawn on 1,0,0,1', () => {
      let whitePawn = board.at([1, 0, 0, 1]).piece
      assert.equal(whitePawn.type, 'pawn')
      assert.equal(whitePawn.side, 0)
    })
    it('should start with the white king on 1,0,1,0', () => {
      let whiteKing = board.at([1, 0, 1, 0]).piece
      assert.equal(whiteKing.type, 'king')
      assert.equal(whiteKing.side, 0)
    })
  })
})
/**/
