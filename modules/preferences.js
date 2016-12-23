const TEMPERATURE_CELCIUS = '0';
const TEMPERATURE_FAHRENHEIT = '1';

const getTemperatureSetting = (redisClient, user) => (
  redisClient.getAsync(`${user}_temperature`)
);

const setTemperatureSetting = (redisClient, user, setting) => (
  redisClient.setAsync(`${user}_temperature`, setting)
);

const getMultipleTimezoneSettings = (redisClient, userIds) => {
  const keys = userIds.map(userId => `${userId}_timezone`);
  return redisClient.mgetAsync(keys);
};

const getTimezoneSetting = (redisClient, user) => (
  redisClient.getAsync(`${user}_timezone`)
);

const setTimezoneSetting = (redisClient, user, timezone) => (
  redisClient.setAsync(`${user}_timezone`, timezone)
);

module.exports = {
  TEMPERATURE_CELCIUS,
  TEMPERATURE_FAHRENHEIT,

  getTemperatureSetting,
  setTemperatureSetting,

  getMultipleTimezoneSettings,
  getTimezoneSetting,
  setTimezoneSetting,
}
