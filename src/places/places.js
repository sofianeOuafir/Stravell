import { geocodeByAddress, getLatLng } from "react-places-autocomplete";

export const getLocationData = address => {
  return new Promise((resolve, reject) => {
    let locationData = {};
    geocodeByAddress(address)
      .then(results => {
        const countryAddressComponent = results[0].address_components.find(
          addressComponent => {
            return addressComponent.types.includes("country") === true;
          }
        );
        const country = countryAddressComponent.long_name;
        const countryCode = countryAddressComponent.short_name;
        locationData.country = country;
        locationData.countryCode = countryCode;
        // this.setState(() => ({ country, countryCode }));
        return results;
      })
      .then(results => {
        return getLatLng(results[0]);
      })
      .then(latLng => {
        const { lat, lng } = latLng;
        locationData.lat = lat;
        locationData.lng = lng;
        resolve(locationData);
      })
      .catch(error => reject(error));
  });
};