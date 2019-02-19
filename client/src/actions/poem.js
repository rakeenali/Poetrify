import axios from "axios";
import { SET_ERROR, SET_POEM, CLEAR_POEM } from "./types";

export const addPoem = (description, history) => async dispatch => {
  try {
    const res = await axios.post("/api/poem", { description });

    history.push(`/poem/${res.data._id}`);
  } catch (err) {
    dispatch({
      type: SET_ERROR,
      payload: err.response.data
    });
  }
};

export const getPoemById = id => async dispatch => {
  try {
    const res = await axios.get(`/api/poem/${id}`);
    return dispatch({
      type: SET_POEM,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: SET_ERROR,
      payload: err.response.data
    });
  }
};

export const updatePoem = (id, fields, history) => async dispatch => {
  try {
    await axios.post(`/api/poem/${id}`, { ...fields });

    history.push(`/poem/${id}`);
  } catch (err) {
    dispatch({
      type: SET_ERROR,
      payload: err.response.data
    });
  }
};

export const deletePoem = id => async dispatch => {
  try {
    await axios.delete(`/api/poem/${id}`);
    window.location.reload();
  } catch (err) {
    dispatch({
      type: SET_ERROR,
      payload: { ...err.response.data, err }
    });
  }
};

export const clearPoem = () => {
  return {
    type: CLEAR_POEM
  };
};
