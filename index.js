const qrcode = require('qrcode-terminal');
const { Client } = require('whatsapp-web.js');
const moment = require('moment');
const log = require('log-to-file');
const fs = require('fs');

const client = new Client();
const now = {
  date: moment().format('YYYY-MM-DD'),
  time: moment().format('HH:mm:ss'),
  timestamp: moment().format('YYYY-MM-DD HH:mm:ss')
}
const prefix = "!";

client.on('qr', qr => {
  qrcode.generate(qr, {
    small: true
  });
});

client.on('ready', async () => {
  console.log(`Client is ready!`);
});


client.on('disconnected', async () => {
  console.log(`Client is disconnected!`);
});

client.on('message', async message => {
  if (!message.body.startsWith(prefix)) {
    if (fs.existsSync(__dirname + `\\logs\\${now.date}.log`)) log(message.body, __dirname + `\\logs\\${now.date}.log`, '\r\n');
    else {
      fs.writeFileSync(__dirname + `\\logs\\${now.date}.log`, "");
      log(message.body, __dirname + `\\logs\\${now.date}.log`, '\r\n');
    }
  }
  if (message.body.startsWith(prefix + 'ping')) {
    message.reply(`🏓Latency is *${moment(Date.now() - message.timestamp).format('SS')}ms*`);
    await console.log(await message.getInfo());

    if (fs.existsSync(__dirname + `\\logs\\${now.date}.log`)) log(message.body, __dirname + `\\logs\\${now.date}.log`, '\r\n');
    else {
      fs.writeFileSync(__dirname + `\\logs\\${now.date}.log`, "");
      log(message.body, __dirname + `\\logs\\${now.date}.log`, '\r\n');
    }
  }
});


client.initialize();
