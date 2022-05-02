//dependencies
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";

//styles
import "./UserManage.scss";

//services
import moderatorService from "../../services/moderator.service";
import adminService from "../../services/admin.service";
import authService from "../../services/auth.service";

//assets
import dp from "../../assets/images/stock_pfp.jpg";

//components
import {
  Row,
  Col,
  Divider,
  Popconfirm,
  Modal,
  Form,
  InputNumber,
  Input,
  Card,
  Button,
  Avatar,
  message,
  Grid,
  Space,
  Radio,
  Spin,
} from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

const UserManage = () => {
  const history = useHistory();
  const [user, setUser] = useState(null);
  const curUser = useSelector((state) => state.user);
  useEffect(() => {
    (async () => {
      // if not logged in , redirect to /login
      if (!authService.getAccessToken()) {
        history.push("/login");
      } else {
        if (!(await authService.checkLoginState())) history.push("/login");
      }
    })();
  }, [user, curUser, history]);
  const [isLoading, setIsLoading] = useState(false);
  const [form] = Form.useForm();
  const [email, setEmail] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const modalItemLayout = {
    labelCol: {
      xs: { span: 24, offset: 0 },
      sm: { span: 8, offset: 0 },
      md: { span: 8, offset: 0 },
      lg: { span: 8, offset: 0 },
      xl: { span: 8, offset: 0 },
      xxl: { span: 8, offset: 0 },
    },
    wrapperCol: {
      xs: { span: 24, offset: 0 },
      sm: { span: 12, offset: 0 },
      md: { span: 12, offset: 0 },
      lg: { span: 12, offset: 0 },
      xl: { span: 12, offset: 0 },
      xxl: { span: 12, offset: 0 },
    },
  };
  // user delete handler
  const deleteHandler = () => {
    if (curUser.role === "mod")
      moderatorService
        .deleteUser(user.id)
        .then((res) => {
          setEmail("");
          setUser("");
          message.success("User deleted!");
        })
        .catch((status) => message.error(`${status}`));
    else if (curUser.role === "admin")
      adminService
        .deleteUser(user.id)
        .then((res) => {
          setEmail("");
          setUser("");
          message.success("User deleted!");
        })
        .catch((status) => message.error(`${status}`));
  };
  // fetches user and sets user state
  const fetchUser = () => {
    setIsLoading(true);
    if (curUser.role === "mod")
      moderatorService
        .getUserByEmail(email)
        .then((usr) => {
          setUser(usr);
          setIsLoading(false);
        })
        .catch((status) => message.error(`${status}`));
    else if (curUser.role === "admin")
      adminService
        .getUserByEmail(email)
        .then((usr) => {
          setUser(usr);
          setIsLoading(false);
        })
        .catch((status) => message.error(`${status}`));
  };
  // user edit handler
  const editHandler = () => {
    let newUser = form.getFieldsValue(true);
    if (curUser.role === "mod")
      moderatorService
        .editUser(newUser)
        .then((res) => {
          fetchUser();
          setModalVisible(false);
          message.success("User updated!");
        })
        .catch((status) => message.error(`${status}`));
    else if (curUser.role === "admin")
      adminService
        .editUser(newUser)
        .then((res) => {
          fetchUser();
          setModalVisible(false);
          message.success("User updated!");
        })
        .catch((status) => message.error(`${status}`));
  };
  const screen = Grid.useBreakpoint();
  return (
    <>
      <Divider>Update/Delete User</Divider>
      <Row
        gutter={[24, 24]}
        justify={screen.xs || !screen.sm ? "center" : "start"}
      >
        <Col
          xxl={{ span: 5, offset: 9 }}
          xl={{ span: 6, offset: 9 }}
          lg={{ span: 7, offset: 8 }}
          md={{ span: 10, offset: 7 }}
          sm={{ span: 12, offset: 6 }}
          xs={{ span: 20, offset: 0 }}
          style={{ paddingRight: "0", paddingLeft: "0" }}
        >
          <Input
            placeholder="User Email"
            value={email}
            onPressEnter={fetchUser}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Col>
        <Col
          xxl={4}
          xl={4}
          lg={4}
          md={4}
          sm={4}
          xs={{ span: 8, offset: 0 }}
          style={
            screen.xs || !screen.sm
              ? { display: "flex", justifyContent: "center" }
              : {}
          }
        >
          <Button type="primary" onClick={fetchUser}>
            Fetch User
          </Button>
        </Col>
      </Row>
      {isLoading ? (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Spin />
        </div>
      ) : null}
      {user && (
        <Row
          style={{ marginTop: "2rem" }}
          justify={screen.xs || !screen.sm ? "center" : "start"}
        >
          <Col
            xxl={{ span: 5, offset: 9 }}
            xl={{ span: 6, offset: 9 }}
            lg={{ span: 7, offset: 8 }}
            md={{ span: 10, offset: 7 }}
            sm={{ span: 12, offset: 6 }}
            xs={{ span: 16, offset: 0 }}
          >
            <Card
              actions={[
                <Popconfirm
                  title="Delete User?"
                  okText="Yes"
                  cancelText="No"
                  onConfirm={deleteHandler}
                >
                  <DeleteOutlined key="delete" />
                </Popconfirm>,
                <EditOutlined
                  onClick={() => {
                    form.setFieldsValue({
                      ...user,
                      password: "",
                    });
                    setModalVisible(true);
                  }}
                />,
              ]}
              className="userManage__card"
            >
              <Card.Meta
                avatar={<Avatar src={dp} size={48} />}
                title={user.name}
                description={user.email}
              />
            </Card>
          </Col>
        </Row>
      )}

      <Modal
        title="Edit User"
        centered
        visible={modalVisible}
        onOk={() => {
          editHandler();
        }}
        onCancel={() => {
          setModalVisible(false);
        }}
      >
        <Row align="middle" justify="center" className="modal__row">
          <Form
            {...modalItemLayout}
            layout="horizontal"
            style={{ width: "100%" }}
            form={form}
          >
            <Form.Item
              label="Name"
              name="name"
              rules={[
                {
                  required: true,
                  message: "Name is required",
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
                  message: "email is required",
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
                  type: "string",
                  min: 6,
                  message: "Password should be 6 or more characters.",
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
                    disabled={curUser.role !== "admin"}
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
                  message: "calorie amount is required",
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
              <InputNumber />
            </Form.Item>
          </Form>
        </Row>
      </Modal>
    </>
  );
};

export default UserManage;
