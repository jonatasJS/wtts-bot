const moment = require('moment');

module.exports = function (message) {
  message.reply(`🏓Latency is ${moment(Date.now() - message.timestamp).format('SS')}ms`);
  message.dynamicReplyButtons({});
}