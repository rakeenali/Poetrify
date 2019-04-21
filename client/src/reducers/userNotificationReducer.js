import { POEM_NOTIFICATION, MESSAGE_NOTIFICATION } from "../actions/types";

export default (state = {}, action) => {
  switch (action.type) {
    case POEM_NOTIFICATION:
      return {
        ...action.payload
      };

    case MESSAGE_NOTIFICATION:
      return {
        ...action.payload
      };

    default:
      return state;
  }
};
