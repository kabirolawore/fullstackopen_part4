const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: { type: String, minLength: 5, required: true },
  author: { type: String, minLength: 5, required: true },
  url: String,
  likes: Number,
});

blogSchema.set('toJSON', {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model('Blog', blogSchema);
