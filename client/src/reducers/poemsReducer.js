import { SET_POEMS, CLEAR_POEMS } from "../actions/types";

import _ from "lodash";

export default (state = {}, action) => {
  switch (action.type) {
    case SET_POEMS:
      const poems = _.values(action.payload);
      return poems;

    case CLEAR_POEMS:
      return {};

    default:
      return { ...state };
  }
};
