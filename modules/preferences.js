const TEMPERATURE_CELCIUS = '0';
const TEMPERATURE_FAHRENHEIT = '1';

const getTemperatureSetting = (redisClient, user) => (
  redisClient.getAsync(`${user}_temperature`)
);

const setTemperatureSetting = (redisClient, user, setting) => (
  redisClient.setAsync(`${user}_temperature`, setting)
);

module.exports = {
  TEMPERATURE_CELCIUS,
  TEMPERATURE_FAHRENHEIT,

  getTemperatureSetting,
  setTemperatureSetting,
}
