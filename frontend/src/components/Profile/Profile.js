import React, { useState, useEffect, useCallback } from "react";
import { useHistory } from "react-router-dom";
import authService from "../../services/auth.service";
import userService from "../../services/user.service";
import {
  PageHeader,
  Avatar,
  Slider,
  InputNumber,
  Row,
  Col,
  message,
} from "antd";
import { useSelector, useDispatch } from "react-redux";
import _debounce from "lodash/debounce";

import "./Profile.scss";

import avatarIMG from "../../assets/images/stock_pfp.jpg";

const Profile = () => {
  const history = useHistory();
  useEffect(() => {
    (async () => {
      // if not logged in , redirect to /login
      if (!authService.getAccessToken()) {
        history.push("/login");
      } else {
        if (!(await authService.checkLoginState())) history.push("/login");
      }
    })();
  }, [history]);
  const { user } = useSelector((state) => state);
  const [calorielimit, setCalorielimit] = useState(user.calorielimit);

  const dispatch = useDispatch();

  const debouncedPost = (e) => {
    userService
      .editCaloriesLimit(e)
      .then((res) => {
        dispatch({ type: "SET_CALORIES", payload: res.calorielimit });
        message.success("Calorie Limit Changed!");
      })
      .catch((err) => message.error(err));
  };

  const debounceFN = useCallback(_debounce(debouncedPost, 1000), []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleLimit = (e) => {
    setCalorielimit(e);
    debounceFN(e);
  };

  return (
    <div className="profileContainer">
      <div className="profilePopup">
        <PageHeader
          className="popup__header"
          onBack={() => history.goBack()}
          title=" "
        />
        <div className="popup__avatar">
          <Avatar src={avatarIMG} size={192} />
          <div className="popup__name">{user.name}</div>
        </div>
        <div className="popup__details">
          <Row align="middle" justify="center" gutter={[8, 8]}>
            <Col span={8}>Calorie Limit :</Col>
            <Col span={8}>
              <InputNumber
                min={1}
                max={100000}
                value={calorielimit}
                onChange={handleLimit}
                precision={0}
              />
            </Col>
            <Col span={12}>
              <Slider
                min={100}
                max={100000}
                step={100}
                onChange={handleLimit}
                value={calorielimit}
              />
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};

export default Profile;
