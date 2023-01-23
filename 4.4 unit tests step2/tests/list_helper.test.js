const listHelper = require('../utils/list_helper');
const blogs = require('../test_blog');

test('dummy returns one', () => {
  const blogs = [];

  const result = listHelper.dummy(blogs);
  expect(result).toBe(1);
});

describe('total likes', () => {
  test('of empty list is zero', () => {
    const emptyBlogList = [];

    const result = listHelper.totalLikes(emptyBlogList);
    expect(result).toBe(0);
  });

  test('when list has only one blog equals the likes of that', () => {
    const listWithOneBlog = [blogs[0].likes];

    const result = listHelper.totalLikes(listWithOneBlog);
    expect(result).toBe(7);
  });

  test('of a bigger list is calculated rigth', () => {
    const biggerBlogList = blogs.map((item) => item.likes);

    const result = listHelper.totalLikes(biggerBlogList);
    expect(result).toBe(36);
  });
});
