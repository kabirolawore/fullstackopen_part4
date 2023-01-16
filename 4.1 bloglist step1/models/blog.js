const mongoose = require('mongoose');

const mongoUrl = process.env.MONGODB_URI;

console.log(`Connecting to ${mongoUrl}`);

mongoose
  .connect(mongoUrl)
  .then((_) => console.log('connected to MongoDB'))
  .catch((err) => console.error(`error connecting to MongoDB ${err}`));

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
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
