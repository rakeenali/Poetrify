import { SET_USERS, CLEAR_USERS } from "../actions/types";
import _ from "lodash";

export default (state = {}, action) => {
  switch (action.type) {
    case SET_USERS:
      const users = _.values(action.payload);
      return users;

    case CLEAR_USERS:
      return {};

    default:
      return { ...state };
  }
};
