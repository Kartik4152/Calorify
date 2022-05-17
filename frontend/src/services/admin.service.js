import axios from "axios";
import authHeader from "./auth.header";
import { userService } from "./user.service";

const ADMIN_API = "https://calorify.onrender.com/admin/";

class adminService extends userService {
  changeRole(id, newRole) {
    return axios
      .post(
        ADMIN_API + "changeUserRole",
        { id, role: newRole },
        { headers: authHeader() }
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

  createUser(password, email, name, role, calorielimit = 2000) {
    return axios
      .post(
        ADMIN_API + "users",
        {
          password,
          email,
          name,
          calorielimit,
          role,
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
  getUserByEmail(email) {
    return axios
      .get(`${ADMIN_API}users/byemail?email=${email}`, {
        headers: authHeader(),
      })
      .then((res) => {
        return res.data;
      })
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
  deleteUser(id) {
    return axios
      .delete(ADMIN_API + "users/" + id, { headers: authHeader() })
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
  getAllUsers(limit, offset) {
    return axios
      .get(ADMIN_API + "users", {
        headers: authHeader(),
        params: {
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
  editUser(newDetails) {
    if (newDetails.password === "") delete newDetails.password;
    delete newDetails.meals;
    return axios
      .put(ADMIN_API + "users", newDetails, { headers: authHeader() })
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

  addMeal(userid, meal) {
    return axios
      .post(ADMIN_API + "meals/", { userid, meal }, { headers: authHeader() })
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

  getMeals(userid, start_date, start_time, end_date, end_time, limit, offset) {
    return axios
      .get(ADMIN_API + "meals", {
        headers: authHeader(),
        params: {
          userid,
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

  editMeal(meal) {
    return axios
      .put(ADMIN_API + "meals/", meal, {
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
      .delete(ADMIN_API + "meal/" + id, { headers: authHeader() })
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
export default new adminService();
