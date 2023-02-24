const jwt = require('jsonwebtoken');
const logger = require('./logger');

const unknownEndpoint = (_request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

const errorHandler = (error, _request, response, next) => {
  logger.error(error.message);

  if (error.name === 'CastError')
    return response.status(400).send({ error: 'malformatted id' });
  else if (error.name === 'ValidationError')
    return response.status(400).send({ error: error.message });
  else if (error.name === 'MongoServerError')
    return response.status(400).send({ error: 'buffering timed out' });
  else if (error.name === 'StrictPopulateError')
    return response.status(400).send({ error: error.message });
  else if (error.name === 'JsonWebTokenError')
    return response.status(400).json({ error: 'token missing or invalid' });

  next(error);
};

const tokenExtractor = (request, response, next) => {
  // Get the authorization header
  // const authorization = request.headers.authorization;
  const authorization = request.get('authorization');

  if (!authorization) {
    return response.status(401).json({ error: 'missing authorization header' });
  }

  if (!authorization.toLowerCase().startsWith('bearer ')) {
    return res
      .status(401)
      .json({ error: 'Invalid authorization header format' });
  }

  // Extract the token from the authorization header
  const token = authorization.replace('bearer ', '');
  // same as return authorization.substring(7);
  // same as const [_, token] = authorization.split(' ');

  // Add the token to the request object
  request.token = token;

  // Call the next middleware function
  next();
};

const userExtractor = (request, response, next) => {
  const authorization = request.headers.authorization;
  const token = authorization.substring(7);

  const decodedToken = jwt.verify(token, process.env.SECRET);

  request.user = decodedToken.id;

  next();
};

module.exports = {
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor,
};
