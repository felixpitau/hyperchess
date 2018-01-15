var assert = require('assert');
var hyperchess = require('..');

var game = new hyperchess.Game();

describe('Game', () => {
  describe('Game.constructor', () => {
    it('should default white player name to white', () => {
      assert.equal(game.players[0].name, "white");
    });
    it('should default black player name to black', () => {
      assert.equal(game.players[1].name, "black");
    });
    it('should have 32 pieces on the board', () => {
      assert.equal(game.pieces.length, 32);
    });
  });
  describe('Game.possibleMoves', () => {
    it('should have exactly 4 moves available for one of white\'s pawns', () => {
      assert.equal(game.pieces[4].type, "pawn");
      assert.equal(game.pieces[4].side, 0);
      assert.equal(game.pieces[4].possibleMoves.length, 4);
    });
    it('should have exactly 13 moves available for one of white\'s knights', () => {
      assert.equal(game.pieces[8].type, "knight");
      assert.equal(game.pieces[8].side, 0);
      assert.equal(game.pieces[8].possibleMoves.length, 13);
    });
  });
});
/**/
