const filtersReducerDefaultState = {
  text: "",
  countryCode: ""
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
        countryCode: action.countryCode
      }
    default:
      return state;
  }
};

export default filtersReducer;
