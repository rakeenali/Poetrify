import { SET_POEM, CLEAR_POEM } from "../actions/types";

export default (state = {}, action) => {
  switch (action.type) {
    case SET_POEM:
      return {
        ...action.payload
      };

    case CLEAR_POEM:
      return {};

    default:
      return {};
  }
};
