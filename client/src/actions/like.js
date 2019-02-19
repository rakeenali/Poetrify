import { SET_ERROR } from "./types";

import axios from "axios";

export const addLike = (id, cb) => async dispatch => {
  try {
    await axios.post(`/api/like/${id}`);
    cb();
  } catch (err) {
    dispatch({
      type: SET_ERROR,
      payload: err.response.data
    });
  }
};

export const removeLike = (id, cb) => async dispatch => {
  try {
    await axios.delete(`/api/like/${id}`);
    cb();
  } catch (err) {
    dispatch({
      type: SET_ERROR,
      payload: err.response.data
    });
  }
};
