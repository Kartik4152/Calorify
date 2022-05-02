//dependencies
import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { useHistory } from "react-router";

//style
import "./Meals.scss";

//components
import { Column } from "@ant-design/charts";
import {
  DatePicker,
  Row,
  Col,
  Divider,
  Typography,
  Popconfirm,
  message,
  Grid,
  Modal,
  Form,
  InputNumber,
  Input,
  TimePicker,
  Button,
  Space,
  List,
  Empty,
  Spin,
} from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

//services
import mealService from "../../services/meal.service";

// functions
import { datePrettify, timePrettify } from "../../functions/prettify";

import tomorrow from "../../functions/tomorrow";

const Meals = () => {
  const [isLoading, setIsLoading] = useState(true);
  const history = useHistory();
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { meals } = useSelector((state) => state);
  const calorielimit = useSelector((state) => state.user.calorielimit);
  const [filterDateStart, setFilterDateStart] = useState(null);
  const [filterDateEnd, setFilterDateEnd] = useState(null);
  const [filterTimeStart, setFilterTimeStart] = useState(null);
  const [filterTimeEnd, setFilterTimeEnd] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [pageSize, setPageSize] = useState(20);

  const setMealData = useCallback(() => {
    setIsLoading(true);
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
        hour: tm_start.hours,
        minute: tm_start.minutes,
      };
      end = {
        ...end,
        hour: tm_end.hours,
        minute: tm_end.minutes,
      };
    }
    mealService
      .getMeals(
        end.date !== undefined
          ? datePrettify(start.date, start.month, start.year)
          : null,
        end.hour !== undefined ? timePrettify(start.hour, start.minute) : null,
        end.date !== undefined
          ? datePrettify(end.date, end.month, end.year)
          : null,
        end.hour !== undefined ? timePrettify(end.hour, end.minute) : null,
        null,
        null
      )
      .then((mls) => {
        dispatch({ type: "SET_MEALS", payload: mls });
        setIsLoading(false);
      })
      .catch((status) => message.error(`${status}`));
  }, [
    filterDateStart,
    filterDateEnd,
    filterTimeStart,
    filterTimeEnd,
    dispatch,
  ]);

  // set filteredMeals when filter changes
  useEffect(() => {
    setMealData();
  }, [
    filterDateStart,
    filterDateEnd,
    filterTimeStart,
    filterTimeEnd,
    setMealData,
  ]);

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

  // deletes meal on server and refetch to redux
  const deleteHandler = useCallback(
    (id) => {
      mealService
        .deleteMeal(id)
        .then(() => {
          setMealData();
        })
        .catch((status) => message.error(`${status}`));
    },
    [setMealData]
  );

  // edits on server and refetch to redux
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
    mealService
      .updateMeal(edited_meal)
      .then((res) => {
        setMealData();
        message.success("Edited Meal!");
        setModalVisible(false);
      })
      .catch((status) => message.error(`${status}`));
  };

  // graph configuration
  const config = {
    autoFit: true,
    data: meals
      .slice()
      .reverse()
      .map((meal) => {
        return {
          name: meal.name,
          calories: meal.calories,
          date: datePrettify(meal.date, meal.month, meal.year),
        };
      }),
    isStack: true,
    seriesField: "name",
    xField: "date",
    yField: "calories",
    label: {
      position: "middle",
      content: (item) => {
        return item.calories;
      },
      style: {
        fill: "#FFFFFF",
        opacity: 1,
      },
    },
    slider: {
      start: 0,
      end: 1,
    },
    legend: false,
    maxColumnWidth: 100,
    columnStyle: (ele) => {},
  };

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

  const MealItem = useCallback(
    ({ meal }) => {
      return (
        <Col span={24}>
          <div
            className={`meals__card ${
              meal.totalforday <= calorielimit ? "healthy" : "unhealthy"
            }`}
          >
            <Typography.Title
              className="meals__card-title"
              ellipsis={{
                tooltip: true,
              }}
            >
              {meal.name}
            </Typography.Title>
            <Divider />
            <Typography.Paragraph>
              {`${meal.calories} calories`}
            </Typography.Paragraph>
            <Typography.Paragraph>
              {`Date : ${datePrettify(meal.date, meal.month, meal.year)}`}
            </Typography.Paragraph>
            <Typography.Paragraph>
              {`Time : ${timePrettify(meal.hour, meal.minute)}`}
            </Typography.Paragraph>
            <div className="meals__card-icon">
              <Popconfirm
                title="Are you sure?"
                okText="Yes"
                cancelText="No"
                onConfirm={() => deleteHandler(meal.id)}
              >
                <DeleteOutlined />
              </Popconfirm>
              <EditOutlined
                onClick={() => {
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
              />
            </div>
          </div>
        </Col>
      );
    },
    [calorielimit, form, deleteHandler]
  );

  return (
    <>
      <Row className="filter" justify="center" align="middle">
        <Col
          xxl={10}
          xl={10}
          lg={12}
          md={16}
          sm={16}
          xs={20}
          style={{ display: "flex", justifyContent: "center" }}
        >
          <Space
            direction={screen.xs ? "vertical" : "horizontal"}
            size="middle"
          >
            <DatePicker.RangePicker
              inputReadOnly
              className="datePickerFilter"
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
              disabledDate={(d) => !d || d.isAfter(tomorrow())}
            ></DatePicker.RangePicker>
            <TimePicker.RangePicker
              inputReadOnly
              value={[filterTimeStart, filterTimeEnd]}
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
              format="HH:mm"
              onChange={handleTimeFilter}
            ></TimePicker.RangePicker>
          </Space>
        </Col>
      </Row>
      {isLoading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "50%",
          }}
        >
          <Spin />
        </div>
      ) : meals.length > 0 ? (
        <Row className="graph" justify="center" align="middle">
          <Col
            xxl={10}
            xl={10}
            lg={10}
            md={12}
            sm={16}
            xs={20}
            style={{ height: "300px" }}
          >
            <Column {...config} />
          </Col>
        </Row>
      ) : (
        <div
          style={{
            height: "80vh",
            justifyContent: "center",
            alignItems: "center",
            display: "flex",
          }}
        >
          <Empty description={<span>No meals added yet.</span>}>
            <Button type="primary" onClick={() => history.push("/addmeal")}>
              Add Meal
            </Button>
          </Empty>
        </div>
      )}

      {meals.length > 0 && (
        <List
          dataSource={meals}
          grid={{
            gutter: 12,
            xs: 2,
            sm: 2,
            md: 2,
            lg: 4,
            xl: 5,
            xxl: 5,
          }}
          pagination={{
            pageSize: pageSize,
            showSizeChanger: true,
            total: meals.length,
            onShowSizeChange: (cur, size) => {
              setPageSize(size);
            },
            pageSizeOptions: [20, 40, 80],
          }}
          renderItem={(meal) => {
            return (
              <List.Item key={meal.id}>
                <MealItem meal={meal} />
              </List.Item>
            );
          }}
        />
      )}

      <Modal
        title="Edit Meal"
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
              label="Meal Name"
              name="name"
              rules={[
                {
                  required: true,
                  message: "Meal name is required",
                },
                {
                  type: "string",
                  max: 60,
                  message: "Max meal name length is 60",
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
                  message: "Date and Time are required",
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
                  message: "Calories cannot be 0 or negative",
                },
                {
                  type: "number",
                  max: 100000,
                  message: "Calories cannot be more than 100000",
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

export default Meals;
