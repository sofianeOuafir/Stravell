import {
  fromSnapShotToObject,
  fromSnapShotToArray
} from "./../lib/utils/snapshot";
import database from "./../firebase/firebase";

export const getPlaces = async () => {
  const placeSnapshot = await database
    .ref("places")
    .once("value")
    .then(snapshot => {
      return snapshot;
    });

  let places = fromSnapShotToArray(placeSnapshot);
  return places
};

export const getPlace = async (id) => {
  const snapshot = await database.ref(`places/${id}`).once("value");
  return fromSnapShotToObject(snapshot);
}
