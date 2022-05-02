//dependencies
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { UserOutlined } from "@ant-design/icons";
import { GiForkKnifeSpoon } from "react-icons/gi";
import { GrUserAdmin } from "react-icons/gr";
import { RiUserSettingsLine } from "react-icons/ri";

//styles
import "./Home.scss";

//services
import authService from "../../services/auth.service";
import userService from "../../services/user.service";

//assets
import logo from "../../assets/images/logo_blue.png";

//components
import { Layout, Row, Col, Menu, Grid, message } from "antd";
import HomeContentSelector from "../HomeContentSelector/HomeContentSelector";

const { Header, Content, Sider } = Layout;
const { SubMenu } = Menu;

const Home = ({ curScreen }) => {
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
  const dispatch = useDispatch();
  useEffect(() => {
    userService
      .getUser()
      .then((usr) => dispatch({ type: "SET_USER", payload: usr }))
      .catch((err) => message.error(err));
  }, [dispatch]);
  const screen = Grid.useBreakpoint();

  const { user } = useSelector((state) => state);
  const [siderCollapsed, setSiderCollapsed] = useState();

  // applies mask overlay on small screen when opening sider
  useEffect(() => {
    if (screen.xs || (screen.sm && !screen.md) || !screen.sm)
      if (!siderCollapsed)
        document.querySelector(".home__main-overlay").style.display = "block";
      else document.querySelector(".home__main-overlay").style.display = "none";
    else document.querySelector(".home__main-overlay").style.display = "none";
  });

  // controller for navbar menu
  const handleHeaderClick = ({ key }) => {
    switch (key) {
      case "signout":
        dispatch({ type: "SIGNOUT" });
        authService.signout();
        history.push("/");
        break;
      case "profile":
        history.push("/profile");
        break;
      default:
        break;
    }
  };
  // controlled for sider menu
  const handleScreenClick = ({ key }) => {
    history.push(`/${key}`);
    setSiderCollapsed(true);
  };

  return (
    <Layout className="home">
      <Header className="home__header">
        <Row justify="space-between" align="middle">
          <Col
            xxl={4}
            xl={4}
            lg={4}
            md={4}
            sm={4}
            xs={4}
            style={{ display: "flex", alignItems: "center" }}
          >
            <img
              src={logo}
              alt="calorify logo"
              className="home__header__logo"
            ></img>
            <span className="home__header__title">Calorify</span>
          </Col>
          <Col>
            <Menu
              theme="light"
              disabledOverflow
              mode="horizontal"
              onClick={handleHeaderClick}
              style={{ borderBottom: "none" }}
            >
              <SubMenu key="settings" icon={<UserOutlined />} title="Settings">
                <Menu.Item key="profile">Profile</Menu.Item>
                <Menu.Item key="signout">Signout</Menu.Item>
              </SubMenu>
            </Menu>
          </Col>
        </Row>
      </Header>
      <Layout className="home__main">
        <div className="home__main-overlay" style={{ display: "none" }}></div>
        <Sider
          theme="light"
          breakpoint="md"
          collapsedWidth={0}
          zeroWidthTriggerStyle={{
            fillOpacity: 1,
            backgroundColor: "rgba(255, 255, 255, 0.5)",
          }}
          collapsed={() => {
            if ((screen.sm && !screen.md) || !screen.sm || screen.xs)
              return siderCollapsed;
            return false;
          }}
          style={{
            height: "100%",
            position: "fixed",
            top: "0",
            left: "0",
            borderRight: "1px solid #f0f0f0",
            zIndex: 2,
            paddingTop: "4rem",
          }}
          onCollapse={(isCollapsed) => {
            setSiderCollapsed(isCollapsed);
          }}
          width={(() => {
            if (screen.sm && !screen.xs && !screen.md) return "50%";
            else if (screen.xs || !screen.sm) return "80%";
            else return "200px";
          })()}
        >
          <Menu
            mode="inline"
            defaultOpenKeys={["user"]}
            defaultSelectedKeys={["meals"]}
            onClick={handleScreenClick}
            theme="light"
            selectedKeys={[curScreen]}
            style={{ borderRight: "none" }}
          >
            <SubMenu key="user" icon={<GiForkKnifeSpoon />} title="Meals">
              <Menu.Item key="meals">View Meals</Menu.Item>
              <Menu.Item key="addmeal">Add Meal</Menu.Item>
            </SubMenu>

            {(user.role === "mod" || user.role === "admin") && (
              <>
                <Menu.Divider />
                <SubMenu
                  key="mod"
                  icon={<RiUserSettingsLine />}
                  title="CRUD Users"
                >
                  <Menu.Item key="userlist">List Users</Menu.Item>
                  <Menu.Item key="adduser">Add User</Menu.Item>
                  <Menu.Item key="modifyuser">Update/Delete User</Menu.Item>
                </SubMenu>
              </>
            )}
            {user.role === "admin" && (
              <>
                <Menu.Divider />
                <SubMenu key="admin" icon={<GrUserAdmin />} title="Admin Panel">
                  <Menu.Item key="changerole">Change User Role</Menu.Item>
                  <Menu.Item key="updaterecords">Update User Records</Menu.Item>
                </SubMenu>
              </>
            )}
          </Menu>
        </Sider>
        <Layout
          className="layoutContent"
          style={{
            marginLeft:
              (screen.sm && !screen.md) || screen.xs || !screen.sm
                ? "0px"
                : "200px",
          }}
        >
          <Content className="home__content">
            <HomeContentSelector curScreen={curScreen} />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default Home;
