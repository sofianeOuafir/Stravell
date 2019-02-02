const filtersReducerDefaultState = {
  text: ""
};

const filtersReducer = (state = filtersReducerDefaultState, action) => {
  switch (action.type) {
    case "SET_TEXT_FILTER":
      return {
        ...state,
        text: action.text
      };
    case "SET_COUNTRY_FILTER":
      return {
        ...state,
        country: action.country
      }
    default:
      return state;
  }
};

export default filtersReducer;
