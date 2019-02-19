import FormData from "form-data";
import axios from "axios";

import { SET_ERROR } from "./types";

export const addImage = (image, cb) => async dispatch => {
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
