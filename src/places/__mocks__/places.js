export const getLocationData = () => {
  return Promise.resolve({
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
      placeId: null,
      address: null,
      lat: null,
      lng: null,
      bounds: {
        northEastLat: null,
        northEastLng: null,
        southWestLat: null,
        southWestLng: null
      }
    }
  });
};
