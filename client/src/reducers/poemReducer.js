import { SET_POEM } from "../actions/types";

export default (state = {}, action) => {
  switch (action.type) {
    case SET_POEM:
      return {
        ...action.payload
      };
    default:
      return {};
  }
};
