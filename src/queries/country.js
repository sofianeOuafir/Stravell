import database from "./../firebase/firebase";

export const getCountries = async ({uid} = {}) => {
  const ref = uid ? `users/${uid}/countries` : 'countries';
  const countrySnapshot = await database
    .ref(ref)
    .orderByChild("country")
    .once("value")
    .then(snapshot => {
      return snapshot;
    });

  let countries = [];
  countrySnapshot.forEach(snapshotChild => {
    countries.push({
      id: snapshotChild.key,
      ...snapshotChild.val()
    });
  });

  return countries;
};

export const getCountry = async (countryCode) => {
  const countrySnapshot = await database
    .ref(`/countries/${countryCode}`)
    .once("value")
    .then(snapshot => {
      return snapshot;
    });

  return { id: countrySnapshot.key, ...countrySnapshot.val() }
};

