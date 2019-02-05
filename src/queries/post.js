import database from "./../firebase/firebase";

export const getPost = async (id) => {
  const snapshot = await database.ref(`posts/${id}`).once("value");
  let post = { id: snapshot.key, ...snapshot.val() };
  return post;
};

export const getPosts = async ({uid, countryCode} = {}) => {
  let ref;
  if(uid && countryCode) {
    throw new Error("can't pass both arguments uid and countryCode");
  } else if(uid) {
    ref = `users/${uid}/posts`;
  } else if (countryCode) {
    ref = `countries/${countryCode}/posts`;
  } else {
    ref = 'posts';
  }
  const postSnapshot = await database
    .ref(ref)
    .orderByChild("createdAt")
    .once("value")
    .then(snapshot => {
      return snapshot;
    });

  let posts = [];
  postSnapshot.forEach(snapshotChild => {
    posts.push({
      id: snapshotChild.key,
      ...snapshotChild.val()
    });
  });
  posts = posts.reverse();
  return posts;
};
