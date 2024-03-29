import Router from "next/router";
import { compose, withProps } from "recompose";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker
} from "react-google-maps";
import { slugify } from "underscore.string";

const GoogleMaps = compose(
  withProps({
    googleMapURL:
      `https://maps.googleapis.com/maps/api/js?key=${process.env.GOOGLE_MAPS_API_KEY}&v=3.exp&libraries=geometry,drawing,places`,
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `450px`, width: "100%" }} />,
    mapElement: <div style={{ height: `100%` }} />
  }),
  withScriptjs,
  withGoogleMap
)(({ showWholeWorld = false, southWestLat, southWestLng, northEastLat, northEastLng, isMarkerShown, places }) => {
  let defaultZoom;
  let defaultCenter;
  if (showWholeWorld) {
    defaultZoom = 2;
    defaultCenter = { lat: 30, lng: 0 };
  } else {
    const bounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(southWestLat, southWestLng),
      new google.maps.LatLng(northEastLat, northEastLng)
    );
    defaultCenter = bounds.getCenter();
    const pixelWidth = 400;
    const GLOBE_WIDTH = 256; // a constant in Google's map projection
    const west = southWestLng;
    const east = northEastLng;
    let angle = east - west;
    if (angle < 0) {
      angle += 360;
    }
    const zoom = Math.round(
      Math.log((pixelWidth * 360) / angle / GLOBE_WIDTH) / Math.LN2
    );
    defaultZoom = zoom;
  }

  return (
    <GoogleMap
      defaultOptions={{ streetViewControl: false, mapTypeControl: false }}
      defaultZoom={defaultZoom}
      defaultCenter={defaultCenter}
    >
      {isMarkerShown &&
        places.map((place, index) => {
          const { lat, lng } = place;
          return (
            <Marker
              onClick={() => redirectToPlacePage(place)}
              key={index}
              position={{ lat, lng }}
            />
          );
        })}
    </GoogleMap>
  );
});

const redirectToPlacePage = place => {
  const { id, country, regionCode, address } = place;
  Router.push(`/place?id=${id}`, `/place/${slugify(address)}/${id}`);
};

export default GoogleMaps;
