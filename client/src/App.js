import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";
import { Provider } from "react-redux";
import jwt_decode from "jsonwebtoken/decode";
import axios from "axios";

import "./App.css";

import store from "./store";
import setAuthToken from "./utils/setAuthToken";
import { setCurrentUser } from "./actions/register_login";
import { currentUserInfo } from "./actions/currentUserInfo";

import Navbar from "./components/navbar/Navbar";
import Register from "./components/registration-login/Register";
import Confirmation from "./components/registration-login/Confirmation";
import Login from "./components/registration-login/Login";
import ResetPassword from "./components/registration-login/ResetPassword";
import Profile from "./components/profile/Profile";
import AddPoem from "./components/poems/operations/AddPoem";
import UpdatePoem from "./components/poems/operations/UpdatePoem";
import SinglePoem from "./components/poems/poem/SinglePoem";
import Handle from "./components/handle/Handle";
import NotFound from "./components/error/NotFound";

if (localStorage.getItem("poetrify")) {
  const decoded = jwt_decode(localStorage.getItem("poetrify"));
  setAuthToken(localStorage.getItem("poetrify"));
  store.dispatch(setCurrentUser(decoded));
  store.dispatch(currentUserInfo());

  const currentTime = Date.now() / 1000;
  if (decoded.exp < currentTime) {
    localStorage.removeItem("poetrify");
    window.location.href = "/login";
  }
}

window.axios = axios;

class App extends Component {
  render() {
    const { isAuthenticated } = store.getState().CURRENT_USER;
    return (
      <Provider store={store}>
        <Router>
          <React.Fragment>
            <Navbar />
            <div id="main-area">
              <Switch>
                {isAuthenticated ? (
                  <Redirect exact from="/" to="/profile" />
                ) : (
                  <Redirect exact from="/" to="/login" />
                )}
                <Route exact path="/register" component={Register} />
                <Route
                  exact
                  path="/confirmation/:token"
                  component={Confirmation}
                />
                <Route exact path="/login" component={Login} />
                <Route exact path="/reset/:token" component={ResetPassword} />
                <Route exact path="/add-poem" component={AddPoem} />
                <Route exact path="/update-poem/:id" component={UpdatePoem} />
                <Route exact path="/poem/:id" component={SinglePoem} />
                <Route exact path="/profile" component={Profile} />
                <Route exact path="/profile/:handle" component={Handle} />
                <Route path="*" component={NotFound} />
              </Switch>
            </div>
          </React.Fragment>
        </Router>
      </Provider>
    );
  }
}

export default App;
