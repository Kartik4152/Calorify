//dependencies
import React from "react";
//services
import mealService from "../../services/meal.service";

//components
import {
  Form,
  Input,
  Button,
  DatePicker,
  InputNumber,
  Row,
  Divider,
  message,
} from "antd";
//style
import "./MealAdd.scss";
import tomorrow from "../../functions/tomorrow";

const MealAdd = () => {
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
  // on form submission add meal to server, and reset form
  const formHandler = (val) => {
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
    mealService
      .addMeal(meal)
      .then((res) => {
        form.resetFields();
        message.success("Added Meal!");
      })
      .catch((status) => message.error(`${status}`));
  };
  return (
    <>
      <Divider>Add Meal</Divider>
      <Row align="middle" justify="center" className="addMealRow">
        <Form
          form={form}
          {...itemLayout}
          layout="horizontal"
          onFinish={formHandler}
          style={{ width: "100%" }}
        >
          <Form.Item
            label="Meal Name"
            name="name"
            rules={[
              {
                required: true,
                message: "Meal name is required.",
              },
              {
                type: "string",
                max: 60,
                message: "Max Name Length Allowed is 60 characters",
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
                message: "Meal Date and Time Are required.",
              },
            ]}
          >
            <DatePicker
              showTime
              showNow
              format="YYYY-MM-DD HH:mm "
              disabledDate={(d) => !d || d.isAfter(tomorrow())}
            />
          </Form.Item>
          <Form.Item
            label="Calories"
            name="calories"
            rules={[
              {
                required: true,
                message: "Please Enter Calories",
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
          <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit">
              Add Meal
            </Button>
          </Form.Item>
        </Form>
      </Row>
    </>
  );
};

export default MealAdd;
