const { roundFloatTo } = require('../decorators/math');

const convertToC = roundFloatTo(2, (fahrenheit) => {
  return (fahrenheit - 32) / (9/5);
});

const convertToF = roundFloatTo(2, (celsius) => {
  return celsius * (9/5) + 32;
});

module.exports = {
  convertToC,
  convertToF,
};
