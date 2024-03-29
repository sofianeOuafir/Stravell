const authReducerDefaultState = {};

const authReducer = (state = authReducerDefaultState, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        uid: action.uid,
        userName: action.userName,
        userPhotoURL: action.userPhotoURL,
        email: action.email
      };
    case 'EDIT_AUTH_USER_PHOTO_URL':
      return {
        ...state,
        userPhotoURL: action.userPhotoURL,
      };
    case 'LOGOUT':
      return {};
    default:
      return state;
  }
};

export default authReducer;
