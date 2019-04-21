import axios from "axios";

import { SET_POEMS, CLEAR_POEMS, SET_ERROR } from "./types";

export const getManyPoems = (ids, sort = false) => async dispatch => {
  try {
    const res = await axios.post("/api/poem/many", {
      poemIds: ids
    });

    if (sort) {
      const newArray = [];
      ids.forEach(id => {
        res.data.forEach(poem => {
          if (poem._id === id) {
            newArray.push({ ...poem });
          }
        });
      });
      return dispatch({
        type: SET_POEMS,
        payload: newArray
      });
    } else {
      return dispatch({
        type: SET_POEMS,
        payload: res.data
      });
    }
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
