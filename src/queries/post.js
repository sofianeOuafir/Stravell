import database from "./../firebase/firebase";
import {
  fromSnapShotToObject,
  fromSnapShotToArray
} from "./../lib/utils/snapshot";
import { getPlaceIdFromLatLng } from "./../lib/utils/place";

export const removePost = async post => {
  const { id, uid, countryCode, regionCode, placeId } = post;

  let updates = {};
  updates[`/posts/${id}`] = null;

  if (uid) {
    updates[`/user-posts/${uid}/${id}`] = null;
  }

  if (countryCode) {
    const snapshot = await database
      .ref(`/posts`)
      .orderByChild("countryCode")
      .equalTo(countryCode)
      .limitToFirst(2)
      .once("value");
    const posts = fromSnapShotToArray(snapshot);
    if (posts.length !== 2) {
      updates[`/countries/${countryCode}`] = null;
    }

    updates[`/country-posts/${countryCode}/${id}`] = null;
    if (uid) {
      const snapshot = await database
        .ref(`/user-posts/${uid}`)
        .orderByChild("countryCode")
        .equalTo(countryCode)
        .limitToFirst(2)
        .once("value");
      const posts = fromSnapShotToArray(snapshot);
      if (posts.length !== 2) {
        updates[`/user-countries/${uid}/${countryCode}`] = null;
      }
    }
  }

  if (regionCode) {
    const snapshot = await database
      .ref(`/posts`)
      .orderByChild("regionCode")
      .equalTo(regionCode)
      .limitToFirst(2)
      .once("value");
    const posts = fromSnapShotToArray(snapshot);
    if (posts.length !== 2) {
      updates[`/regions/${regionCode}`] = null;
    }

    updates[`/region-posts/${regionCode}/${id}`] = null;
    if (countryCode) {
      const snapshot = await database
        .ref(`/country-posts/${countryCode}`)
        .orderByChild("regionCode")
        .equalTo(regionCode)
        .limitToFirst(2)
        .once("value");
      const posts = fromSnapShotToArray(snapshot);
      if (posts.length !== 2) {
        updates[`/country-regions/${countryCode}/${regionCode}`] = null;
      }
    }
  }

  if (placeId) {
    const snapshot = await database
      .ref(`/posts`)
      .orderByChild("placeId")
      .equalTo(placeId)
      .limitToFirst(2)
      .once("value");
    const posts = fromSnapShotToArray(snapshot);
    if (posts.length !== 2) {
      updates[`/places/${placeId}`] = null;
    }

    updates[`/place-posts/${placeId}/${id}`] = null;
    if (countryCode) {
      const snapshot = await database
        .ref(`/country-posts/${countryCode}`)
        .orderByChild("placeId")
        .equalTo(placeId)
        .limitToFirst(2)
        .once("value");
      const posts = fromSnapShotToArray(snapshot);
      if (posts.length !== 2) {
        updates[`/country-places/${countryCode}/${placeId}`] = null;
      }
    }
    if (regionCode) {
      const snapshot = await database
        .ref(`/region-posts/${regionCode}`)
        .orderByChild("placeId")
        .equalTo(placeId)
        .limitToFirst(2)
        .once("value");

      if (posts.length !== 2) {
        updates[`/region-places/${regionCode}/${placeId}`] = null;
      }
    }
    if (uid) {
      const snapshot = await database
        .ref(`/user-posts/${uid}`)
        .orderByChild("placeId")
        .equalTo(placeId)
        .limitToFirst(2)
        .once("value");
      const posts = fromSnapShotToArray(snapshot);
      if (posts.length !== 2) {
        updates[`/user-places/${uid}/${placeId}`] = null;
      }
    }
  }

  return database
    .ref()
    .update(updates)
    .catch(e => console.log(e));
};

export const addPost = ({ post, country, user, place, region }) => {
  const { uid } = user;
  const { countryCode, ...countryData } = country;
  const { regionCode, ...regionData } = region;
  const { placeId, ...placeData } = place;

  const newPostKey = database
    .ref()
    .child("posts")
    .push().key;
  let updates = {};
  updates[`/posts/${newPostKey}`] = post;

  if (uid) {
    updates[`/user-posts/${uid}/${newPostKey}`] = post;
  }

  if (countryCode) {
    updates[`/countries/${countryCode}`] = countryData;
    updates[`/country-posts/${countryCode}/${newPostKey}`] = post;
    if (uid) {
      updates[`/user-countries/${uid}/${countryCode}`] = countryData;
    }
  }

  if (regionCode) {
    updates[`/regions/${regionCode}`] = regionData;
    updates[`/region-posts/${regionCode}/${newPostKey}`] = post;
    if (countryCode) {
      updates[`/country-regions/${countryCode}/${regionCode}`] = regionData;
    }
  }

  if (placeId) {
    updates[`/places/${placeId}`] = placeData;
    updates[`/place-posts/${placeId}/${newPostKey}`] = post;
    if (countryCode) {
      updates[`/country-places/${countryCode}/${placeId}`] = placeData;
    }
    if (regionCode) {
      updates[`/region-places/${regionCode}/${placeId}`] = placeData;
    }
    if (uid) {
      updates[`/user-places/${uid}/${placeId}`] = placeData;
    }
  }

  return database
    .ref()
    .update(updates)
    .catch(e => console.log(e));
};

export const getPost = async id => {
  const snapshot = await database.ref(`posts/${id}`).once("value");
  return fromSnapShotToObject(snapshot);
};

export const getCountryPosts = async countryCode => {
  const ref = `country-posts/${countryCode}`;
  const posts = await getPosts(ref);
  return posts;
};

export const getRegionPosts = async regionCode => {
  const ref = `region-posts/${regionCode}`;
  const posts = await getPosts(ref);
  return posts;
};

export const getUserPosts = async uid => {
  const ref = `user-posts/${uid}`;
  const posts = await getPosts(ref);
  return posts;
};

export const getPlacePosts = async id => {
  const ref = `place-posts/${id}`;
  const posts = await getPosts(ref);
  return posts;
};

export const getAllPosts = async () => {
  const ref = `posts`;
  const posts = await getPosts(ref);
  return posts;
};

const getPosts = async ref => {
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
