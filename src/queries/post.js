import database from "./../firebase/firebase";

export const getPost = async (id) => {
  const snapshot = await database.ref(`posts/${id}`).once("value");
  let post = { id: snapshot.key, ...snapshot.val() };
  return post;
};

export const getPosts = async ({uid} = {}) => {
  const ref = uid ? `users/${uid}/posts` : 'posts';
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
