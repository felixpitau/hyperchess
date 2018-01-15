var assert = require('assert');
var hyperchess = require('..');

var Spot = hyperchess.Spot;

describe('Spot', () => {
  describe('Spot.add', () => {
    it('should add one spot to another spot', () => {
      let spotSum = Spot.add([1, 1, 3, -1], [0, -1, -1, -1]);
      assert.equal(spotSum[0], 1);
      assert.equal(spotSum[1], 0);
      assert.equal(spotSum[2], 2);
      assert.equal(spotSum[3], -2);
    });
  });
  describe('Spot.getSpotsFor', () => {
    it('should give two spots given query \'pawn step\'', () => {
      assert.equal(Spot.getSpotsFor('pawn step')[0].length, 2);
    });
    it('should give ten spots given query \'king\'', () => {
      assert.equal(Spot.getSpotsFor('king').length, 10);
    });
    it('should give eight spots given query \'rook\'', () => {
      assert.equal(Spot.getSpotsFor('rook').length, 8);
    });
    it('should give twenty four spots given query \'bishop\'', () => {
      assert.equal(Spot.getSpotsFor('bishop').length, 24);
    });
    it('should give thirty two spots given query \'queen\'', () => {
      assert.equal(Spot.getSpotsFor('queen').length, 32);
    });
  });
});
