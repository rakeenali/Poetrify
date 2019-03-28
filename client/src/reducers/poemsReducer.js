import { SET_POEMS, CLEAR_POEMS } from "../actions/types";

import _ from "lodash";

export default (state = {}, action) => {
  switch (action.type) {
    case SET_POEMS:
      // console.log(action.payload);
      return action.payload;

    case CLEAR_POEMS:
      return {};

    default:
      return { ...state };
  }
};
