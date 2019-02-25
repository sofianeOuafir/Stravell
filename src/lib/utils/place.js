export const getPlaceIdFromLatLng = ({ lat, lng }) => {
  if(!lat && !lng){
    return null;
  }
  return (lat.toString() + lng.toString()).replace(/\./g, "").replace(/-/g, "");
}