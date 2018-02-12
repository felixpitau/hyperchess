var assert = require('assert')
var hyperchess = require('..')

let Game = hyperchess.Game
let game = new Game()

/* global describe, it */
describe('Piece', () => {
  describe('#enemySide', () => {
    it('should equal the opposite of side assigned', () => {
      let whitePawn = game.board.at([1, 0, 0, 1]).piece
      assert.equal(whitePawn.side, 0)
      assert.equal(whitePawn.enemySide, 1)
      let blackPawn = game.board.at([1, 3, 0, 2]).piece
      assert.equal(blackPawn.side, 1)
      assert.equal(blackPawn.enemySide, 0)
    })
  })
})
