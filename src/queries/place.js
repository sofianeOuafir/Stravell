import {
  fromSnapShotToObject,
  fromSnapShotToArray
} from "./../lib/utils/snapshot";
import database from "./../firebase/firebase";

export const getAllPlaces = async () => {
  const ref = 'places';
  const places = await getPlaces(ref);
  return places
};

export const getCountryPlaces = async (countryCode) => {
  const ref = `country-places/${countryCode}`;
  const places = await getPlaces(ref);
  return places
};

export const getRegionPlaces = async (regionCode) => {
  const ref = `region-places/${regionCode}`;
  const places = await getPlaces(ref);
  return places
};

export const getUserPlaces = async (uid) => {
  const ref = `user-places/${uid}`;
  const places = await getPlaces(ref);
  return places
};

const getPlaces = async ref => {
  const placeSnapshot = await database
    .ref(ref)
    .once("value")
    .then(snapshot => {
      return snapshot;
    });

  let places = fromSnapShotToArray(placeSnapshot);
  return places;
};

export const getPlace = async id => {
  const snapshot = await database.ref(`places/${id}`).once("value");
  return fromSnapShotToObject(snapshot);
};
