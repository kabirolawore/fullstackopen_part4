// const { after } = require('lodash');
const supertest = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const api = supertest(app);

const initialBlogs = require('../test_blog');
const Blog = require('../models/blog');

beforeEach(async () => {
  await Blog.deleteMany({});

  let blogObject = new Blog(initialBlogs[0]);
  await blogObject.save();

  blogObject = new Blog(initialBlogs[1]);
  await blogObject.save();

  blogObject = new Blog(initialBlogs[2]);
  await blogObject.save();

  blogObject = new Blog(initialBlogs[3]);
  await blogObject.save();

  blogObject = new Blog(initialBlogs[4]);
  await blogObject.save();

  blogObject = new Blog(initialBlogs[5]);
  await blogObject.save();
});

test('blogs are returned as json', async () => {
  // console.log('entered test');

  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);
});

test('there are blogs', async () => {
  const response = await api.get('/api/blogs');

  expect(response.body).toHaveLength(initialBlogs.length);
});

test('the first blog is about react patterns', async () => {
  const response = await api.get('/api/blogs');

  const titles = response.body.map((n) => n.title);
  expect(titles).toContain('React patterns');
});

afterAll(async () => {
  await mongoose.connection.close();
});
