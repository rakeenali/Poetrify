import { GET_MESSAGES } from "../actions/types";

export default (state = {}, action) => {
  switch (action.type) {
    case GET_MESSAGES:
      return {
        ...action.payload
      };

    default:
      return state;
  }
};
