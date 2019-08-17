import database from "./../firebase/firebase";
import {
  fromSnapShotToObject,
  fromSnapShotToArray
} from "./../lib/utils/snapshot";
import { getPlaceIdFromLatLng } from "./../lib/utils/place";

export const editPost = async ({
  postBeforeUpdate,
  post,
  country = null,
  place = null,
  region = null
}) => {
  const {
    uid,
    countryCode: newCountryCode,
    regionCode: newRegionCode,
    placeId: newPlaceId
  } = post;
  const {
    id,
    countryCode: formerCountryCode,
    regionCode: formerRegionCode,
    placeId: formerPlaceId
  } = postBeforeUpdate;
  let updates = {};

  updates[`/posts/${id}`] = post;

  if (uid) {
    updates[`/user-posts/${uid}/${id}`] = post;
  }

  // if countryCode has changed, remove former country from list of countries for
  // this user if not writing about this country in other post
  // also, add new country in list of countries for this user
  if (uid && formerCountryCode && newCountryCode !== formerCountryCode) {
    const snapshot = await database
      .ref(`/user-posts/${uid}`)
      .orderByChild("countryCode")
      .equalTo(formerCountryCode)
      .limitToFirst(2)
      .once("value");
    const posts = fromSnapShotToArray(snapshot);
    if (posts.length !== 2) {
      updates[`/user-countries/${uid}/${formerCountryCode}`] = null;
    }
    updates[`/country-posts/${formerCountryCode}/${id}`] = null;
  }
  if (uid && formerPlaceId && newPlaceId !== formerPlaceId) {
    const snapshot = await database
      .ref(`/user-posts/${uid}`)
      .orderByChild("placeId")
      .equalTo(formerPlaceId)
      .limitToFirst(2)
      .once("value");
    const posts = fromSnapShotToArray(snapshot);
    if (posts.length !== 2) {
      updates[`/user-places/${uid}/${formerPlaceId}`] = null;
    }
  }

  if (newCountryCode) {
    // update post
    updates[`/country-posts/${newCountryCode}/${id}`] = post;
    // create or update new country
    updates[`/countries/${newCountryCode}`] = country;
    updates[`/user-countries/${uid}/${newCountryCode}`] = country;
  }

  if (newRegionCode) {
    updates[`/region-posts/${newRegionCode}/${id}`] = post;
    updates[`/regions/${newRegionCode}`] = region;
    if (newCountryCode) {
      updates[`country-regions/${newCountryCode}/${newRegionCode}`] = region;
    }
  }

  if (formerRegionCode && newRegionCode !== formerRegionCode) {
    updates[`/region-posts/${formerRegionCode}/${id}`] = null;
  }

  if (newPlaceId) {
    if (newCountryCode) {
      updates[`/country-places/${newCountryCode}/${newPlaceId}`] = place;
    }

    if (newRegionCode) {
      updates[`region-places/${newRegionCode}/${newPlaceId}`] = place;
    }

    updates[`/place-posts/${newPlaceId}/${id}`] = post;
    updates[`/places/${newPlaceId}`] = place;

    if(uid) {
      updates[`user-places/${uid}/${newPlaceId}`] = place;
    }
  }

  if (formerPlaceId && newPlaceId !== formerPlaceId) {
    updates[`/place-posts/${formerPlaceId}/${id}`] = null;
  }

  // if (postBeforeUpdate.countryCode && postBeforeUpdate.countryCode !== post.countryCode) {
  //   updates[`/country-posts/${postBeforeUpdate.countryCode}/${id}`] = null;
  //   if (uid) {
  //     const snapshot = await database
  //       .ref(`/user-posts/${uid}`)
  //       .orderByChild("countryCode")
  //       .equalTo(countryCode)
  //       .limitToFirst(2)
  //       .once("value");
  //     const posts = fromSnapShotToArray(snapshot);
  //     if (posts.length !== 2) {
  //       updates[`/user-countries/${uid}/${countryCode}`] = null;
  //     }
  //   }
  // }

  // if (regionCode) {
  //   const snapshot = await database
  //     .ref(`/posts`)
  //     .orderByChild("regionCode")
  //     .equalTo(regionCode)
  //     .limitToFirst(2)
  //     .once("value");
  //   const posts = fromSnapShotToArray(snapshot);
  //   if (posts.length !== 2) {
  //     updates[`/regions/${regionCode}`] = null;
  //   }

  //   updates[`/region-posts/${regionCode}/${id}`] = null;
  //   if (countryCode) {
  //     const snapshot = await database
  //       .ref(`/country-posts/${countryCode}`)
  //       .orderByChild("regionCode")
  //       .equalTo(regionCode)
  //       .limitToFirst(2)
  //       .once("value");
  //     const posts = fromSnapShotToArray(snapshot);
  //     if (posts.length !== 2) {
  //       updates[`/country-regions/${countryCode}/${regionCode}`] = null;
  //     }
  //   }
  // }

  // if (placeId) {
  //   const snapshot = await database
  //     .ref(`/posts`)
  //     .orderByChild("placeId")
  //     .equalTo(placeId)
  //     .limitToFirst(2)
  //     .once("value");
  //   const posts = fromSnapShotToArray(snapshot);
  //   if (posts.length !== 2) {
  //     updates[`/places/${placeId}`] = null;
  //   }

  //   updates[`/place-posts/${placeId}/${id}`] = null;
  //   if (countryCode) {
  //     const snapshot = await database
  //       .ref(`/country-posts/${countryCode}`)
  //       .orderByChild("placeId")
  //       .equalTo(placeId)
  //       .limitToFirst(2)
  //       .once("value");
  //     const posts = fromSnapShotToArray(snapshot);
  //     if (posts.length !== 2) {
  //       updates[`/country-places/${countryCode}/${placeId}`] = null;
  //     }
  //   }
  //   if (regionCode) {
  //     const snapshot = await database
  //       .ref(`/region-posts/${regionCode}`)
  //       .orderByChild("placeId")
  //       .equalTo(placeId)
  //       .limitToFirst(2)
  //       .once("value");

  //     if (posts.length !== 2) {
  //       updates[`/region-places/${regionCode}/${placeId}`] = null;
  //     }
  //   }
  //   if (uid) {
  //     const snapshot = await database
  //       .ref(`/user-posts/${uid}`)
  //       .orderByChild("placeId")
  //       .equalTo(placeId)
  //       .limitToFirst(2)
  //       .once("value");
  //     const posts = fromSnapShotToArray(snapshot);
  //     if (posts.length !== 2) {
  //       updates[`/user-places/${uid}/${placeId}`] = null;
  //     }
  //   }
  // }

  return database
    .ref()
    .update(updates)
    .catch(e => console.log(e));
};

