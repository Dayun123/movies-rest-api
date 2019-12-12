exports.apiKeyExistsInQS = (req, res, next) => {
  if (!req.query.apiKey) {
    return res.status(400).json({
      statusCode: 400,
      statusMessage: `Access to ${req.method} ${req.baseUrl} requires an apiKey in the query string`,
    });
  }
  next();
};