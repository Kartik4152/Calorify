//dependencies
import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
//styles
import "./Users.scss";
//assets
import pfp from "../../assets/images/stock_pfp.jpg";
import { QuestionCircleOutlined } from "@ant-design/icons";

//services
import moderatorService from "../../services/moderator.service";
import adminService from "../../services/admin.service";
import authService from "../../services/auth.service";

//components
import {
  Row,
  Col,
  Grid,
  List,
  Avatar,
  Divider,
  Skeleton,
  Button,
  Modal,
  Popconfirm,
  Form,
  Input,
  InputNumber,
  Typography,
  message,
  Spin,
  Space,
  Radio,
} from "antd";
import { useHistory } from "react-router-dom";

const Users = () => {
  const [form] = Form.useForm();
  const curUser = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
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
  }, [users, curUser, history]);

  const modalFormLayout = {
    labelCol: {
      xs: { span: 8, offset: 0 },
      sm: { span: 8, offset: 0 },
      md: { span: 8, offset: 0 },
      lg: { span: 8, offset: 0 },
      xl: { span: 8, offset: 0 },
      xxl: { span: 8, offset: 0 },
    },
    wrapperCol: {
      xs: { span: 12, offset: 0 },
      sm: { span: 12, offset: 0 },
      md: { span: 12, offset: 0 },
      lg: { span: 12, offset: 0 },
      xl: { span: 12, offset: 0 },
      xxl: { span: 12, offset: 0 },
    },
  };

  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [pageSize, setPageSize] = useState(10);
  const [modalVisible, setModalVisible] = useState(false);
  // fetch all users
  const fetchUsers = useCallback(() => {
    setIsLoading(true);
    if (curUser.role === "mod")
      moderatorService
        .getAllUsers()
        .then((res) => {
          setUsers(res);
          setFilteredUsers(res);
          setIsLoading(false);
        })
        .catch((status) => {
          message.error(`${status}`);
          setUsers([]);
          setFilteredUsers([]);
        });
    else if (curUser.role === "admin")
      adminService
        .getAllUsers()
        .then((res) => {
          setUsers(res);
          setFilteredUsers(res);
          setIsLoading(false);
        })
        .catch((status) => {
          message.error(`${status}`);
          setUsers([]);
          setFilteredUsers([]);
        });
  }, [curUser.role]);
  // fetches all users when component is mounted and sets users state.
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);
  // user edit handler
  const editHandler = () => {
    const edited_user = form.getFieldsValue(true);
    if (curUser.role === "mod")
      moderatorService
        .editUser(edited_user)
        .then((res) => {
          message.success("User Edited!");
          setModalVisible(false);
          fetchUsers();
        })
        .catch((status) => message.error(`${status}`));
    else if (curUser.role === "admin")
      adminService
        .editUser(edited_user)
        .then((res) => {
          message.success("User Edited!");
          setModalVisible(false);
          fetchUsers();
        })
        .catch((status) => message.error(`${status}`));
  };
  //user delete handler
  const deleteHandler = (id) => {
    if (curUser.role === "mod")
      moderatorService
        .deleteUser(id)
        .then((res) => {
          message.success("User Deleted!");
          fetchUsers();
        })
        .catch((status) => message.error(`${status}`));
    else if (curUser.role === "admin")
      adminService
        .deleteUser(id)
        .then((res) => {
          message.success("User Deleted!");
          fetchUsers();
        })
        .catch((status) => message.error(`${status}`));
  };

  // sets filteredUsers by filtering users using the search input
  const filterUsers = (e) => {
    let str = e.target.value;
    let filtered = users.filter((user) => {
      if (
        user.name.toUpperCase().includes(str.toUpperCase()) ||
        String(user.calorielimit).toUpperCase().includes(str.toUpperCase()) ||
        user.email.toUpperCase().includes(str.toUpperCase()) ||
        user.role.toUpperCase().includes(str.toUpperCase())
      )
        return true;
      return false;
    });
    setFilteredUsers(filtered);
  };

  const screen = Grid.useBreakpoint();
  return (
    <>
      <Divider>User List</Divider>
      <Row
        justify="center"
        gutter={24}
        align="middle"
        style={{ marginBottom: "2rem" }}
      >
        <Col>
          <Typography.Text>Filter : </Typography.Text>
        </Col>
        <Col xxl={6} xl={8} lg={8} md={10} sm={10} xs={14}>
          <Input placeholder="Search query" onChange={filterUsers} />
        </Col>
      </Row>
      {isLoading ? (
        <div
          style={{
            width: "100%",
            height: "50%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Spin />
        </div>
      ) : null}
      <Row justify="center" align="middle" style={{ paddingBottom: "2rem" }}>
        <Col span={22}>
          <List
            itemLayout={
              (screen.sm && !screen.md) || screen.xs ? "vertical" : "horizontal"
            }
            size="large"
            pagination={{
              pageSize: pageSize,
              showSizeChanger: true,
              total: filteredUsers.length,
              onShowSizeChange: (cur, size) => {
                setPageSize(size);
              },
            }}
            dataSource={filteredUsers}
            renderItem={(user) => (
              <List.Item
                key={user.email}
                actions={[
                  <Button
                    disabled={user.role === "admin" && curUser.role !== "admin"}
                    type="primary"
                    key="list-edit"
                    onClick={() => {
                      form.setFieldsValue({
                        name: user.name,
                        email: user.email,
                        calorielimit: user.calorielimit,
                        password: "",
                        id: user.id,
                        role: user.role,
                      });
                      setModalVisible(true);
                    }}
                  >
                    edit
                  </Button>,
                  <Popconfirm
                    title="Confirm Delete?"
                    icon={
                      <QuestionCircleOutlined style={{ color: "#f50057" }} />
                    }
                    okText="Yes"
                    cancelText="No"
                    onConfirm={() => deleteHandler(user.id)}
                    disabled={user.role === "admin" && curUser.role !== "admin"}
                  >
                    <Button
                      type="default"
                      key="list-delete"
                      danger
                      disabled={
                        user.role === "admin" && curUser.role !== "admin"
                      }
                    >
                      delete
                    </Button>
                  </Popconfirm>,
                ]}
                className="user"
              >
                <Skeleton avatar title={false} active loading={false}>
                  <List.Item.Meta
                    avatar={<Avatar src={user.picture || pfp} />}
                    title={user.name}
                    description={user.email}
                    className="user__meta"
                  />
                  <div className="user__calories">
                    <span> Calorie Limit : {user.calorielimit}</span>
                    <span> Role : {user.role}</span>
                  </div>
                </Skeleton>
              </List.Item>
            )}
          />
        </Col>
      </Row>
      <Modal
        visible={modalVisible}
        centered
        title="Edit User"
        onOk={() => {
          editHandler();
        }}
        onCancel={() => setModalVisible(false)}
      >
        <Row justify="center" align="middle">
          <Col span={24}>
            <Form layout="horizontal" form={form} {...modalFormLayout}>
              <Form.Item
                label="Name"
                name="name"
                rules={[
                  {
                    required: true,
                    whitespace: true,
                    message: "Name is required.",
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
                label="Email"
                name="email"
                rules={[
                  {
                    required: true,
                    message: "Email is required.",
                  },
                  {
                    type: "email",
                    message: "Email Invalid",
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
                label="Password"
                name="password"
                rules={[
                  {
                    type: "string",
                    min: 6,
                    message: "Password must be more than 6 characters",
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
                    message: "Calorie limit is required.",
                  },
                  {
                    type: "number",
                    min: 1,
                    message: "Calore limit cannot be 0 or negative",
                  },
                  {
                    type: "number",
                    max: 100000,
                    message: "Calorie limit must be less than 100000",
                  },
                ]}
              >
                <InputNumber />
              </Form.Item>
              <Form.Item name="id" style={{ display: "none" }}>
                <Input disabled />
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </Modal>
    </>
  );
};

export default Users;
