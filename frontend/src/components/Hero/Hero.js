//dependencies
import React, { useEffect } from "react";
import { useHistory, Link } from "react-router-dom";

//styles
import "./Hero.scss";

//assets
import diet from "../../assets/images/diet.png";
import logoBlue from "../../assets/images/logo_blue.png";
import { MenuOutlined } from "@ant-design/icons";

//services
import authService from "../../services/auth.service";

//components
import { Menu, Layout, Row, Col, Button, Grid } from "antd";
const { Header, Content } = Layout;

const Hero = () => {
  const screen = Grid.useBreakpoint();
  const history = useHistory();
  useEffect(() => {
    (async () => {
      // if already logged in , redirect to /meals
      if (authService.getAccessToken()) {
        if (await authService.checkLoginState()) history.push("/meals");
      }
    })();
  }, [history]);

  return (
    <Layout>
      <Header className="navbar">
        <Row
          justify={
            !screen.sm || (screen.sm && !screen.md)
              ? "space-between"
              : "space-around"
          }
        >
          <Col xxl={4} xl={4} lg={4} md={4} sm={5} xs={2}>
            <Link
              style={{ display: "flex", alignItems: "center", gap: "1rem" }}
              to="/"
            >
              <img
                src={logoBlue}
                alt="calorify logo"
                className="navbar__logo"
              />
              <span className="navbar__title">Calorify</span>
            </Link>
          </Col>
          <Col
            xxl={4}
            xl={6}
            lg={8}
            md={10}
            sm={12}
            xs={2}
            style={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <Menu
              theme="light"
              mode="horizontal"
              className="navbar__menu"
              disabledOverflow
            >
              {(screen.xs || !screen.sm) && (
                <Menu.SubMenu
                  key="options"
                  icon={<MenuOutlined className="navbar__menu-icon" />}
                >
                  <Menu.Item key="login" title="Login">
                    <Link to="/login">Login</Link>
                  </Menu.Item>
                  <Menu.Item key="signup" title="Signup">
                    <Link to="/signup">Signup</Link>
                  </Menu.Item>
                </Menu.SubMenu>
              )}
              {!screen.xs && screen.sm && (
                <>
                  <Menu.Item key="login" title="Login">
                    <Button type="primary">
                      <Link to="/login">Login</Link>
                    </Button>
                  </Menu.Item>
                  <Menu.Item key="signup" title="Signup">
                    <Button type="primary">
                      <Link to="/signup">Signup</Link>
                    </Button>
                  </Menu.Item>
                </>
              )}
            </Menu>
          </Col>
        </Row>
      </Header>
      <Content className="hero">
        <div className="hero__clipBG"></div>
        <Row
          gutter={[4, 48]}
          className="hero__row"
          justify="space-around"
          align="center"
        >
          <Col xxl={10} xl={10} lg={10} md={24} sm={24} xs={24}>
            <div className="hero__title">
              Manage, track & reduce your calorie intake.
            </div>
          </Col>
          <Col xxl={10} xl={10} lg={10} md={12} sm={12} xs={12}>
            <div className="hero__image-container">
              <img src={diet} alt="" className="hero__image" />
            </div>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default Hero;
