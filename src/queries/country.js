import database from "./../firebase/firebase";
import {
  fromSnapShotToObject,
  fromSnapShotToArray
} from "./../lib/utils/snapshot";

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
