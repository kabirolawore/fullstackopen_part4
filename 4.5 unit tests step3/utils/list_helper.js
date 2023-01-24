const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogList) => {
  return blogList.reduce((acc, next) => acc + next, 0);
};

const favoriteBlog = (blogList) => {
  //
  blogList.forEach((blog) => {
    delete blog.url;
    delete blog._id;
    delete blog.__v;
  });

  let maxLike = Math.max(...blogList.map((item) => item.likes));

  const favBlog = blogList.filter((obj) => obj.likes === maxLike);

  return favBlog[0];
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
};
