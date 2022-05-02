import React, { useEffect } from "react";
import { useHistory } from "react-router";
import { useDispatch } from "react-redux";
import authService from "../../services/auth.service";

const Logout = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch({ type: "SIGNOUT" });
    authService.signout();
    history.push("/");
  }, [dispatch, history]);
  return <div></div>;
};

export default Logout;
