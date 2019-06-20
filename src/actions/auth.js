import { firebase } from '../firebase/firebase';

export const login = ({uid, userName, userPhotoURL}) => ({
  type: 'LOGIN',
  uid,
  userName,
  userPhotoURL
});

export const updateAuthStatePhotoURL = (userPhotoURL) => ({
  type: 'UPDATE_PROFILE_PICTURE',
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
