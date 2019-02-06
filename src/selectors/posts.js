const getVisiblePosts = (posts, { text, countryCode }) => {
  text = text.toLowerCase()
  return posts.filter(post => {
    const matchText =
      post.title.toLowerCase().includes(text) ||
      post.description.toLowerCase().includes(text);
    const matchCountry = countryCode === '' || post.countryCode === countryCode
    return matchText && matchCountry;
  });
};

export { getVisiblePosts };
