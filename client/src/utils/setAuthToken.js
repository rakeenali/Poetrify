import axios from "axios";

const setAuthToken = token => {
  const bearerToken = `Bearer ${token}`;

  if (token) {
    axios.defaults.headers.common["Authorization"] = bearerToken;
  } else {
    delete axios.defaults.headers.common["Authorization"];
  }
};

export default setAuthToken;
