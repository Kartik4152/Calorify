//dependencies
import React, { useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
//styles
import "./Login.scss";

//components
import { Form, Input, Button, Checkbox, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { PageHeader } from "antd";

//services
import authService from "../../services/auth.service";

const Login = () => {
  const history = useHistory();
  useEffect(() => {
    (async () => {
      // if user is already logged in, redirect to home
      if (await authService.checkLoginState()) history.push("/meals");
    })();
  }, [history]);

  //on form submission
  const onFinish = (details) => {
    authService
      .login(details.email, details.password, details.remember)
      .then((res) => {
        message.success("Logged in!");
        history.push("/meals");
      })
      .catch((status) => message.error(`${status}`));
  };

  return (
    <div className="loginContainer">
      <div className="loginModal">
        <PageHeader
          className="loginModal__header"
          onBack={() => history.push("/")}
          title="Back"
        />
        <div className="loginModal__left"></div>
        <div className="loginModal__form">
          <Form
            name="normal_login"
            className="login-form"
            initialValues={{
              remember: true,
            }}
            onFinish={onFinish}
          >
            <Form.Item
              name="email"
              rules={[
                {
                  required: true,
                  message: "Please input your Email!",
                },
                {
                  type: "email",
                  message: "Please enter a valid Email!",
                },
                {
                  max: 320,
                  message: "Email cannot be greater than 320 characters",
                },
              ]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Email"
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please input your Password!",
                },
                {
                  type: "string",
                  max: 100,
                  message: "Password cannot be greater than 100 characters",
                },
              ]}
            >
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="Password"
              />
            </Form.Item>
            <Form.Item>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Remember me</Checkbox>
              </Form.Item>
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button"
              >
                Log in
              </Button>
            </Form.Item>
            <Form.Item>
              <Link to="/signup">
                <Button className="login-form-button">
                  Not Registered? Register now!
                </Button>
              </Link>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Login;
