const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: { type: String, minLength: 5, required: true },
  author: { type: String, minLength: 5, required: true },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  url: { type: String, required: true },
  likes: { type: Number, default: 0 },
});

blogSchema.set('toJSON', {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
