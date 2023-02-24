const bcrypt = require('bcrypt');
const usersRouter = require('express').Router();
const User = require('../models/user');

// get
usersRouter.get('/', async (request, response, next) => {
  try {
    const users = await User.find({}).populate('blogs');

    response.json(users);
  } catch (exception) {
    next(exception);
  }
});

//post
usersRouter.post('/', async (request, response, next) => {
  const { username, name, password } = request.body;

  if (!password || password.length < 3) {
    return response.status(400).json({
      error: 'invalid or empty password. Length must be >= 3',
    });
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    username,
    name,
    passwordHash,
  });

  try {
    const savedUser = await user.save();
    response.status(201).json(savedUser);
  } catch (exception) {
    next(exception);
  }
});

module.exports = usersRouter;
