import axios from "axios";

import { SET_ERROR } from "./types";

export const followUser = (id, cb) => async dispatch => {
  try {
    await axios.post(`/api/follow/${id}`);
    cb();
  } catch (err) {
    dispatch({
      type: SET_ERROR,
      payload: err.response.data
    });
  }
};

export const unFollowUser = (id, cb) => async dispatch => {
  try {
    await axios.delete(`/api/follow/${id}`);
    cb();
    return;
  } catch (err) {
    dispatch({
      type: SET_ERROR,
      payload: err.response.data
    });
  }
};
