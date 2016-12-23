const preferences = require('../modules/preferences.js');

const changeTemperatureSetting = (redisClient, bot, message) => {
  const unit = message.match[1].toLowerCase();

  let setting, unitStr;
  if (unit === 'c') {
    setting = preferences.TEMPERATURE_CELCIUS;
    unitStr = 'Celcius';
  } else {
    setting = preferences.TEMPERATURE_FAHRENHEIT;
    unitStr = 'Fahrenheit';
  }

  preferences.setTemperatureSetting(
    redisClient,
    message.user,
    setting
  ).then(() => {
    bot.reply(message, `Alright, your temperature preference is set to ${unitStr}`);
  });
};

const getTemperatureSetting = (redisClient, bot, message) => {
  preferences.getTemperatureSetting(
    redisClient,
    message.user
  ).then((setting) => {
    const unitStr = (setting === preferences.TEMPERATURE_CELCIUS)
                  ? 'Celsius'
                  : 'Fahrenheit';

    bot.reply(message, `Your temperature preference is set to ${unitStr}`);
  });
};

module.exports = [
  {
    action: changeTemperatureSetting,
    events: [ 'direct_message' ],
    messages: [ /use (c|f)/i ],
  },
  {
    action: getTemperatureSetting,
    events: [ 'direct_message' ],
    messages: [ /temperature setting/i ],
  }
];
