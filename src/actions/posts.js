const addPost = (post) => ({
  type: 'ADD_POST',
  post
});

const editPost = ({ id, updates}) => ({
  type: 'EDIT_POST',
  id,
  updates
});

export { addPost, editPost };