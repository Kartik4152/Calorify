//dependencies
import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { message } from "antd";
//styles
import "./App.scss";
//components
import Hero from "./components/Hero/Hero";
import Login from "./components/Login/Login";
import Signup from "./components/Signup/Signup";
import Home from "./components/Home/Home";
import Profile from "./components/Profile/Profile";
import ErrorPage from "./components/ErrorPage/ErrorPage";
import Logout from "./components/Logout/Logout";

const App = () => {
  message.config({
    maxCount: 3,
    duration: 2,
  });
  return (
    <Router>
      <Switch>
        <Route exact path="/" key="landing">
          <Hero />
        </Route>
        <Route exact path="/login" key="login">
          <Login />
        </Route>
        <Route exact path="/logout" key="logout">
          <Logout />
        </Route>
        <Route exact path="/signup" key="signup">
          <Signup />
        </Route>
        <Route exact path="/signout" key="signout">
          <Logout />
        </Route>
        <Route exact path="/meals" key="meals">
          <Home curScreen="meals" />
        </Route>
        <Route exact path="/addmeal" key="addmeal">
          <Home curScreen="meal_add" />
        </Route>
        <Route exact path="/userlist" key="userlist">
          <Home curScreen="users" />
        </Route>
        <Route exact path="/adduser" key="adduser">
          <Home curScreen="user_add" />
        </Route>
        <Route exact path="/modifyuser" key="modifyuser">
          <Home curScreen="user_manage" />
        </Route>
        <Route exact path="/changerole" key="changerole">
          <Home curScreen="role_change" />
        </Route>
        <Route exact path="/updaterecords" key="updaterecords">
          <Home curScreen="user_record_update" />
        </Route>
        <Route exact path="/profile" key="profile">
          <Profile />
        </Route>
        <Route path="/" key="error">
          <ErrorPage error="404" />
        </Route>
      </Switch>
    </Router>
  );
};

export default App;
