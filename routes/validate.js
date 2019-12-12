const path = require('path');
const fs = require('fs');
const util = require('util');

const readFile = util.promisify(fs.readFile);
const rootApiKeyPath = path.join(__dirname, '../rootApi.key');

exports.apiKeyExistsInQS = (req, res, next) => {
  if (!req.query.apiKey) {
    return res.status(400).json({
      statusCode: 400,
      statusMessage: `Access to ${req.method} ${req.baseUrl} requires an apiKey in the query string`,
    });
  }
  next();
};

exports.rootApiKeyMatch = async (req, res, next) => {
  
  const rootApiKey = await readFile(rootApiKeyPath, 'utf8');
  
  if (rootApiKey !== req.query.apiKey) {
    return res.status(401).json({
      statusCode: 401,
      statusMessage: 'Must provide a valid API Key',
    });
  }
  next();
};