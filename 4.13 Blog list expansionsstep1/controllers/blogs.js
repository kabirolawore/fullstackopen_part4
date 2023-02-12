const blogsRouter = require('express').Router();
const Blog = require('../models/blog');

// get all blogs
blogsRouter.get('/', async (_request, response) => {
  //
  const blogs = await Blog.find({});
  response.json(blogs);
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
  const blog = new Blog(request.body);

  try {
    if (request.body.url && request.body.title) {
      const savedBlog = await blog.save();
      response.status(201).json(savedBlog);
    } else response.status(400).end();
  } catch (exception) {
    next(exception);
  }
});

// delete blog
blogsRouter.delete('/:id', async (request, response, next) => {
  try {
    await Blog.findByIdAndRemove(request.params.id);
    response.status(204).end();
  } catch (exception) {
    next(exception);
  }
});

module.exports = blogsRouter;
