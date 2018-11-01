import database from "../firebase/firebase";

const startAddUser = (userData = {}) => {
  return dispatch => {
    const { userName, userPhotoURL, uid, email } = userData;
    const user = { userName, userPhotoURL, uid, email };

    return database
      .ref(`users/${uid}`)
      .set(user);
  };
};

const startGetUser = (uid) => {
  return dispatch => {
    return database
      .ref(`users/${uid}`)
      .once('value');
  };
};

export { startAddUser, startGetUser };


