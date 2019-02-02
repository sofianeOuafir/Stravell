const getVisiblePosts = (posts, { text, country }) => {
  text = text.toLowerCase()
  return posts.filter(post => {
    const matchText =
      post.title.toLowerCase().includes(text) ||
      post.description.toLowerCase().includes(text);
    const matchCountry = country === '' || post.country === country
    return matchText && matchCountry;
  });
};

export { getVisiblePosts };
