import database from "./../firebase/firebase";
import {
  fromSnapShotToObject,
  fromSnapShotToArray
} from "./../lib/utils/snapshot";

export const addRegion = ({ regionData, countryData }) => {
  const { countryCode, country: countryName } = countryData;
  const {
    regionCode,
    region: regionName,
    regionNorthEastLat,
    regionNorthEastLng,
    regionSouthWestLat,
    regionSouthWestLng
  } = regionData;

  const region = {
    region: regionName,
    regionNorthEastLat,
    regionNorthEastLng,
    regionSouthWestLat,
    regionSouthWestLng,
    countryCode,
    country: countryName
  };

  let updates = {};

  updates[`/regions/${regionCode}`] = region;
  updates[`/country-regions/${countryCode}/${regionCode}`] = region;

  return database
    .ref()
    .update(updates)
    .catch(e => console.log(e));
};

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
