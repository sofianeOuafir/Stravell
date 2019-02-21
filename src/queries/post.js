import database from "./../firebase/firebase";
import { fromSnapShotToObject, fromSnapShotToArray } from './../lib/utils/snapshot';

export const getPost = async (id) => {
  const snapshot = await database.ref(`posts/${id}`).once("value");
  return fromSnapShotToObject(snapshot);
};

export const getCountryPosts = async (countryCode) => {
  const ref = `country-posts/${countryCode}`;
  const posts = await getPosts(ref);
  return posts;
};

export const getRegionPosts = async (regionCode) => {
  const ref = `region-posts/${regionCode}`;
  const posts = await getPosts(ref);
  return posts;
};

export const getUserPosts = async (uid) => {
  const ref = `user-posts/${uid}`;
  const posts = await getPosts(ref);
  return posts;
};

export const getPlacePosts = async (id) => {
  const ref = `place-posts/${id}`;
  const posts = await getPosts(ref);
  return posts;
};

export const getAllPosts = async () => {
  const ref = `posts`;
  const posts = await getPosts(ref);
  return posts;
}

const getPosts = async (ref) => {
  const postSnapshot = await database
    .ref(ref)
    .orderByChild("createdAt")
    .once("value")
    .then(snapshot => {
      return snapshot;
    });

  let posts = fromSnapShotToArray(postSnapshot);
  return posts.reverse();
};
