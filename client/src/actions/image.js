import FormData from "form-data";
import axios from "axios";

import { SET_ERROR } from "./types";

export const addImage = image => async dispatch => {
  try {
    let data = new FormData();
    data.append("profileImage", image);

    await axios.post("/api/image/profile", data, {
      headers: {
        "Content-Type": image.type
      }
    });
  } catch (err) {
    dispatch({
      type: SET_ERROR,
      payload: err.response.data
    });
  }
};

export const addGroupImage = (image, id, cb) => async dispatch => {
  try {
    let data = new FormData();
    data.append("groupImage", image);

    await axios.post(`/api/image/group/${id}`, data, {
      headers: {
        "Content-Type": image.type
      }
    });
    cb();
  } catch (err) {
    dispatch({
      type: SET_ERROR,
      payload: err.response.data
    });
  }
};
