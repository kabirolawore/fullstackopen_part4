const config = require('./utils/config');
const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');
const blogsRouter = require('./controllers/blogs');
const usersRouter = require('./controllers/users');
const logger = require('./utils/logger');
const mongoose = require('mongoose');

logger.info('connecting to', config.MONGODB_URI);

mongoose
  .connect(config.MONGODB_URI)
  .then(() => logger.info('Connected to MongoDB'))
  .catch((error) =>
    logger.error('error connecting to MongoDB:', error.message)
  );

morgan.token('body', (req) => JSON.stringify(req.body));
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
);

app.use(cors());
app.use(express.json());
app.use('/api/blogs', blogsRouter);
app.use('/api/users', usersRouter);

module.exports = app;
