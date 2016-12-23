const preferences = require('../modules/preferences.js');
const { convertToC, convertToF } = require('../modules/temperature.js');

const replyForCelcius = (bot, message, celsius) => {
  const fahrenheit = convertToF(parseFloat(celsius));
  bot.reply(message, `${celsius}°C / ${fahrenheit}°F`);
};

const replyForFahrenheit = (bot, message, fahrenheit) => {
  const celsius = convertToC(parseFloat(fahrenheit));
  bot.reply(message, `${celsius}°C / ${fahrenheit}°F`);
};

const convertImplicitTemperature = (redisClient, bot, message) => {
  preferences.getTemperatureSetting(redisClient, message.user).then((setting) => {
    const temperature = message.match[1];

    const replyFunction = (setting === preferences.TEMPERATURE_FAHRENHEIT)
                        ? replyForFahrenheit
                        : replyForCelcius;

    replyFunction(bot, message, temperature);
  });
};

const convertExplicitTemperature = (redisClient, bot, message) => {
  const temperature = message.match[1];
  const unit = message.match[3].toLowerCase();

  const replyFunction = (unit === 'f' || unit === 'fahrenheit')
                      ? replyForFahrenheit
                      : replyForCelcius;

  replyFunction(bot, message, temperature);
};

module.exports = [
  {
    action: convertExplicitTemperature,
    events: [
      'ambient',
      'direct_mention',
      'direct_message',
      'mention',
    ],
    messages: [
      /(-?\d+(\.\d+)?) degrees (celsius|fahrenheit)/i,
      /(-?\d+(\.\d+)?) degrees (c|f)\s*$/i,
      /(-?\d+(\.\d+)?)°(c|f)/i, // char code 176
      /(-?\d+(\.\d+)?)º(c|f)/i, // char code 186
    ],
  },
  {
    action: convertImplicitTemperature,
    events: [
      'ambient',
      'direct_mention',
      'direct_message',
      'mention',
    ],
    messages: [
      /(-?\d+(\.\d+)?) degrees/i,
      /(-?\d+(\.\d+)?)°/i, // char code 176
      /(-?\d+(\.\d+)?)º/i, // char code 186
    ],
  },
];
