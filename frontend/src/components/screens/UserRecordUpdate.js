//dependencies
import React, { useState, useEffect } from "react";
import moment from "moment";
//style
import "./UserRecordUpdate.scss";

//services
import adminService from "../../services/admin.service";

//assets
import dp from "../../assets/images/stock_pfp.jpg";

//components
import {
  DatePicker,
  Row,
  Col,
  Divider,
  Popconfirm,
  message,
  Grid,
  Modal,
  Form,
  InputNumber,
  Input,
  Button,
  Avatar,
  Space,
  Drawer,
  TimePicker,
  List,
  Skeleton,
  Spin,
} from "antd";

import { DeleteOutlined } from "@ant-design/icons";

//functions
import { datePrettify, timePrettify } from "../../functions/prettify";
import tomorrow from "../../functions/tomorrow";

const UserRecordUpdate = () => {
  const [isUserLoading, setIsUserLoading] = useState(false);
  const [isMealsLoading, setIsMealsLoading] = useState(false);
  const [curOperation, setCurOperation] = useState();
  const [form] = Form.useForm();
  const [user, setUser] = useState(null);
  const [refetch, setRefetch] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [email, setEmail] = useState();
  const [meals, setMeals] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [filteredMeals, setFilteredMeals] = useState(null);
  const [filterQuery, setFilterQuery] = useState("");
  const [filterDateStart, setFilterDateStart] = useState(null);
  const [filterDateEnd, setFilterDateEnd] = useState(null);
  const [filterTimeStart, setFilterTimeStart] = useState(null);
  const [filterTimeEnd, setFilterTimeEnd] = useState(null);

  // get user by email
  const fetchUser = () => {
    setIsUserLoading(true);
    adminService
      .getUserByEmail(email)
      .then((usr) => {
        setUser(usr);
        setIsUserLoading(false);
      })
      .catch((status) => message.error(`${status}`));
  };
  // set filteredMeals when filter changes
  useEffect(() => {
    let start = {};
    let end = {};
    // if date filter applied
    if (filterDateStart && filterDateEnd) {
      let dt_start = filterDateStart.toObject();
      let dt_end = filterDateEnd.toObject();
      start = {
        date: dt_start.date,
        month: dt_start.months + 1,
        year: dt_start.years,
      };
      end = {
        date: dt_end.date,
        month: dt_end.months + 1,
        year: dt_end.years,
      };
    }
    // if time filter applied
    if (filterTimeStart && filterTimeEnd) {
      let tm_start = filterTimeStart.toObject();
      let tm_end = filterTimeEnd.toObject();
      start = {
        ...start,
        hours: tm_start.hours,
        minutes: tm_start.minutes,
      };
      end = {
        ...end,
        hours: tm_end.hours,
        minutes: tm_end.minutes,
      };
    }
    // if user is set
    if (user) {
      setIsMealsLoading(true);
      adminService
        .getMeals(
          user.id,
          end.date !== undefined
            ? datePrettify(start.date, start.month, start.year)
            : null,
          end.hours !== undefined
            ? timePrettify(start.hours, start.minutes)
            : null,
          end.date !== undefined
            ? datePrettify(end.date, end.month, end.year)
            : null,
          end.hours !== undefined ? timePrettify(end.hours, end.minutes) : null
        )
        .then((mls) => {
          setMeals(mls);
          setFilteredMeals(mls);
          setIsMealsLoading(false);
        })
        .catch((status) => message.error(`${status}`));
    }
  }, [
    filterDateStart,
    filterDateEnd,
    filterTimeStart,
    filterTimeEnd,
    user,
    drawerVisible,
    refetch,
  ]);
  // edit meal handler
  const editHandler = () => {
    const formval = form.getFieldsValue(true);
    let dt = formval.dateTime.toObject();
    let edited_meal = {
      id: formval.id,
      name: formval.name,
      calories: formval.calories,
      hour: dt.hours,
      minute: dt.minutes,
      year: dt.years,
      date: dt.date,
      month: dt.months + 1,
    };
    adminService
      .editMeal(edited_meal)
      .then((res) => {
        setRefetch((prev) => !prev);
        setModalVisible(false);
        message.success("Meal Edited!");
      })
      .catch((status) => message.error(`${status}`));
  };
  // delete meal handler
  const handleDelete = (meal) => {
    adminService
      .deleteMeal(meal.id)
      .then((res) => {
        setRefetch((prev) => !prev);
        message.success("Meal Deleted!");
      })
      .catch((status) => message.error(`${status}`));
  };
  // add meal handler
  const addHandler = () => {
    let val = form.getFieldsValue(true);
    let dt = val.dateTime.toObject();
    let meal = {
      name: val.name,
      calories: val.calories,
      date: dt.date,
      month: dt.months + 1,
      year: dt.years,
      hour: dt.hours,
      minute: dt.minutes,
    };

    adminService
      .addMeal(user.id, meal)
      .then((res) => {
        form.resetFields();
        message.success("Added Meal!");
        setModalVisible(false);
      })
      .catch((status) => {
        message.error(`${status}`);
      });
  };
  // assigns values to dateFilter states
  const handleDateFilter = (val) => {
    if (val) {
      setFilterDateStart(val[0]);
      setFilterDateEnd(val[1]);
    } else {
      setFilterDateStart(null);
      setFilterDateEnd(null);
    }
  };
  // assigns values to timeFilter states
  const handleTimeFilter = (val) => {
    if (val) {
      setFilterTimeStart(val[0]);
      setFilterTimeEnd(val[1]);
    } else {
      setFilterTimeStart(null);
      setFilterTimeEnd(null);
    }
  };

  // set filtered meals wheenver query or meals update.
  useEffect(() => {
    if (meals)
      setFilteredMeals(
        meals.filter((meal) => {
          if (
            meal.name.toUpperCase().includes(filterQuery.toUpperCase()) ||
            String(meal.calories)
              .toUpperCase()
              .includes(filterQuery.toUpperCase())
          )
            return true;
          return false;
        })
      );
  }, [filterQuery, meals]);

  const modalItemLayout = {
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
      sm: { span: 12, offset: 0 },
      md: { span: 12, offset: 0 },
      lg: { span: 12, offset: 0 },
      xl: { span: 12, offset: 0 },
      xxl: { span: 12, offset: 0 },
    },
  };

  const screen = Grid.useBreakpoint();
  return (
    <>
      <Divider>Update User Records</Divider>
      <Row
        gutter={[24, 24]}
        justify={screen.xs || !screen.sm ? "center" : "start"}
      >
        <Col
          xxl={{ span: 4, offset: 10 }}
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
      {isUserLoading ? (
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
      <Row
        className="userRecord"
        justify={screen.xs || !screen.sm ? "center" : "start"}
      >
        {user && (
          <Col
            xxl={{ span: 4, offset: 10 }}
            xl={{ span: 6, offset: 9 }}
            lg={{ span: 7, offset: 8 }}
            md={{ span: 10, offset: 7 }}
            sm={{ span: 12, offset: 6 }}
            xs={{ span: 16, offset: 0 }}
            className="userRecord__card"
          >
            <div className="userRecord__card-avatarContainer">
              <Avatar src={dp} size={96} />
              <span style={{ marginTop: "2rem" }}>{user.name}</span>
              <span style={{ fontSize: "1.2rem", color: "rgb(230,230,230)" }}>
                {user.email}
              </span>
            </div>
            <div className="userRecord__card-details">
              <span>Calorie Limit : {user.calorielimit}</span>
            </div>
            <Divider></Divider>
            <div className="userRecord__card-controls">
              <Space direction="horizontal" size="middle">
                <Button
                  type="primary"
                  onClick={() => {
                    setDrawerVisible(true);
                  }}
                >
                  Load Meals
                </Button>
                <Button
                  type="dashed"
                  onClick={() => {
                    form.resetFields();
                    setCurOperation("add");
                    setModalVisible(true);
                  }}
                >
                  Add Meal
                </Button>
              </Space>
            </div>
          </Col>
        )}
      </Row>

      {/* Drawer Starts  */}
      <Drawer
        title="Meals"
        placement="right"
        closable={true}
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        width={(() => {
          if (screen.xxl) return "60%";
          else if (screen.xl) return "60%";
          else if (screen.lg) return "60%";
          else if (screen.md) return "80%";
          else return "100%";
        })()}
        className="drawer"
      >
        <Row
          justify="center"
          gutter={[24, 24]}
          align="middle"
          style={{ marginBottom: "2rem" }}
        >
          {/* <Col style={{ textAlign: "right" }}>
            <Typography.Text ellipsis>Filter : </Typography.Text>
          </Col> */}
          <Col xxl={16} xl={20} lg={20} md={20} sm={20} xs={24}>
            <Input
              placeholder="Search query"
              onChange={(e) => {
                setFilterQuery(e.target.value);
              }}
              style={{ width: "100%" }}
              value={filterQuery}
            />
          </Col>
          <Col xxl={20} xl={20} lg={20} md={20} sm={20} xs={24}>
            <Space
              direction={screen.xs ? "vertical" : "horizontal"}
              size="middle"
              style={{
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <DatePicker.RangePicker
                format="YYYY-MM-DD"
                ranges={{
                  Today: [moment(), moment()],
                  "This Month": [
                    moment().startOf("month"),
                    moment().endOf("month"),
                  ],
                }}
                value={[filterDateStart, filterDateEnd]}
                onChange={handleDateFilter}
              ></DatePicker.RangePicker>
              <TimePicker.RangePicker
                value={[filterTimeStart, filterTimeEnd]}
                format="HH:mm"
                ranges={{
                  [`All`]: [
                    moment().set({ hour: 0, minute: 0 }),
                    moment().set({ hour: 23, minute: 59 }),
                  ],
                  [`Breakfast(5-12)`]: [
                    moment().set({ hour: 5, minute: 0 }),
                    moment().set({ hour: 11, minute: 59 }),
                  ],
                  [`Lunch (12-16)`]: [
                    moment().set({ hour: 12, minute: 0 }),
                    moment().set({ hour: 15, minute: 59 }),
                  ],
                  [`Dinner(20-24)`]: [
                    moment().set({ hour: 20, minute: 0 }),
                    moment().set({ hour: 23, minute: 59 }),
                  ],
                }}
                onChange={handleTimeFilter}
              ></TimePicker.RangePicker>
            </Space>
          </Col>
        </Row>
        <Row justify="center" className="drawer__row">
          <Col xxl={22} xl={22} lg={22} md={23} sm={24} xs={24}>
            {isMealsLoading ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                  height: "100%",
                }}
              >
                <Spin />
              </div>
            ) : null}
            <List
              itemLayout={screen.xs && !screen.sm ? "vertical" : "horizontal"}
              dataSource={filteredMeals}
              pagination={{ pageSize: 10, position: "bottom" }}
              className="drawer__row-list"
              renderItem={(meal) => (
                <List.Item
                  key={meal.id}
                  actions={[
                    <Button
                      type="dashed"
                      onClick={() => {
                        setCurOperation("edit");
                        form.setFieldsValue({
                          name: meal.name,
                          dateTime: moment().set({
                            year: meal.year,
                            month: meal.month - 1,
                            date: meal.date,
                            hour: meal.hour,
                            minute: meal.minute,
                          }),
                          calories: meal.calories,
                          id: meal.id,
                        });
                        setModalVisible(true);
                      }}
                    >
                      Edit
                    </Button>,
                    <Popconfirm
                      okText="Yes"
                      cancelText="No"
                      title="Confirm Delete"
                      onConfirm={() => handleDelete(meal)}
                      icon={<DeleteOutlined style={{ color: "#f50057" }} />}
                    >
                      <Button danger>Delete</Button>
                    </Popconfirm>,
                  ]}
                  className="drawer__row-listItem"
                >
                  <Skeleton title={false} active loading={false}>
                    <List.Item.Meta
                      title={meal.name}
                      description={`${datePrettify(
                        meal.date,
                        meal.month,
                        meal.year
                      )} ${timePrettify(meal.hour, meal.minute)}`}
                    />
                    <div>
                      <span> Calories : {meal.calories}</span>
                    </div>
                  </Skeleton>
                </List.Item>
              )}
            />
          </Col>
        </Row>
      </Drawer>
      <Modal
        zIndex={1001}
        title={curOperation === "add" ? "Add Meal" : "Edit Meal"}
        centered
        visible={modalVisible}
        onOk={() => {
          if (curOperation === "add") addHandler();
          else editHandler();
        }}
        onCancel={() => {
          setModalVisible(false);
        }}
        className="userRecord__modal"
      >
        <Row align="middle" justify="center" className="modal__row">
          <Form
            {...modalItemLayout}
            layout="horizontal"
            style={{ width: "100%" }}
            form={form}
          >
            <Form.Item
              label="Meal Name"
              name="name"
              rules={[
                {
                  required: true,
                  message: "Meal Name is required",
                },
                {
                  type: "string",
                  max: 60,
                  message: "Meal name cannot be greater than 60 characters",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Date And Time"
              name="dateTime"
              rules={[
                {
                  required: true,
                  message: "Meal date and time are required",
                },
              ]}
            >
              <DatePicker
                showTime
                showNow
                format="YYYY-MM-DD HH:mm"
                disabledDate={(d) => !d || d.isAfter(tomorrow())}
              />
            </Form.Item>
            <Form.Item
              label="Calories"
              name="calories"
              rules={[
                {
                  required: true,
                  message: "Calories are required",
                },
                {
                  type: "number",
                  min: 1,
                  message: "calories cannot be 0 or negative",
                },
                {
                  type: "number",
                  max: 100000,
                  message: "calories must be less than 100000",
                },
              ]}
            >
              <InputNumber precision={0} />
            </Form.Item>
            <Form.Item
              label="id"
              name="id"
              rules={[
                {
                  required: true,
                },
              ]}
              style={{ display: "none" }}
            >
              <Input disabled />
            </Form.Item>
          </Form>
        </Row>
      </Modal>
    </>
  );
};

export default UserRecordUpdate;
