export const setMapVisibility = visible => dispatch => {
  return dispatch({
    type: "SET_MAP_VISIBILITY",
    visible
  });
};
