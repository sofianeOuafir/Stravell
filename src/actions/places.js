export const setPlaces = places => dispatch => {
  return dispatch({
    type: "SET_PLACES",
    places
  });
};
