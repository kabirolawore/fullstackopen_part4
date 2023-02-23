const _ = require('lodash');

const dummy = () => {
  return 1;
};

const totalLikes = (blogList) => {
  return blogList.reduce((acc, next) => acc + next, 0);
};

const favoriteBlog = (blogList) => {
  //
  const newblogList = JSON.parse(JSON.stringify(blogList));
  newblogList.forEach((blog) => {
    delete blog.url;
    delete blog._id;
    delete blog.__v;
    delete blog.blogs;
  });

  let maxLike = Math.max(...newblogList.map((item) => item.likes));

  const favBlog = newblogList.filter((obj) => obj.likes === maxLike);

  return favBlog[0];
};

const mostBlogs = (blogArr) => {
  //
  const newblogArr = JSON.parse(JSON.stringify(blogArr));
  newblogArr.forEach((blog) => {
    delete blog.url;
    delete blog._id;
    delete blog.__v;
    delete blog.likes;
    delete blog.title;
  });

  let blogsCount = newblogArr.map((item) => item.blogs);
  let blogsMax = _.max(blogsCount);

  let blogFound = _.find(newblogArr, (blog) => blog.blogs === blogsMax);

  return blogFound;
};

const mostLikes = (blogList) => {
  //
  const newList = JSON.parse(JSON.stringify(blogList));
  newList.forEach((blog) => {
    delete blog.url;
    delete blog._id;
    delete blog.__v;
    delete blog.blogs;
    delete blog.title;
  });

  let likesArr = newList.map((item) => item.likes);
  let likesMax = _.max(likesArr);

  let likeFound = _.find(newList, (blog) => blog.likes === likesMax);

  return likeFound;
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
