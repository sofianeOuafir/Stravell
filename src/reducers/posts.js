const postsReducer = (state = [], action) => {
  switch (action.type) {
    case "ADD_POST":
      return [action.post, ...state];
    case "EDIT_POST":
      return [
        ...state.map(post => {
          if (post.id === action.id) {
            return {
              ...post,
              ...action.updates
            };
          } else {
            return post;
          }
        })
      ];
    case "SET_POSTS":
      return [...action.posts];
    case "EDIT_POSTS_USER_PHOTO_URL":
      return [
        ...state.map(post => {
          if (post.uid == action.uid) {
            return {
              ...post,
              userPhotoURL: action.userPhotoURL
            };
          } else {
            return post;
          }
        })
      ];
    default:
      return state;
  }
};

export default postsReducer;
