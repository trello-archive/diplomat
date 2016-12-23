const setUpCrons = (bot, redisClient) => {
  const crons = [
    ...require('./timezones.js'),
  ];

  crons.forEach(({ action, interval }) => {
    const boundAction = action.bind(null, redisClient, bot);
    boundAction();
    setInterval(boundAction, interval);
  });
};

module.exports = {
  setUpCrons
};

