const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

// get all blogs
blogsRouter.get('/', async (request, response, next) => {
  //
  console.log(request);
  try {
    const blogs = await Blog.find({}).populate('user');
    response.json(blogs);
  } catch (exception) {
    next(exception);
  }
});

// get blog by id
blogsRouter.get('/:id', async (request, response, next) => {
  //
  try {
    const blog = await Blog.findById(request.params.id);
    if (blog) response.json(blog);
    else response.status(404).end();
  } catch (exception) {
    next(exception);
  }
});

// post blog
blogsRouter.post('/', async (request, response, next) => {
  //
  const body = request.body;
  const token = request.token;

  const decodedToken = jwt.verify(token, process.env.SECRET);
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' });
  }

  const user = await User.findById(decodedToken.id);

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user.id,
  });

  try {
    if (body.url && body.title) {
      const savedBlog = await blog.save();
      user.blogs = user.blogs.concat(savedBlog._id);
      await user.save();

      response.status(201).json(savedBlog);
    } else response.status(400).end();
  } catch (exception) {
    next(exception);
  }
});

// delete blog
blogsRouter.delete('/:id', async (request, response, next) => {
  // const body = request.body;
  const token = request.token;
  const id = request.params.id;

  // Check if token is provided
  if (!token) {
    return response.status(401).json({ error: 'Authentication required' });
  }

  const decodedToken = jwt.verify(token, process.env.SECRET);
  console.log(decodedToken);
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'invalid token' });
  }

  try {
    // check if blog exists
    const userId = decodedToken.id;
    const findBlog = await Blog.findById(id);
    if (!findBlog) {
      return response.status(404).json({ error: 'Blog not found' });
    }

    console.log(findBlog.user.toString(), userId);
    // check if user is authorised to delete blog
    if (findBlog.user.toString() !== userId) {
      return response
        .status(403)
        .json({ error: 'Unauthorised to delete blog' });
    }

    await Blog.findByIdAndRemove(id);
    response.status(204).end();
  } catch (exception) {
    next(exception);
  }
});

// update blog
blogsRouter.put('/:id', async (request, response, next) => {
  const body = request.body;

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  };

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
      new: true,
    });
    response.status(200).json(updatedBlog);
  } catch (exception) {
    next(exception);
  }
});
module.exports = blogsRouter;
