const roundFloatTo = (numPlacesAfterDecimal, fn) => {
  return function() {
    const result = fn.apply(null, arguments);
    const multiplier = Math.pow(10, numPlacesAfterDecimal);

    return Math.floor(Math.round(result * multiplier)) / multiplier;
  };
};

module.exports = {
  roundFloatTo,
}
