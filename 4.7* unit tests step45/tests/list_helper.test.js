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

describe('favorite blog', () => {
  test('when a blog has the highest likes in the list', () => {
    const result = listHelper.favoriteBlog(blogs);

    expect(result).toEqual({
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      likes: 12,
    });
  });
});

describe('most blogs', () => {
  test('when a author has the largest amount of blogs.', () => {
    const result = listHelper.mostBlogs(blogs);

    expect(result).toEqual({
      author: 'Edsger W. Dijkstra',
      blogs: 17,
    });
  });
});

describe('most likes', () => {
  test('when a author has the largest amount of likes.', () => {
    const result = listHelper.mostLikes(blogs);

    expect(result).toEqual({
      author: 'Edsger W. Dijkstra',
      likes: 12,
    });
  });
});
