import { SHOW_TOAST, HIDE_TOAST } from "../actions/types";

const INITIAL_STATE = {
  showToast: false,
  message: ""
};

export default function(state = INITIAL_STATE, action) {
  const { type, payload } = action;

  switch (type) {
    case SHOW_TOAST:
      return {
        ...state,
        ...payload
      };
    case HIDE_TOAST:
      return {
        ...INITIAL_STATE
      };
    default:
      return state;
  }
}
