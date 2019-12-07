const fs = require('fs');
const path = require('path');
const util = require('util');
const users = require('./db/users');

const rootUser = users[users.length - 1];
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
