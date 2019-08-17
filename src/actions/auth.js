import { firebase } from '../firebase/firebase';

export const login = ({uid, userName, userPhotoURL, email}) => ({
  type: 'LOGIN',
  uid,
  userName,
  userPhotoURL,
  email
});

export const editAuthUserPhotoURL = (userPhotoURL) => ({
  type: 'EDIT_AUTH_USER_PHOTO_URL',
  userPhotoURL
});

export const logout = () => ({
  type: 'LOGOUT'
});

export const startLogout = () => {
  return () => {
    return firebase.auth().signOut();
  };
};
