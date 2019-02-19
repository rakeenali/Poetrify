import { SET_PROFILE, CLEAR_PROFILE, SET_ERROR } from "./types";

import axios from "axios";

export const loggedInProfile = () => async dispatch => {
  try {
    const profile = await axios.get("/api/profile");
    return dispatch({
      type: SET_PROFILE,
      payload: profile.data
    });
  } catch (err) {
    return dispatch({
      type: SET_ERROR,
      payload: err.response.data
    });
  }
};

export const addProfile = fields => async dispatch => {
  try {
    await axios.post("/api/profile", fields);
    window.location.reload();
  } catch (err) {
    return dispatch({
      type: SET_ERROR,
      payload: { ...err.response.data }
    });
  }
};

export const profileByHandle = handle => async dispatch => {
  try {
    const res = await axios.get(`/api/profile/handle/${handle}`);

    return dispatch({
      type: SET_PROFILE,
      payload: res.data
    });
  } catch (err) {
    return dispatch({
      type: SET_ERROR,
      payload: err.response.data
    });
  }
};

export const clearProfile = () => {
  return {
    type: CLEAR_PROFILE
  };
};
