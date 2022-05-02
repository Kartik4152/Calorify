//dependencies
import React, { useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
//styles
import "./Signup.scss";

//components
import { Form, Input, Button, PageHeader, Row, Col, message } from "antd";
//services
import authService from "../../services/auth.service";

const Signup = () => {
  const history = useHistory();
  useEffect(() => {
    (async () => {
      // if already logged in , redirect to /meals
      if (authService.getAccessToken()) {
        if (await authService.checkLoginState()) history.push("/meals");
      }
    })();
  }, [history]);

  const formItemLayout = {
    labelCol: {
      xs: {
        span: 24,
        offset: 0,
      },
      sm: {
        span: 6,
        offset: 0,
      },
      md: {
        span: 8,
        offset: 0,
      },
      lg: {
        span: 8,
        offset: 0,
      },
      xl: {
        span: 8,
        offset: 0,
      },
      xxl: {
        span: 8,
        offset: 0,
      },
    },
    wrapperCol: {
      xs: {
        span: 24,
        offset: 0,
      },
      sm: {
        span: 16,
        offset: 0,
      },
      md: {
        span: 16,
        offset: 0,
      },
      lg: {
        span: 16,
        offset: 0,
      },
      xl: {
        span: 16,
        offset: 0,
      },
      xxl: {
        span: 16,
        offset: 0,
      },
    },
  };
  const tailFormItemLayout = {
    wrapperCol: {
      xs: {
        span: 16,
        offset: 0,
      },
      sm: {
        span: 16,
        offset: 6,
      },
      md: {
        span: 16,
        offset: 8,
      },
      lg: {
        span: 12,
        offset: 10,
      },
      xl: {
        span: 12,
        offset: 10,
      },
      xxl: {
        span: 12,
        offset: 10,
      },
    },
  };
  const [form] = Form.useForm();
  // on form submit
  const onFinish = (details) => {
    authService
      .signup(details)
      .then(() => {
        message.success("Signed Up Succesfully!");
        history.push("/login");
      })
      .catch((status) => {
        message.error(`${status}`);
      });
  };
  return (
    <div className="signupContainer">
      <div className="signupModal">
        <Row>
          <PageHeader
            className="signupModal__header"
            onBack={() => history.push("/")}
            title="Back"
          />
          <Col
            xxl={12}
            xl={12}
            lg={12}
            md={12}
            sm={0}
            xs={0}
            className="signupModal__left"
          ></Col>
          <Col
            xxl={12}
            xl={12}
            lg={12}
            md={12}
            sm={24}
            xs={24}
            className="signupModal__form"
          >
            <Form
              {...formItemLayout}
              form={form}
              name="register"
              onFinish={onFinish}
              scrollToFirstError
            >
              <Form.Item
                name="name"
                label="Name"
                rules={[
                  {
                    required: true,
                    message: "Please input your name",
                    whitespace: true,
                  },
                  {
                    type: "string",
                    max: 60,
                    message: "Name cannot be more than 60 characters",
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="email"
                label="E-mail"
                rules={[
                  {
                    type: "email",
                    message: "The input is not valid E-mail!",
                  },
                  {
                    required: true,
                    message: "Please input your E-mail!",
                  },
                  {
                    max: 320,
                    message: "Email cannot be more than 320 characters",
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="password"
                label="Password"
                rules={[
                  {
                    required: true,
                    message: "Please input your password!",
                  },
                  {
                    type: "string",
                    min: 6,
                    message: "Password needs to be Atleast 6 characters long!",
                  },
                  {
                    type: "string",
                    max: 100,
                    message: "Password cannot be more than 100 characters",
                  },
                ]}
                hasFeedback
              >
                <Input.Password />
              </Form.Item>

              <Form.Item
                name="confirm"
                label="Confirm"
                dependencies={["password"]}
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: "Please confirm your password!",
                  },
                  {
                    type: "string",
                    min: 6,
                    message: "Password needs to be Atleast 6 characters!",
                  },
                  {
                    type: "string",
                    max: 100,
                    message: "Password cannot be more than 100 characters",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }

                      return Promise.reject(
                        new Error(
                          "The two passwords that you entered do not match!"
                        )
                      );
                    },
                  }),
                ]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item {...tailFormItemLayout}>
                <Button type="primary" htmlType="submit">
                  Register
                </Button>
              </Form.Item>
              <Form.Item {...tailFormItemLayout}>
                <Link to="/login">
                  <Button>Already Registered? Login!</Button>
                </Link>
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Signup;
