import { geocodeByAddress, getLatLng } from "react-places-autocomplete";
import { slugify } from "underscore.string";

export const getLocationData = address => {
  return new Promise((resolve, reject) => {
    let locationData = {};
    geocodeByAddress(address)
      .then(results => {
        console.log(results[0].geometry.viewport.getNorthEast().lat());
        console.log(results[0].geometry.viewport.getNorthEast().lng());
        console.log(results[0].geometry.viewport.getSouthWest().lat());
        console.log(results[0].geometry.viewport.getSouthWest().lng());
        const countryAddressComponent = results[0].address_components.find(
          addressComponent => {
            return addressComponent.types.includes("country") === true;
          }
        );
        const country = countryAddressComponent.long_name;
        const countryCode = countryAddressComponent.short_name;
        locationData.country = country;
        locationData.countryCode = countryCode;
        return results;
      }).then(results => {
        const regionAddressComponent = results[0].address_components.find(
          addressComponent => {
            return addressComponent.types.includes("administrative_area_level_1") === true;
          }
        );
        const region = regionAddressComponent.long_name;
        const regionCode = slugify(`${locationData.countryCode} - ${regionAddressComponent.short_name}`);
        locationData.region = region;
        locationData.regionCode = regionCode;
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