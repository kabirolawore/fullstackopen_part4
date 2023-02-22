// const { after } = require('lodash');
const supertest = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const api = supertest(app);
const bcrypt = require('bcrypt');
const User = require('../models/user');
const helper = require('./test_helper');

const initialBlogs = require('../test_blog');
const Blog = require('../models/blog');

describe('test for blogs', () => {
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
      url: 'https://elequentjs.com/',
      likes: 20,
    };

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const response = await api.get('/api/blogs');

    const titles = response.body.map((n) => n.title);

    expect(response.body).toHaveLength(initialBlogs.length + 1);
    expect(titles).toContain('Eloquent javaScript');
  });

  test('no "likes" property will default to value 0', async () => {
    const newBlog = {
      title: 'another blog post',
      author: 'Jean Doe',
      likes: 1,
      url: 'https://blogjs.com/',
    };

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const response = await api.get('/api/blogs');
    const likes = response.body.map((n) => n.likes);

    //
    expect(response.body).toHaveLength(initialBlogs.length + 1);
    expect(likes).toContain(0);
  });

  test('no "title" or "url" responds with 400 Bad Request', async () => {
    const newBlog = {
      author: 'Jean Doe',
      likes: 1,
    };

    await api.post('/api/blogs').send(newBlog).expect(400);

    const response = await api.get('/api/blogs');
    expect(response.body).toHaveLength(initialBlogs.length);
  });

  test('a single blog post can be deleted if id is valid', async () => {
    //
    const response = await api.get('/api/blogs');
    const blogsAtStart = response.body;
    const blogToDelete = blogsAtStart[0];

    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

    const responseAfterDelete = await api.get('/api/blogs');
    const blogsAtEnd = responseAfterDelete.body;

    expect(blogsAtEnd).toHaveLength(initialBlogs.length - 1);

    const titles = blogsAtEnd.map((n) => n.title);
    expect(titles).not.toContain(blogToDelete.title);
  });

  test('a single blog post can be updated if id is valid', async () => {
    const updatedBlog = {
      likes: 100,
    };

    const response = await api.get('/api/blogs');
    const blogsAtStart = response.body;
    const blogToUpdate = blogsAtStart[0];

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const updatedResponse = await api.get('/api/blogs');

    const likes = updatedResponse.body.map((n) => n.likes);

    expect(updatedResponse.body).toHaveLength(initialBlogs.length);
    expect(likes).toContain(100);
  });
});

describe('Test for authentication, starting with one user in db', () => {
  //
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash('sekret', 10);
    const user = new User({ username: 'root', passwordHash });

    await user.save();
  });
  //
  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'john',
      name: 'john Doe',
      password: 'johndoe',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

    const usernames = usersAtEnd.map((u) => u.username);
    expect(usernames).toContain(newUser.username);
  });

  test('Creation fails if username is not unique', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'root',
      name: 'superuser',
      password: 'test123',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toContain('duplicate key error');

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toEqual(usersAtStart);
  });

  test('Creation fails if username is less than 3 characters', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'ja',
      name: 'adminuser',
      password: 'test123',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toContain(
      `\`username\` (\`${newUser.username}\`) is shorter than the minimum allowed length (3)`
    );

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toEqual(usersAtStart);
  });
  //
  test('Creation fails if password length is less than 3', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'admin',
      name: 'superuser',
      password: 'aa',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toContain(
      'invalid or empty password. Length must be >= 3'
    );

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toEqual(usersAtStart);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
