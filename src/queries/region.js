import database from "./../firebase/firebase";
import {
  fromSnapShotToObject,
  fromSnapShotToArray
} from "./../lib/utils/snapshot";

export const getRegion = async regionCode => {
  const regionSnapshot = await database
    .ref(`/regions/${regionCode}`)
    .once("value")
    .then(snapshot => {
      return snapshot;
    });

  return fromSnapShotToObject(regionSnapshot);
};

export const getCountryRegions = async countryCode => {
  const ref = `country-regions/${countryCode}`;
  const regions = await getRegions(ref);
  return regions;
};

const getRegions = async ref => {
  const regionSnapshot = await database
    .ref(ref)
    .once("value")
    .then(snapshot => {
      return snapshot;
    });

  return fromSnapShotToArray(regionSnapshot);
};
