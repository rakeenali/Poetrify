import axios from "axios";

import { SET_ERROR } from "./types";

export const blockUser = (userId, cb) => async dispatch => {
  try {
    console.log(userId);
    await axios.post(`/api/block/${userId}`);
    cb();
  } catch (err) {
    dispatch({
      type: SET_ERROR,
      payload: err.response.data
    });
  }
};
