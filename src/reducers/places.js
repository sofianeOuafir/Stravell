const placesReducer = (state = [], action) => {
  switch (action.type) {
    case "SET_PLACES":
      return [...action.places];
    default:
      return state;
  }
};

export default placesReducer;