// const { after } = require('lodash');
const supertest = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const api = supertest(app);

const initialBlogs = require('../test_blog');
const Blog = require('../models/blog');

beforeEach(async () => {
  await Blog.deleteMany({});

  const blogObjects = initialBlogs.map((blog) => new Blog(blog));

  const promiseArray = blogObjects.map((blog) => blog.save());
  await Promise.all(promiseArray);
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

test('unique identifier property of the blogs is named id', async () => {
  const response = await api.get('/api/blogs');

  const id = response.body.map((n) => n.id);
  expect(id).toBeDefined();
});

test('successfully creates a new blog post', async () => {
  const newBlog = {
    title: 'Eloquent javaScript',
    author: 'John Doe',
    blogs: 11,
    url: 'https://elequentjs.com/',
    likes: 20,
  };

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const response = await api.get('/api/blogs');

  console.log(response[0]);
  const titles = response.body.map((n) => n.title);

  expect(response.body).toHaveLength(initialBlogs.length + 1);
  expect(titles).toContain('Eloquent javaScript');
});

afterAll(async () => {
  await mongoose.connection.close();
});
