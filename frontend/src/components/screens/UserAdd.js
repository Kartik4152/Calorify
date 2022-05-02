//dependencies
import React from "react";
import { useSelector } from "react-redux";

//styles
import "./UserAdd.scss";

//services
import moderatorService from "../../services/moderator.service";
import adminService from "../../services/admin.service";

//components
import {
  Row,
  Divider,
  Button,
  Form,
  Input,
  InputNumber,
  message,
  Space,
  Radio,
} from "antd";

function UserAdd() {
  const itemLayout = {
    labelCol: {
      xs: { span: 24, offset: 0 },
      sm: { span: 10, offset: 0 },
      md: { span: 10, offset: 0 },
      lg: { span: 10, offset: 0 },
      xl: { span: 10, offset: 0 },
      xxl: { span: 10, offset: 0 },
    },
    wrapperCol: {
      xs: { span: 24, offset: 0 },
      sm: { span: 10, offset: 0 },
      md: { span: 10, offset: 0 },
      lg: { span: 8, offset: 0 },
      xl: { span: 6, offset: 0 },
      xxl: { span: 4, offset: 0 },
    },
  };
  const tailLayout = {
    wrapperCol: {
      xs: { offset: 8 },
      sm: { offset: 10 },
      md: { offset: 10 },
      lg: { offset: 10 },
      xl: { offset: 10 },
      xxl: { offset: 10 },
    },
  };
  const [form] = Form.useForm();
  const { user } = useSelector((state) => state);
  // creates user on form submission
  const formHandler = (val) => {
    if (user.role === "mod")
      moderatorService
        .createUser(
          val.password,
          val.email,
          val.name,
          val.role,
          val.calorielimit
        )
        .then((res) => {
          form.resetFields();
          message.success("User Created!");
        })
        .catch((status) => message.error(`${status}`));
    else if (user.role === "admin")
      adminService
        .createUser(
          val.password,
          val.email,
          val.name,
          val.role,
          val.calorielimit
        )
        .then((res) => {
          form.resetFields();
          message.success("User Created!");
        })
        .catch((status) => message.error(`${status}`));
  };
  return (
    <>
      <Divider>Add User</Divider>
      <Row align="middle" justify="center" className="addUserRow">
        <Form
          form={form}
          {...itemLayout}
          layout="horizontal"
          onFinish={formHandler}
          style={{ width: "100%" }}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[
              {
                required: true,
                message: "name is required",
              },
              {
                type: "string",
                max: 60,
                message: "Name cannot be greater than 60 characters",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: "Email is required",
              },
              {
                type: "email",
                message: "Enter Valid Email!",
              },
              {
                max: 320,
                message: "Email cannot be greater than 320 characters",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: "Password is required",
              },
              {
                type: "string",
                min: 6,
                message: "Password should be atleast 6 characters",
              },
              {
                type: "string",
                max: 100,
                message: "Password cannot be more than 100 characters",
              },
            ]}
          >
            <Input type="password" />
          </Form.Item>
          <Form.Item
            label="Role"
            name="role"
            rules={[{ required: true, message: "Please select a role" }]}
          >
            <Radio.Group buttonStyle="solid" style={{ width: "100%" }}>
              <Space
                align="stretch"
                direction="vertical"
                style={{ width: "100%" }}
              >
                <Radio.Button
                  value="user"
                  style={{ width: "100%", textAlign: "center" }}
                >
                  User
                </Radio.Button>
                <Radio.Button
                  value="mod"
                  style={{ width: "100%", textAlign: "center" }}
                >
                  Moderator/Manager
                </Radio.Button>
                <Radio.Button
                  value="admin"
                  disabled={user.role !== "admin"}
                  style={{ width: "100%", textAlign: "center" }}
                >
                  Administrator
                </Radio.Button>
              </Space>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            label="Calorie Limit"
            name="calorielimit"
            rules={[
              {
                required: true,
                message: "Calorie limit is required",
              },
              {
                type: "number",
                min: 1,
                message: "calorie limit cannot be 0 or negative",
              },
              {
                type: "number",
                max: 100000,
                message: "calorie limit must be less than 100000",
              },
            ]}
          >
            <InputNumber precision={0} />
          </Form.Item>
          <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit">
              Add User
            </Button>
          </Form.Item>
        </Form>
      </Row>
    </>
  );
}

export default UserAdd;
