import database from "./../firebase/firebase";

export const getUser = async uid => {
  const userSnapshot = await database.ref(`users/${uid}`).once("value");
  if(userSnapshot.val() === null) {
    return null
  }
  return { uid: userSnapshot.key, ...userSnapshot.val() };
};

export const addUser = async ({ userName, userPhotoURL, uid, email }) => {
  const user = { userName, userPhotoURL, uid, email };

  const yo = await database.ref(`users/${uid}`).set(user);
  console.log(yo);
};
