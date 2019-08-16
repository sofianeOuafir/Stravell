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
      return [
        ...action.posts.map(post => {
          if (post.comments) {
            let comments = [];
            for (let i in post.comments) {
              comments.push(post.comments[i]);
            }
            post.comments = comments;
          }
          return post;
        })
      ];
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
    case "ADD_POST_COMMENT":
      return [
        ...state.map(post => {
          if (post.id == action.comment.postId) {
            if (!post.comments) {
              post.comments = [];
            }
            // post.comments = post.comments.push(action.comment);
            post.comments = [...post.comments, action.comment];
            return post;
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
