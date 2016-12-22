const setUpBehaviors = (slackbotController, redisClient) => {
  const behaviors = [
    ...require('./preferences.js'),
    ...require('./temperature.js'),
  ];

  behaviors.forEach(({ action, events, messages }) => {
    messages.forEach((message) => {
      slackbotController.hears(
        message,
        events.join(','),
        action.bind(null, redisClient)
      );
    });
  });
};

module.exports = {
  setUpBehaviors
};
