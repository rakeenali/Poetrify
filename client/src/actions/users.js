import axios from "axios";

import { SET_USERS, CLEAR_USERS, SET_ERROR } from "./types";

export const getUsers = ids => async dispatch => {
  try {
    const res = await axios.post(`/api/user/users`, { userIds: [...ids] });

    dispatch({
      type: SET_USERS,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: SET_ERROR,
      payload: { ...err.response.data }
    });
  }
};

export const clearUsers = () => {
  return {
    type: CLEAR_USERS
  };
};
