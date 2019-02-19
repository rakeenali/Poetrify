import axios from "axios";

import { SET_ERROR } from "./types";

export const addComment = (id, description, cb) => async dispatch => {
  try {
    await axios.post(`/api/comment/${id}`, { description });
    cb();
  } catch (err) {
    dispatch({
      type: SET_ERROR,
      payload: err.response.data
    });
  }
};

export const deleteComment = (poemId, commentId, cb) => async dispatch => {
  try {
    await axios.delete(`/api/comment/${poemId}/${commentId}`);
    cb();
  } catch (err) {
    dispatch({
      type: SET_ERROR,
      payload: err.response.data
    });
  }
};
