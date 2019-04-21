import axios from "axios";

import { SET_ERROR, GET_MESSAGES } from "./types";

export const getMessages = () => async dispatch => {
  try {
    const records = await axios.get("/api/conversation/conversations");

    return dispatch({
      type: GET_MESSAGES,
      payload: records.data
    });
  } catch (err) {
    return dispatch({
      type: SET_ERROR,
      payload: err.response.data
    });
  }
};

export const sendMessage = (message, _id) => async dispatch => {
  try {
    await axios.post("/api/conversation/send-message", {
      _id,
      message
    });

    dispatch(getMessages());
  } catch (err) {
    return dispatch({
      type: SET_ERROR,
      payload: err.response.data
    });
  }
};
