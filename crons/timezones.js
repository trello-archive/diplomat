const preferences = require('../modules/preferences');

const updateTimezones = (redisClient, bot) => {
  bot.api.users.list({}, (err, { members }) => {
    members.forEach(({ id, tz }) => {
      if (tz) {
        preferences.setTimezoneSetting(redisClient, id, tz);
      }
    });
  });
};

module.exports = [
  {
    action: updateTimezones,
    interval: 60 * 60 * 1000, // 1 hour
  }
];
