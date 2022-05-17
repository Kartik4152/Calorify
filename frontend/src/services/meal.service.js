import axios from "axios";
import authHeader from "./auth.header";

const MEAL_API = "https://calorify.onrender.com/meals/";

class mealService {
  addMeal(meal) {
    return axios
      .post(MEAL_API, meal, { headers: authHeader() })
      .then((res) => res.data)
      .catch((err) => {
        if (err.response) {
          return Promise.reject(err.response.data.message);
        } else if (err.request) {
          console.log(err.request);
          return Promise.reject("No Response");
        } else {
          console.log(err.message);
          return Promise.reject(err.message);
        }
      });
  }
  getMeals(start_date, start_time, end_date, end_time, limit, offset) {
    return axios
      .get(MEAL_API, {
        headers: authHeader(),
        params: {
          startDate: start_date,
          startTime: start_time,
          endDate: end_date,
          endTime: end_time,
          limit,
          offset,
        },
      })
      .then((res) => res.data)
      .catch((err) => {
        if (err.response) {
          return Promise.reject(err.response.data.message);
        } else if (err.request) {
          console.log(err.request);
          return Promise.reject("No Response");
        } else {
          console.log(err.message);
          return Promise.reject(err.message);
        }
      });
  }
  updateMeal(meal) {
    return axios
      .put(MEAL_API, meal, {
        headers: authHeader(),
      })
      .then((res) => res.data)
      .catch((err) => {
        if (err.response) {
          return Promise.reject(err.response.data.message);
        } else if (err.request) {
          console.log(err.request);
          return Promise.reject("No Response");
        } else {
          console.log(err.message);
          return Promise.reject(err.message);
        }
      });
  }
  deleteMeal(id) {
    return axios
      .delete(MEAL_API + id, { headers: authHeader() })
      .then((res) => res.data)
      .catch((err) => {
        if (err.response) {
          return Promise.reject(err.response.data.message);
        } else if (err.request) {
          console.log(err.request);
          return Promise.reject("No Response");
        } else {
          console.log(err.message);
          return Promise.reject(err.message);
        }
      });
  }
}

export default new mealService();
