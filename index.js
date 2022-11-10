const qrcode = require('qrcode-terminal');
const { Client } = require('whatsapp-web.js');
const moment = require('moment');
const log = require('./utils/log');
const express = require('express');
const qri = require('qr-image')

const app = express();
const client = new Client();
const now = {
  date: moment().format('YYYY-MM-DD'),
  time: moment().format('HH:mm:ss'),
  timestamp: moment().format('YYYY-MM-DD HH:mm:ss')
}
const prefix = "!";

client.on('qr', async qr => {
  const code = await qrcode.generate(qr, {
    small: true
  }, async (qrcode) => {

    console.log(qrcode)

    await app.get('/', async (req, res) => {
      await res.send(`
        <style>
          svg path {
            width: 100%;
            height: 100%;
          }
        </style>
        <svg>
          <path size="${qri.svgObject(qr).size}" d="${qri.svgObject(qr).path}" />
        </svg>
      `);

      res.end();
    })
  });

});

client.on('ready', async () => {
  console.log(`Client is ready!`);
});

app.get('/logs/log', (req, res) => {
  res.sendFile(__dirname + `\\logs\\log\\${now.date}.log`);
});

app.get('/logs/json', (req, res) => {
  res.sendFile(__dirname + `\\logs\\json\\${now.date}.json`);
});

client.on('disconnected', async () => {
  console.log(`Client is disconnected!`);
});

client.on('message', async message => {

  if (!message.body.startsWith(prefix)) {
    log(now.date, message, 'log');
    log(now.date, message, 'json');
  }
  if (message.body.startsWith(prefix + 'ping')) {
    message.reply(`🏓Latency is *${moment(Date.now() - message.timestamp).format('SS')}ms*`);
    await console.log(await message.getInfo());

    log(now.date, message, 'log');
    log(now.date, message, 'json');
  }
});


client.initialize();

app.listen(3000, () => {
  console.log('3000')
});
