const _ = require('lodash');
const moment = require('moment-timezone');

const preferences = require('../modules/preferences');

const TIME_FORMAT = 'h:mm A z';
const TIME_REGEX = /(\d+):(\d+) (A|P)/; // this correlates with the above format

moment.tz.link([
  'America/Los_Angeles|Pacific Standard Time',
]);

const sortFormattedTimes = (times) => (
  [...times].sort((timeA, timeB) => {
    let [ _a, hourA, minuteA, periodA ] = timeA.match(TIME_REGEX);
    let [ _b, hourB, minuteB, periodB ] = timeB.match(TIME_REGEX);

    hourA = parseInt(hourA);
    hourB = parseInt(hourB);
    minuteA = parseInt(minuteA);
    minuteB = parseInt(minuteB);

    if (periodA === 'A' && periodB === 'P') return -1;
    if (periodA === 'P' && periodB === 'A') return 1;
    if (hourA < hourB) return -1;
    if (hourA > hourB) return 1;
    if (minuteA < minuteB) return -1;
    if (minuteA > minuteB) return 1;
    return 0;
  })
);

const getAllTimezones = (redisClient, bot, channel) => {
  return new Promise((resolve, reject) => {
    bot.api.users.list({}, (err, { members }) => {
      const userIds = members.map(user => user.id);

      preferences.getMultipleTimezoneSettings(redisClient, userIds).then((timezones) => {
        resolve(_.uniq(_.compact(timezones)))
      });
    });
  });
};

const getTimezonesInChannel = (redisClient, bot, channel) => {
  return new Promise((resolve, reject) => {
    bot.api.channels.info({ channel }, (err, response) => {
      if (response && response.channel && response.channel.members) {
        const { members } = response.channel;

        preferences.getMultipleTimezoneSettings(redisClient, members).then((timezones) => {
          resolve(_.uniq(_.compact(timezones)))
        });
      } else {
        resolve(getAllTimezones(redisClient, bot, channel));
      }
    });
  });
};

const updateTimezone = (redisClient, bot, message) => {
  bot.api.users.info({ user: message.user }, (err, { user }) => {
    const { tz } = user;
    if (tz) {
      preferences.setTimezoneSetting(redisClient, user, tz).then(() => {
        bot.reply(message, `Your timezone has been set to ${tz}.`);
      });
    } else {
      bot.reply(message, 'You do not have a timezone set in your Slack preferences.');
    }
  });
};

const getTimezone = (redisClient, bot, message) => {
  preferences.getTimezoneSetting(redisClient, message.user).then((timezone) => {
    if (timezone) {
      bot.reply(message, timezone);
      return;
    }

    updateTimezone(redisClient, bot, message);
  });
};

const translateTime = (redisClient, bot, message) => {
  const user = message.user;

  const minutes = parseInt(message.match[3]) || 0;
  const period = message.match[4].toLowerCase() + 'm';

  let hours = parseInt(message.match[1]);
  if (period === 'pm') hours += 12;

  preferences.getTimezoneSetting(redisClient, user).then((timezone) => {
    const time = moment.tz(timezone);
    time.hour(hours);
    time.minutes(minutes);

    getTimezonesInChannel(redisClient, bot, message.channel).then((timezones) => {
      const times = _.uniq(sortFormattedTimes(
        timezones.map(timezone => time.tz(timezone).format(TIME_FORMAT))
      ));

      const reply = [
        `${message.match[0]} ${timezone} is:`,
        `===========`,
        ...times,
      ].join('\n');

      bot.reply(message, reply);
    });
  });
};

module.exports = [
  {
    action: updateTimezone,
    events: [ 'direct_message' ],
    messages: [ /update timezone/i ],
  },
  {
    action: getTimezone,
    events: [ 'direct_message' ],
    messages: [ /timezone/i ],
  },
  {
    action: translateTime,
    events: [
      'ambient',
      'direct_mention',
      'direct_message',
      'mention',
    ],
    messages: [
      /(\d{1,2})(:(\d{2}))?\s*(a|p)\.?m\.?/i,
    ],
  },
];

