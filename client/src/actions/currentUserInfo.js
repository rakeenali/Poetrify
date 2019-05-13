import { CURRENT_USER_INFO, CLEAR_CURRENT_USER_INFO, SET_ERROR } from "./types";

import axios from "axios";

export const currentUserInfo = () => async dispatch => {
  try {
    const user = await axios.get("/api/user/current");
    dispatch({
      type: CURRENT_USER_INFO,
      payload: user.data
    });
  } catch (err) {
    dispatch({
      type: SET_ERROR,
      payload: err.response.data
    });
  }
};

export const clearCurrentUserInfo = () => {
  return {
    type: CLEAR_CURRENT_USER_INFO
  };
};
