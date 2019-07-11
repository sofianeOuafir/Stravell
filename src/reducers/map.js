const mapReducerDefaultState = {
  visible: true
};

const mapReducer = (state = mapReducerDefaultState, action) => {
  switch (action.type) {
    case "SET_MAP_VISIBILITY":
      return {
        ...state,
        visible: action.visible
      };
    default:
      return state;
  }
};

export default mapReducer;
