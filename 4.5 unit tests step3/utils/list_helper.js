const dummy = (blogs) => {
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
    // delete blog.blogs;
  });

  let maxLike = Math.max(...newblogList.map((item) => item.likes));

  const favBlog = newblogList.filter((obj) => obj.likes === maxLike);

  return favBlog[0];
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
};
