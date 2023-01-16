require('dotenv').config();
// const http = require('http');
const express = require('express');
const morgan = require('morgan');
const app = express();
const cors = require('cors');
const Blog = require('./models/blog');

app.use(cors());
app.use(express.json());

morgan.token('body', (req) => JSON.stringify(req.body));
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
);

// Test
app.get('/', (_, response) => {
  response.send('<h1>Hello World!</>');
});

app.get('/api/blogs', (_request, response) => {
  Blog.find({}).then((blogs) => {
    response.json(blogs);
  });
});

app.post('/api/blogs', (request, response) => {
  const blog = new Blog(request.body);

  blog.save().then((result) => {
    response.status(201).json(result);
  });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
