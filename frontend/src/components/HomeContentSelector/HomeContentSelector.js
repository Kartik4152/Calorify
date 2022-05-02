//dependencies
import React from "react";
//styles
import "./HomeContentSelector.scss";
//components
import Meals from "../screens/Meals";
import MealAdd from "../screens/MealAdd";
import Users from "../screens/Users";
import UserAdd from "../screens/UserAdd";
import UserManage from "../screens/UserManage";
import ChangeRole from "../screens/ChangeRole";
import UserRecordUpdate from "../screens/UserRecordUpdate.js";
import { useSelector } from "react-redux";
import { Redirect } from "react-router";

const HomeContentSelector = ({ curScreen }) => {
  const screens = {
    meals: <Meals />,
    meal_add: <MealAdd />,
    users: <Users />,
    user_add: <UserAdd />,
    user_manage: <UserManage />,
    role_change: <ChangeRole />,
    user_record_update: <UserRecordUpdate />,
  };
  const { user } = useSelector((state) => state);
  switch (user.role) {
    case "user":
      if (["meals", "meal_add"].includes(curScreen))
        return <>{screens[curScreen]}</>;
      else return <Redirect to="/meals" />;
    case "mod":
      if (
        ["meals", "meal_add", "users", "user_add", "user_manage"].includes(
          curScreen
        )
      )
        return <>{screens[curScreen]}</>;
      else return <Redirect to="/meals" />;
    case "admin":
      return <>{screens[curScreen]}</>;
    default:
      return <Redirect to="/meals" />;
  }
};

export default HomeContentSelector;
