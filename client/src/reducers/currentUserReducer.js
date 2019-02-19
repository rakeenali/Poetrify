import { SET_CURRENT_USER } from "../actions/types";

const INITIAL_STATE = {
  isAuthenticated: false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SET_CURRENT_USER:
      return {
        ...state,
        isAuthenticated: true,
        ...action.payload
      };

    default:
      return state;
  }
};
