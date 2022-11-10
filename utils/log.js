const log = require('log-to-file');
const fs = require('fs');

module.exports = async (local, data, typeLog) => {
  const { _data: {
    notifyName,
    deprecatedMms3Url
  }, type, body, from, deviceType } = data;

  console.log(fs.readFileSync(__dirname.replace("\\utils", "") + `\\logs\\${typeLog}\\${local}.${typeLog}`, 'utf8'));

  if (await fs.existsSync(__dirname.replace("\\utils", "") + `\\logs\\${typeLog}\\${local}.${typeLog}`)) {
    if (typeLog == "log") return log(`"${deviceType}" - ${notifyName} (${from} - ${type}): ${body}${(deprecatedMms3Url !== "" || deprecatedMms3Url !== undefined) ? "\r\nLink: " + deprecatedMms3Url : ''}`, __dirname.replace("\\utils", "") + `\\logs\\${typeLog}\\${local}.${typeLog}`, '\r\n');
    else fs.writeFileSync(__dirname.replace("\\utils", "") + `\\logs\\${typeLog}\\${local}.${typeLog}`, JSON.stringify([
      !!await JSON.parse(fs.readFileSync(__dirname.replace("\\utils", "") + `\\logs\\${typeLog}\\${local}.${typeLog}`, 'utf8')),
      {
        notifyName,
        deprecatedMms3Url,
        body,
        from,
        deviceType
      }
    ]))
  } else {
    await fs.writeFileSync(__dirname.replace("\\utils", "") + `\\logs\\${typeLog}\\${local}.${typeLog}`, "");
    if (typeLog == "log") return log(`"${deviceType}" - ${notifyName} (${from} - ${type}): ${body}${(deprecatedMms3Url !== "" || deprecatedMms3Url !== undefined) ? "\r\nLink: " + deprecatedMms3Url : ''}`, __dirname.replace("\\utils", "") + `\\logs\\${typeLog}\\${local}.${typeLog}`, '\r\n');
    else fs.writeFileSync(__dirname.replace("\\utils", "") + `\\logs\\${typeLog}\\${local}.${typeLog}`, JSON.stringify([
      fs.readFileSync(__dirname.replace("\\utils", "") + `\\logs\\${typeLog}\\${local}.${typeLog}`, 'utf8') !== "" && await JSON.parse(fs.readFileSync(__dirname.replace("\\utils", "") + `\\logs\\${typeLog}\\${local}.${typeLog}`, 'utf8')),
      {
        notifyName,
        deprecatedMms3Url,
        body,
        from,
        deviceType
      }
    ]))
  }
}