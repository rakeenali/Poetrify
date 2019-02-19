import { combineReducers } from "redux";

import currentUserReducer from "./currentUserReducer";
import notificationReducer from "./notificationReducer";
import errorReducer from "./errorReducer";
import poemReducer from "./poemReducer";
import poemsReducer from "./poemsReducer";
import profileReducer from "./profileReducer";
import usersReducer from "./usersReducer";
import currentUserInfoReducer from "./currentUserInfoReducer";

export default combineReducers({
  CURRENT_USER: currentUserReducer,
  NOTIFICATION: notificationReducer,
  ERROR: errorReducer,
  POEM: poemReducer,
  POEMS: poemsReducer,
  PROFILE: profileReducer,
  USERS: usersReducer,
  CURRENT_USER_INFO: currentUserInfoReducer
});
