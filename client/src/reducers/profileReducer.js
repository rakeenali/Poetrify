import { SET_PROFILE, CLEAR_PROFILE } from "../actions/types";

export default (state = {}, action) => {
  switch (action.type) {
    case SET_PROFILE:
      return {
        ...action.payload
      };
    case CLEAR_PROFILE:
      return {};

    default:
      return state;
  }
};
