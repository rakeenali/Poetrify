import { CURRENT_USER_INFO, CLEAR_CURRENT_USER_INFO } from "../actions/types";

export default (state = {}, action) => {
  switch (action.type) {
    case CURRENT_USER_INFO:
      return {
        ...action.paylaod
      };

    case CLEAR_CURRENT_USER_INFO:
      return {};

    default:
      return state;
  }
};
