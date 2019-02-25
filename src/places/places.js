import { geocodeByAddress } from "react-places-autocomplete";
import { slugify } from "underscore.string";

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
      const results = await geocodeByAddress(regionData.name);
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
      country: {
        name: null,
        code: null,
        bounds: {
          northEastLat: null,
          northEastLng: null,
          southWestLat: null,
          southWestLng: null
        }
      },
      region: {
        name: null,
        code: null,
        bounds: {
          northEastLat: null,
          northEastLng: null,
          southWestLat: null,
          southWestLng: null
        }
      },
      place: {
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
      locationData.country = await getCountryData(data);
      locationData.region = await getRegionData({
        data,
        countryCode: locationData.country.code
      });
      locationData.place = await getPlaceData({
        data,
        address
      });
    }

    resolve(locationData);
  });
};
