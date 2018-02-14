var assert = require('assert')
var hyperchess = require('..')

let Spot = hyperchess.Spot

/* global describe, it */
describe('Spot', () => {
  describe('#add()', () => {
    it('should add one spot to another spot', () => {
      let spotSum = Spot.add([1, 1, 3, -1], [0, -1, -1, -1])
      assert.equal(spotSum[0], 1)
      assert.equal(spotSum[1], 0)
      assert.equal(spotSum[2], 2)
      assert.equal(spotSum[3], -2)
    })
  })
  describe('#equals()', () => {
    it('should return true given [0, 2, 2, 1] and [0, 2, 2, 1]', () => {
      assert.ok(Spot.equals([0, 2, 2, 1], [0, 2, 2, 1]))
    })
    it('should return false given [0, 3, 2, 1] and [0, 2, 2, 1]', () => {
      assert.ok(!Spot.equals([0, 3, 2, 1], [0, 2, 2, 1]))
    })
  })
  describe('#getSpotsFor()', () => {
    it('should give two spots given query \'pawn step\'', () => {
      assert.equal(Spot.getSpotsFor('pawn step')[0].length, 2)
    })
    it('should give two spots given query \'pawn double step\'', () => {
      assert.equal(Spot.getSpotsFor('pawn double step')[0].length, 2)
    })
    it('should give thirty two spots given query \'king\'', () => {
      assert.equal(Spot.getSpotsFor('king').length, 32)
    })
    it('should give eight spot sets given query \'rook\'', () => {
      assert.equal(Spot.getSpotsFor('rook').length, 8)
    })
    it('should give twenty four spot sets given query \'bishop\'', () => {
      assert.equal(Spot.getSpotsFor('bishop').length, 24)
    })
    it('should give thirty two spot sets given query \'queen\'', () => {
      assert.equal(Spot.getSpotsFor('queen').length, 32)
    })
  })
})
