import axios from "axios";
import shuffle from "lodash/shuffle";

import { SET_ERROR, GET_LOGGED_IN_GROUPS, GET_SINGLE_GROUP } from "./types";

export const getAllGroups = () => async dispatch => {
  try {
    const res = await axios.get("/api/group/all");
    const groups = shuffle(res.data).slice(0, 5);
    dispatch({
      type: GET_LOGGED_IN_GROUPS,
      payload: groups
    });
  } catch (err) {
    dispatch({
      type: SET_ERROR,
      payload: err.response.data
    });
  }
};

export const createGroup = (data, cb) => async dispatch => {
  try {
    const res = await axios.post("/api/group/create", data);
    if (res.data) {
      cb(res.data._id);
    }
    return;
  } catch (err) {
    dispatch({
      type: SET_ERROR,
      payload: err.response.data
    });
  }
};

export const getLoggedInGroups = () => async dispatch => {
  try {
    const res = await axios.get("/api/group/current");
    dispatch({
      type: GET_LOGGED_IN_GROUPS,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: SET_ERROR,
      payload: err.response.data
    });
  }
};

export const getSingleGroup = _id => async dispatch => {
  try {
    const res = await axios.get(`/api/group/single/${_id}`);
    dispatch({
      type: GET_SINGLE_GROUP,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: SET_ERROR,
      payload: err.response.data
    });
  }
};

export const addUserRequest = (groupId, userIds, cb) => async dispatch => {
  try {
    Promise.all(
      userIds.map(async id => {
        await axios.get(`/api/group/request/${groupId}/${id}`);
      })
    );
    cb();
  } catch (err) {
    dispatch({
      type: SET_ERROR,
      payload: err.response.data
    });
  }
};

export const sendJoinRequest = (groupId, cb) => async dispatch => {
  try {
    const res = await axios.get(`/api/group/request/${groupId}`);

    if (res.data) {
      cb();
    }
  } catch (err) {
    dispatch({
      type: SET_ERROR,
      payload: err.response.data
    });
  }
};

export const addMemberToGroup = (groupId, userIds, cb) => async dispatch => {
  try {
    // const res = await axios.get(`/api/group/add-member/${groupId}/${userId}`);

    // if (res.data) {
    //   cb();
    // }
    Promise.all(
      userIds.map(async id => {
        await axios.get(`/api/group/add-member/${groupId}/${id}`);
      })
    );
    cb();
  } catch (err) {
    dispatch({
      type: SET_ERROR,
      payload: err.response.data
    });
  }
};

export const removeMemberFromGroup = (
  groupId,
  userId,
  cb
) => async dispatch => {
  try {
    const res = await axios.delete(
      `/api/group/delete-member/${groupId}/${userId}`
    );

    if (res.data) {
      cb();
    }
  } catch (err) {
    dispatch({
      type: SET_ERROR,
      payload: err.response.data
    });
  }
};

export const addPoemToGroup = (groupId, description, cb) => async dispatch => {
  try {
    const res = await axios.post(`/api/group/write-poem/${groupId}`, {
      description
    });

    if (res.data) {
      cb();
    }
  } catch (err) {
    dispatch({
      type: SET_ERROR,
      payload: err.response.data
    });
  }
};

export const deleteGroup = (groupId, cb) => async dispatch => {
  try {
    const res = await axios.delete(`/api/group/delete/${groupId}`);
    if (res.data) {
      cb();
    }
  } catch (err) {
    dispatch({
      type: SET_ERROR,
      payload: err.response.data
    });
  }
};

export const leaveGroup = (groupId, cb) => async dispatch => {
  try {
    const res = await axios.delete(`/api/group/delete-current/${groupId}`);

    if (res.data) {
      cb();
    }
  } catch (err) {
    dispatch({
      type: SET_ERROR,
      payload: err.response.data
    });
  }
};
