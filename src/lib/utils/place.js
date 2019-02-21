export const getPlaceIdFromLatLng = ({ lat, lng }) => {
  return (lat.toString() + lng.toString()).replace(/\./g, "").replace(/-/g, "");
}