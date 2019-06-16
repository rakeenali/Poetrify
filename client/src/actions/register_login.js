import axios from "axios";
import jwt from "jsonwebtoken";

import { joinNotification } from "./user_notification";
import { currentUserInfo, clearCurrentUserInfo } from "./currentUserInfo";
import setAuthToken from "../utils/setAuthToken";

import {
  SET_ERROR,
  SET_NOTIFICATION,
  CLEAR_USER,
  SET_CURRENT_USER
} from "./types";

export const registerUser = (
  name,
  email,
  password,
  history
) => async dispatch => {
  try {
    const user = await axios.post("/api/user/register", {
      name,
      email,
      password
    });
    if (user) {
      history.push("/login");
      dispatch({
        type: SET_NOTIFICATION,
        payload: { ...user.data }
      });
    }
  } catch (err) {
    dispatch({
      type: SET_ERROR,
      payload: { ...err.response.data }
    });
  }
};

export const confirmUser = (token, history) => async dispatch => {
  try {
    const user = await axios.get(`/api/user/confirmation/${token}`);
    if (user) {
      history.push("/login");
      dispatch({
        type: SET_NOTIFICATION,
        payload: { ...user.data }
      });
    }
  } catch (err) {
    dispatch({
      type: SET_ERROR,
      payload: { ...err.response.data }
    });
  }
};

export const setCurrentUser = user => {
  return {
    type: SET_CURRENT_USER,
    payload: user
  };
};

export const loginUser = (email, password) => async dispatch => {
  try {
    const user = await axios.post("/api/user/login", { email, password });

    if (user) {
      const { token } = user.data;

      localStorage.setItem("poetrify", token);

      setAuthToken(token);

      const decoded = jwt.decode(token);

      window.location.href = "/profile";

      currentUserInfo();
      joinNotification();

      dispatch(setCurrentUser(decoded));
    }
  } catch (err) {
    dispatch({
      type: SET_ERROR,
      payload: { ...err.response.data }
    });
  }
};

export const resendTokenToEmail = (email, history) => async dispatch => {
  try {
    const user = await axios.post("/api/user/resendtoken", { email });

    if (user) {
      history.push("/login");
      dispatch({ type: SET_NOTIFICATION, payload: { ...user.data } });
    }
  } catch (err) {
    dispatch({
      type: SET_ERROR,
      payload: { ...err.response.data }
    });
  }
};

export const forgetPassword = (email, cb) => async dispatch => {
  try {
    const user = await axios.post("/api/user/forgetpassword", { email });

    if (user) {
      cb();
      dispatch({ type: SET_NOTIFICATION, payload: { ...user.data } });
    }
  } catch (err) {
    dispatch({
      type: SET_ERROR,
      payload: { ...err.response.data }
    });
  }
};

export const resetPassword = (
  token,
  newPassword,
  history
) => async dispatch => {
  try {
    const user = await axios.post(`/api/user/reset/${token}`, { newPassword });

    if (user) {
      history.push("/login");
      dispatch({ type: SET_NOTIFICATION, payload: { ...user.data } });
    }
  } catch (err) {
    dispatch({
      type: SET_ERROR,
      payload: { ...err.response.data }
    });
  }
};

export const changePassword = (oldPassword, newPassword) => async dispatch => {
  try {
    const res = await axios.post("/api/user/resetpassword", {
      oldPassword,
      newPassword
    });
    dispatch({
      type: SET_NOTIFICATION,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: SET_ERROR,
      payload: { ...err.response.data }
    });
  }
};

export const logout = () => dispatch => {
  localStorage.removeItem("poetrify");
  window.location.href = "/login";
  clearCurrentUserInfo();
  dispatch({
    type: CLEAR_USER
  });
};
