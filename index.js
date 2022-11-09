const qrcode = require('qrcode-terminal');
const { Client } = require('whatsapp-web.js');
const moment = require('moment');
const log = require('log-to-file');
const express = require('express');
const fs = require('fs');
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

app.get('/logs', (req, res) => {
  res.sendFile(__dirname + `\\logs\\${now.date}.log`);
});

client.on('disconnected', async () => {
  console.log(`Client is disconnected!`);
});

client.on('message', async message => {
  const { _data: {
    notifyName,
    deprecatedMms3Url
  }, type, body, from, deviceType } = message;

  if (!message.body.startsWith(prefix)) {
    if (fs.existsSync(__dirname + `\\logs\\${now.date}.log`)) log(`"${deviceType}" - ${notifyName} (${from} - ${type}): ${body}${(deprecatedMms3Url !== "" || deprecatedMms3Url !== undefined) ? "\r\nLink: " + deprecatedMms3Url : ''}`, __dirname + `\\logs\\${now.date}.log`, '\r\n');
    else {
      fs.writeFileSync(__dirname + `\\logs\\${now.date}.log`, "");
      log(`"${deviceType}" - ${notifyName} (${from} - ${type}): ${body}${(deprecatedMms3Url !== "" || deprecatedMms3Url !== undefined) ? "\r\nLink: " + deprecatedMms3Url : ''}`, __dirname + `\\logs\\${now.date}.log`, '\r\n');
    }
  }
  if (message.body.startsWith(prefix + 'ping')) {
    message.reply(`🏓Latency is *${moment(Date.now() - message.timestamp).format('SS')}ms*`);
    await console.log(await message.getInfo());

    if (fs.existsSync(__dirname + `\\logs\\${now.date}.log`)) log(`"${deviceType}" - ${notifyName} (${from} - ${type}): ${body}${(deprecatedMms3Url !== "" || deprecatedMms3Url !== undefined) ? "\r\nLink: " + deprecatedMms3Url : ''}`, __dirname + `\\logs\\${now.date}.log`, '\r\n');
    else {
      fs.writeFileSync(__dirname + `\\logs\\${now.date}.log`, "");

      log(`"${deviceType}" - ${notifyName} (${from} - ${type}): ${body}${(deprecatedMms3Url !== "" || deprecatedMms3Url !== undefined) ? "\r\nLink: " + deprecatedMms3Url : ''}`, __dirname + `\\logs\\${now.date}.log`, '\r\n');
    }
  }
});


client.initialize();

app.listen(3000, () => {
  console.log('3000')
});
