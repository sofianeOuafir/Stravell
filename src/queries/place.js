import {
  fromSnapShotToObject,
  fromSnapShotToArray
} from "./../lib/utils/snapshot";
import database from "./../firebase/firebase";

export const addPlace = ({ countryData, placeData, regionData, userData }) => {
  const {
    placeId,
    address,
    lat,
    lng,
    placeNorthEastLat,
    placeNorthEastLng,
    placeSouthWestLat,
    placeSouthWestLng
  } = placeData;

  const { countryCode, country } = countryData;
  const { regionCode, region } = regionData;
  const { uid } = userData;

  const place = {
    address,
    lat,
    lng,
    placeNorthEastLat,
    placeNorthEastLng,
    placeSouthWestLat,
    placeSouthWestLng,
    region,
    regionCode,
    country,
    countryCode
  };

  let updates = {};
  if (placeId) {
    updates[`/places/${placeId}`] = place;
    if (countryCode) {
      updates[`/country-places/${countryCode}/${placeId}`] = place;
    }
    if (regionCode) {
      updates[`/region-places/${regionCode}/${placeId}`] = place;
    }
    if (uid) {
      updates[`/user-places/${uid}/${placeId}`] = place;
    }
  }

  return database
    .ref()
    .update(updates)
    .catch(e => console.log(e));
};

export const getAllPlaces = async () => {
  const ref = "places";
  const places = await getPlaces(ref);
  return places;
};

export const getCountryPlaces = async countryCode => {
  const ref = `country-places/${countryCode}`;
  const places = await getPlaces(ref);
  return places;
};

export const getRegionPlaces = async regionCode => {
  const ref = `region-places/${regionCode}`;
  const places = await getPlaces(ref);
  return places;
};

export const getUserPlaces = async uid => {
  const ref = `user-places/${uid}`;
  const places = await getPlaces(ref);
  return places;
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
