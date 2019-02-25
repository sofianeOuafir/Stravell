import database from "./../firebase/firebase";
import {
  fromSnapShotToObject,
  fromSnapShotToArray
} from "./../lib/utils/snapshot";
import { getPlaceIdFromLatLng } from "./../lib/utils/place";

export const addPost = (postData = {}) => {
  const {
    title,
    body,
    description,
    image,
    createdAt,
    updatedAt,
    s3FolderName,
    providedURL,
    provideURL,
    country,
    countryCode,
    region,
    regionCode,
    address,
    lat,
    lng,
    uid,
    userName,
    userPhotoURL,
    placeId
  } = postData;

  const post = {
    title,
    body,
    description,
    image,
    createdAt,
    updatedAt,
    s3FolderName,
    providedURL,
    provideURL,
    country,
    countryCode,
    region,
    regionCode,
    address,
    lat,
    lng,
    uid,
    userName,
    userPhotoURL,
    placeId
  };
  // const {
  //   name: countryName,
  //   code: countryCode,
  //   bounds: {
  //     northEastLat: countryNorthEastLat,
  //     northEastLng: countryNorthEastLng,
  //     southWestLat: countrySouthWestLat,
  //     southWestLng: countrySouthWestLng
  //   }
  // } = countryData;
  // const {
  //   name: regionName,
  //   code: regionCode,
  //   bounds: {
  //     northEastLat: regionNorthEastLat,
  //     northEastLng: regionNorthEastLng,
  //     southWestLat: regionSouthWestLat,
  //     southWestLng: regionSouthWestLng
  //   }
  // } = regionData;

  // const {
  //   address,
  //   lat,
  //   lng,
  //   bounds: {
  //     northEastLat: placeNorthEastLat,
  //     northEastLng: placeNorthEastLng,
  //     southWestLat: placeSouthWestLat,
  //     southWestLng: placeSouthWestLng
  //   }
  // } = placeData;

  // const country = {
  //   country: countryName,
  //   countryNorthEastLat,
  //   countryNorthEastLng,
  //   countrySouthWestLat,
  //   countrySouthWestLng
  // };
  // const region = {
  //   region: regionName,
  //   regionNorthEastLat,
  //   regionNorthEastLng,
  //   regionSouthWestLat,
  //   regionSouthWestLng,
  //   country: countryName,
  //   countryCode
  // };
  // const place = {
  //   address,
  //   lat,
  //   lng,
  //   placeNorthEastLat,
  //   placeNorthEastLng,
  //   placeSouthWestLat,
  //   placeSouthWestLng,
  //   region: regionName,
  //   regionCode,
  //   country: countryName,
  //   countryCode
  // };
  const newPostKey = database
    .ref()
    .child("posts")
    .push().key;
  // let placeKey = getPlaceIdFromLatLng({ lat, lng });
  let updates = {};
  updates[`/posts/${newPostKey}`] = post;

  if (uid) {
    updates[`/user-posts/${uid}/${newPostKey}`] = post;
  }

  if (countryCode) {
    updates[`/country-posts/${countryCode}/${newPostKey}`] = post;
    // updates[`/countries/${countryCode}`] = country;
    // updates[`/user-countries/${uid}/${countryCode}`] = country;
    // updates[`/country-places/${countryCode}/${placeKey}`] = place;
  }

  if (regionCode) {
    updates[`/region-posts/${regionCode}/${newPostKey}`] = post;
    // updates[`/regions/${regionCode}`] = region;
    // updates[`/country-regions/${countryCode}/${regionCode}`] = region;
    // updates[`/region-places/${regionCode}/${placeKey}`] = place;
  }

  if (placeId) {
    // updates[`/places/${placeKey}`] = place;
    // updates[`/user-places/${uid}/${placeKey}`] = place;
    updates[`/place-posts/${placeId}/${newPostKey}`] = post;
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
