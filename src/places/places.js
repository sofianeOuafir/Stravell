import { geocodeByAddress, getLatLng } from "react-places-autocomplete";
import { slugify } from "underscore.string";

const getCountryData = data => {
  return new Promise((resolve, reject) => {
    let countryData = {
      name: null,
      code: null
    };

    const countryAddressComponent = data.address_components.find(
      addressComponent => {
        return addressComponent.types.includes("country") === true;
      }
    );

    if (countryAddressComponent) {
      countryData.name = countryAddressComponent.long_name;
      countryData.code = countryAddressComponent.short_name;
    }

    resolve(countryData);
  });
};

const getRegionData = data => {
  return new Promise(async (resolve, reject) => {
    const countryData = await getCountryData(data);
    let regionData = {
      name: null,
      code: null,
      bounds: {
        northEastLat: null,
        northEastLng: null,
        southWestLat: null,
        southWestLng: null
      }
    };
    const regionAddressComponent = data.address_components.find(
      addressComponent => {
        return (
          addressComponent.types.includes("administrative_area_level_1") ===
          true
        );
      }
    );
    if (regionAddressComponent) {
      regionData.code = slugify(
        `${countryData.code} - ${regionAddressComponent.short_name}`
      );
      regionData.name = regionAddressComponent.long_name;
      regionData.bounds = {
        northEastLat: data.geometry.viewport.getNorthEast().lat(),
        northEastLng: data.geometry.viewport.getNorthEast().lng(),
        southWestLat: data.geometry.viewport.getSouthWest().lat(),
        southWestLng: data.geometry.viewport.getSouthWest().lng()
      };
    }

    resolve(regionData);
  });
};

const getLatLngData = data => {
  return new Promise(async (resolve, reject) => {
    let latLngData = {
      lat: null,
      lng: null
    };
    const latLng = await getLatLng(data);
    if (latLng) {
      latLngData.lat = latLng.lat;
      latLngData.lng = latLng.lng;
    }

    resolve(latLngData);
  });
};
export const getLocationData = address => {
  return new Promise(async (resolve, reject) => {
    let locationData = { address };
    const results = await geocodeByAddress(address);
    const data = results[0];
    locationData.country = await getCountryData(data);
    locationData.region = await getRegionData(data);
    const latLng = await getLatLngData(data);
    locationData.lat = latLng.lat;
    locationData.lng = latLng.lng;
    resolve(locationData);
  });
};
