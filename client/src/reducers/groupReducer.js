import { GET_LOGGED_IN_GROUPS, GET_SINGLE_GROUP } from "../actions/types";

const initialState = {
  groups: [],
  group: {}
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_LOGGED_IN_GROUPS:
      return {
        ...state,
        groups: action.payload
      };
    case GET_SINGLE_GROUP:
      return {
        ...state,
        group: action.payload
      };
    default:
      return state;
  }
};
