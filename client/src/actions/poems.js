import axios from "axios";

import { SET_POEMS, CLEAR_POEMS, SET_ERROR } from "./types";

export const getMantPoems = ids => async dispatch => {
  try {
    const res = await axios.post("/api/poem/many", {
      poemIds: ids
    });
    return dispatch({
      type: SET_POEMS,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: SET_ERROR,
      payload: err.response.data
    });
  }
};

export const clearPoems = () => {
  return {
    type: CLEAR_POEMS
  };
};
