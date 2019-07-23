import { SHOW_TOAST, HIDE_TOAST } from "./types";

export const showToastMessage = message => dispatch => {
  dispatch({
    type: SHOW_TOAST,
    payload: {
      message,
      showToast: true
    }
  });
};

export const hideToastMessage = () => {
  return {
    type: HIDE_TOAST
  };
};
