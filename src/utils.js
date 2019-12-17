const fs = require('fs');
const path = require('path');
const util = require('util');
const users = require('./db/users');

const rootUser = users[users.length - 1];
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const rootUserApiKeyFilePath = path.join(__dirname, '../rootApi.key');

exports.createRootApiKeyFile = async () => {
  try {
    await writeFile(rootUserApiKeyFilePath, rootUser.apiKey)
    console.log(`root user created with api key: ${rootUser.apiKey}`);
  } catch (e) {
    console.log(e);
  }
};

exports.createConfigFile = async (dbName) => {
  try {
    await writeFile('config.json', JSON.stringify({ dbName }));
    console.log(`config.json created`);
  } catch (e) {
    console.log(e);
  }
};