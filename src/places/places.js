import { geocodeByAddress } from "react-places-autocomplete";
import { slugify } from "underscore.string";

import { getPlaceIdFromLatLng } from "./../lib/utils/place";

const getCountryData = data => {
  return new Promise(async (resolve, reject) => {
    let countryData = {
      name: null,
      code: null,
      bounds: {
        northEastLat: null,
        northEastLng: null,
        southWestLat: null,
        southWestLng: null
      }
    };

    const countryAddressComponent = data.address_components.find(
      addressComponent => {
        return addressComponent.types.includes("country") === true;
      }
    );

    if (countryAddressComponent) {
      countryData.name = countryAddressComponent.long_name;
      countryData.code = countryAddressComponent.short_name;

      const results = await geocodeByAddress(countryData.name);

      countryData.bounds = {
        northEastLat: results[0].geometry.viewport.getNorthEast().lat(),
        northEastLng: results[0].geometry.viewport.getNorthEast().lng(),
        southWestLat: results[0].geometry.viewport.getSouthWest().lat(),
        southWestLng: results[0].geometry.viewport.getSouthWest().lng()
      };
    }

    resolve(countryData);
  });
};

const getRegionData = ({ data, countryCode }) => {
  return new Promise(async (resolve, reject) => {
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
        `${countryCode} - ${regionAddressComponent.short_name}`
      );
      regionData.name = regionAddressComponent.long_name;
      const results = await geocodeByAddress(`${countryCode} ${regionData.name}`);
      regionData.bounds = {
        northEastLat: results[0].geometry.viewport.getNorthEast().lat(),
        northEastLng: results[0].geometry.viewport.getNorthEast().lng(),
        southWestLat: results[0].geometry.viewport.getSouthWest().lat(),
        southWestLng: results[0].geometry.viewport.getSouthWest().lng()
      };
    }

    resolve(regionData);
  });
};

const getPlaceData = ({ data, address }) => {
  return new Promise(async (resolve, reject) => {
    let placeData = {
      placeId: null,
      address,
      lat: null,
      lng: null,
      bounds: {
        northEastLat: null,
        northEastLng: null,
        southWestLat: null,
        southWestLng: null
      }
    };

    placeData.lat = data.geometry.location.lat();
    placeData.lng = data.geometry.location.lng();
    placeData.placeId = getPlaceIdFromLatLng({ lat: placeData.lat, lng: placeData.lng });

    placeData.bounds = {
      northEastLat: data.geometry.viewport.getNorthEast().lat(),
      northEastLng: data.geometry.viewport.getNorthEast().lng(),
      southWestLat: data.geometry.viewport.getSouthWest().lat(),
      southWestLng: data.geometry.viewport.getSouthWest().lng()
    };

    resolve(placeData);
  });
};
export const getLocationData = address => {
  return new Promise(async (resolve, reject) => {
    let locationData = {
      countryData: {
        name: null,
        code: null,
        bounds: {
          northEastLat: null,
          northEastLng: null,
          southWestLat: null,
          southWestLng: null
        }
      },
      regionData: {
        name: null,
        code: null,
        bounds: {
          northEastLat: null,
          northEastLng: null,
          southWestLat: null,
          southWestLng: null
        }
      },
      placeData: {
        address,
        lat: null,
        lng: null,
        bounds: {
          northEastLat: null,
          northEastLng: null,
          southWestLat: null,
          southWestLng: null
        }
      }
    };
    if (address) {
      const results = await geocodeByAddress(address);
      const data = results[0];
      locationData.countryData = await getCountryData(data);
      locationData.regionData = await getRegionData({
        data,
        countryCode: locationData.countryData.code
      });
      locationData.placeData = await getPlaceData({
        data,
        address
      });
    }

    resolve(locationData);
  });
};
