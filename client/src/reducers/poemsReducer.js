import { SET_POEMS, CLEAR_POEMS } from "../actions/types";

export default (state = {}, action) => {
  switch (action.type) {
    case SET_POEMS:
      return action.payload;

    case CLEAR_POEMS:
      return {};

    default:
      return { ...state };
  }
};
