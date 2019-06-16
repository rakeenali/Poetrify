import { GET_SEARCH, SET_ERROR } from "./types";
import axios from "axios";

export const getSearch = () => async dispatch => {
  try {
    const res = await axios.get("/api/search");
    dispatch({
      type: GET_SEARCH,
      payload: res.data
    });
  } catch (err) {
    return dispatch({
      type: SET_ERROR,
      payload: err.response.data
    });
  }
};
