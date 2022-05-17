import axios from "axios";
import authHeader from "./auth.header";

const USER_API = "https://calorify.onrender.com/user/";

class userService {
  getUser() {
    return axios
      .get(USER_API, { headers: authHeader() })
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
  getCaloriesLimit() {
    return axios
      .get(USER_API + "calorielimit", {
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
  editCaloriesLimit(calories) {
    return axios
      .post(
        USER_API + "calorielimit",
        {
          calorielimit: calories,
        },
        {
          headers: authHeader(),
        }
      )
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
export default new userService();
export { userService };
