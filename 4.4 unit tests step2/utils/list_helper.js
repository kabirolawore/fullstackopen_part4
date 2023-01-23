const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogList) => {
  return blogList.reduce((acc, next) => acc + next, 0);
};

module.exports = {
  dummy,
  totalLikes,
};
