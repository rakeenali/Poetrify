import { POEM_NOTIFICATION, SET_ERROR, MESSAGE_NOTIFICATION } from "./types";

import axios from "axios";

export const getNotifications = () => async dispatch => {
  try {
    const res = await axios.get("/api/notification/get-notifications");

    dispatch({
      type: POEM_NOTIFICATION,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: SET_ERROR,
      payload: err.response.data
    });
  }
};

export const seenNotification = id => async dispatch => {
  try {
    await axios.delete(`/api/notification/${id}`);
    return;
  } catch (err) {
    dispatch({
      type: SET_ERROR,
      payload: err.response.data
    });
  }
};

export const newMessageNotfification = () => {
  return {
    type: MESSAGE_NOTIFICATION,
    payload: { newMessage: true }
  };
};

export const clearMessageNotification = () => {
  return {
    type: MESSAGE_NOTIFICATION,
    payload: { newMessage: false }
  };
};
