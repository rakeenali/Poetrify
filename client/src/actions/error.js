import { SET_ERROR, CLEAR_ERROR } from "./types";

export const setError = error => ({
  type: SET_ERROR,
  payload: {
    message: error
  }
});

export const clearError = () => ({
  type: CLEAR_ERROR
});
