const getVisiblePosts = (posts, { text }) => {
  text = text.toLowerCase()
  return posts.filter(post => {
    const matchText =
      post.title.toLowerCase().includes(text) ||
      post.description.toLowerCase().includes(text);
    return matchText;
  });
};

export { getVisiblePosts };
