const assert = require('assert');
const {
  roundFloatTo,
} = require('../../decorators/math.js');

describe('the math decorators', () => {
  describe('#roundFloatTo', () => {
    it('rounds the result of a function to specified number of decimal places', () => {
      const roundTo0 = roundFloatTo(0, () => 1.511111);
      const roundTo1 = roundFloatTo(1, () => 1.987654);
      const roundTo2 = roundFloatTo(2, () => 10.345678);
      const roundTo3 = roundFloatTo(3, () => 99.333433);

      assert.equal(roundTo0(), 2.0);
      assert.equal(roundTo1(), 2.0);
      assert.equal(roundTo2(), 10.35);
      assert.equal(roundTo3(), 99.333);
    });
  });
});
