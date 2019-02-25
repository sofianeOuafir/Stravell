import database from "./../firebase/firebase";
import {
  fromSnapShotToObject,
  fromSnapShotToArray
} from "./../lib/utils/snapshot";

export const addCountry = ({ countryData = {}, userData = {} }) => {
  const {
    countryCode,
    country: countryName,
    countryNorthEastLat,
    countryNorthEastLng,
    countrySouthWestLat,
    countrySouthWestLng
  } = countryData;

  const { uid } = userData;

  const country = {
    country: countryName,
    countryNorthEastLat,
    countryNorthEastLng,
    countrySouthWestLat,
    countrySouthWestLng
  };

  let updates = {};

  if (countryCode) {
    updates[`/countries/${countryCode}`] = country;
    if (uid) {
      updates[`/user-countries/${uid}/${countryCode}`] = country;
    }
  }

  return database
    .ref()
    .update(updates)
    .catch(e => console.log(e));
};

export const getCountries = async ({ uid } = {}) => {
  const ref = uid ? `user-countries/${uid}` : "countries";
  const countrySnapshot = await database
    .ref(ref)
    .orderByChild("country")
    .once("value")
    .then(snapshot => {
      return snapshot;
    });

  return fromSnapShotToArray(countrySnapshot);
};

export const getCountry = async countryCode => {
  const countrySnapshot = await database
    .ref(`/countries/${countryCode}`)
    .once("value")
    .then(snapshot => {
      return snapshot;
    });

  return fromSnapShotToObject(countrySnapshot);
};
