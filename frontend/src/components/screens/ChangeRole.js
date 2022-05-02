//dependencies
import React, { useState } from "react";

//styles
import "./ChangeRole.scss";

//services
import adminService from "../../services/admin.service";

//assets
import dp from "../../assets/images/stock_pfp.jpg";

//components
import {
  Row,
  Col,
  Divider,
  Input,
  Card,
  Button,
  Avatar,
  Popover,
  Radio,
  Space,
  message,
  Grid,
  Spin,
} from "antd";
import { EditOutlined } from "@ant-design/icons";

const ChangeRole = () => {
  const [isLoading, setIsLoading] = useState(false);
  const screen = Grid.useBreakpoint();
  const [user, setUser] = useState();
  const [email, setEmail] = useState();
  // get user whose role is to be changed
  const fetchUser = () => {
    setIsLoading(true);
    adminService
      .getUserByEmail(email)
      .then((usr) => {
        setUser(usr);
        setIsLoading(false);
      })
      .catch((status) => message.error(`${status}`));
  };

  // change user role
  const handleRoleChange = (e) => {
    adminService
      .changeRole(user.id, e.target.value)
      .then((res) => {
        message.success(`Role Changed to ${e.target.value}!`);
        setUser((prev) => ({
          ...prev,
          role: e.target.value,
        }));
      })
      .catch((status) => message.error(`${status}`));
  };

  return (
    <>
      <Divider>Change User Role</Divider>
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
          xs={8}
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
            display: "flex",
            flex: 1,
            height: "100%",
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
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
                <Popover
                  placement="bottom"
                  title="Role"
                  content={
                    <Radio.Group
                      value={user && user.role}
                      onChange={handleRoleChange}
                    >
                      <Space direction="horizontal">
                        <Radio value="user">User</Radio>
                        <Radio value="mod">Moderator</Radio>
                        <Radio value="admin">Admin</Radio>
                      </Space>
                    </Radio.Group>
                  }
                  trigger="click"
                >
                  <EditOutlined />
                </Popover>,
              ]}
              className="changeRole__card"
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
    </>
  );
};

export default ChangeRole;