export const addPost = ({
  post,
  country = {},
  user,
  place = {},
  region = {},
  addToTweetQueue = false
}) => {
  const { uid } = user;
  const { countryCode, ...countryData } = country;
  const { regionCode, ...regionData } = region;
  const { placeId, ...placeData } = place;

  const postId = database
    .ref()
    .child("posts")
    .push().key;
  let updates = {};
  updates[`/posts/${postId}`] = post;
  if (addToTweetQueue) {
    updates[`/tweetQueue-posts/${postId}`] = post;
  }

  if (uid) {
    updates[`/user-posts/${uid}/${postId}`] = post;
  }

  if (countryCode) {
    updates[`/countries/${countryCode}`] = countryData;
    updates[`/country-posts/${countryCode}/${postId}`] = post;
    if (uid) {
      updates[`/user-countries/${uid}/${countryCode}`] = countryData;
    }
  }

  if (regionCode) {
    updates[`/regions/${regionCode}`] = regionData;
    updates[`/region-posts/${regionCode}/${postId}`] = post;
    if (countryCode) {
      updates[`/country-regions/${countryCode}/${regionCode}`] = regionData;
    }
  }

  if (placeId) {
    updates[`/places/${placeId}`] = placeData;
    updates[`/place-posts/${placeId}/${postId}`] = post;
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

export const getCountryPosts = async ({
  countryCode,
  onlyPublished = true,
  limit = null
}) => {
  const ref = `country-posts/${countryCode}`;
  const posts = await getPosts({
    ref,
    onlyPublished,
    limit
  });
  return posts;
};

export const getRegionPosts = async ({
  regionCode,
  onlyPublished = true,
  limit = null
}) => {
  const ref = `region-posts/${regionCode}`;
  const posts = await getPosts({
    ref,
    onlyPublished,
    limit
  });
  return posts;
};

export const getUserPosts = async ({
  uid,
  onlyPublished = true,
  limit = null
}) => {
  const ref = `user-posts/${uid}`;
  const posts = await getPosts({
    ref,
    onlyPublished,
    limit
  });
  return posts;
};

export const getPlacePosts = async ({
  id,
  limit = null,
  onlyPublished = true
}) => {
  const ref = `place-posts/${id}`;
  const posts = await getPosts({
    ref,
    onlyPublished,
    limit
  });
  return posts;
};

export const getAllPosts = async ({
  limit = null,
  onlyPublished = true
} = {}) => {
  const ref = `posts`;
  const posts = await getPosts({
    ref,
    limit,
    onlyPublished
  });
  return posts;
};

const getPosts = async (
  { ref, limit = null, onlyPublished = true } = {
    limit: null,
    onlyPublished: true
  }
) => {
  let postSnapshot;
  if (limit) {
    if (onlyPublished) {
      postSnapshot = await database
        .ref(ref)
        .limitToLast(limit)
        .orderByChild("published")
        .equalTo(true)
        .once("value")
        .then(snapshot => {
          return snapshot;
        });
    } else {
      postSnapshot = await database
        .ref(ref)
        .limitToLast(limit)
        .once("value")
        .then(snapshot => {
          return snapshot;
        });
    }
  } else {
    if (onlyPublished) {
      postSnapshot = await database
        .ref(ref)
        .orderByChild("published")
        .equalTo(true)
        .once("value")
        .then(snapshot => {
          return snapshot;
        });
    } else {
      postSnapshot = await database
        .ref(ref)
        .once("value")
        .then(snapshot => {
          return snapshot;
        });
    }
  }

  let posts = fromSnapShotToArray(postSnapshot);
  return posts.reverse();
};
