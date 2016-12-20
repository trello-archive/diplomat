const assert = require('assert');
const {
  convertToC,
  convertToF,
} = require('../../modules/temperature.js');

describe('the temperature module', () => {
  describe('#convertToF()', () => {
    it('converts celsius to fahrenheit', () => {
      assert.equal(convertToF(0), 32); // freezing point
      assert.equal(convertToF(100), 212); // boiling point
      assert.equal(convertToF(537.778), 1000); // really hot
    });

    it('rounds the result to the nearest tenth', () => {
      assert.equal(convertToF(-273.15), -459.67); // absolute zero
    });
  });

  describe('#convertToF()', () => {
    it('converts fahrenheit to celsius', () => {
      assert.equal(convertToC(32), 0); // freezing point
      assert.equal(convertToC(212), 100); // boiling point
      assert.equal(convertToC(1000), 537.78); // really hot
    });

    it('rounds the result to the nearest tenth', () => {
      assert.equal(convertToC(-459.67), -273.15); // absolute zero
    });
  });
});
