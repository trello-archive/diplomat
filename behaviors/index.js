const { assignIn } = require('lodash');

const getMatch = (text, regexps) => {
  for (const regexp of regexps) {
    const match = text.match(regexp);
    if (match) return match;
  }

  return null;
};

const setUpBehaviors = (slackbotController, redisClient) => {
  const behaviorSets = [
    require('./preferences.js'),
    require('./time.js'),
    require('./temperature.js'),
  ];

  // Because someone might type something that triggers multiple behaviors, we
  // need to manually set up listeners so it can have a response per behavior set
  // if necessary (e.g. "I can't believe it's 10ºC at 1am!")
  slackbotController.hears('(.+)', [
    'ambient',
    'direct_mention',
    'direct_message',
    'mention',
  ], (bot, message) => {
    const { event, text } = message

    behaviorSets.forEach((behaviorSet) => {
      for (const behavior of behaviorSet) {
        const { action, events, messages } = behavior;

        if (events.indexOf(event) < 0) continue;

        const match = getMatch(text, messages);

        if (match) {
          action(redisClient, bot, assignIn({}, message, { match }));
          break;
        }
      }
    });
  });
};

module.exports = {
  setUpBehaviors
};
