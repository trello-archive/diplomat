const Botkit = require('botkit');
const redis = require('redis');
const bluebird = require('bluebird');
const behaviors = require('./behaviors');

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);
const redisClient = redis.createClient(process.env.DIPLOMAT_REDIS_URL);

const slackbotController = Botkit.slackbot({
  debug: false,
  require_delivery: true,
});

const bot = slackbotController.spawn({
  token: process.env.DIPLOMAT_SLACK_TOKEN,
}).startRTM((err, bot, payload) => {
});

behaviors.setUpBehaviors(slackbotController, redisClient);
