import axios from "axios";
import authHeader from "./auth.header";
import { userService } from "./user.service";

const MOD_API = "https://calorify.onrender.com/moderator/";
class modService extends userService {
  createUser(password, email, name, role, calorielimit = 2000) {
    return axios
      .post(
        MOD_API + "users",
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
      .get(`${MOD_API}user?email=${email}`, {
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
      .delete(MOD_API + "users/" + id, { headers: authHeader() })
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
      .get(MOD_API + "users", {
        headers: authHeader(),
        params: { limit, offset },
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
  editUser(newuser) {
    if (newuser.password === "") delete newuser.password;
    delete newuser.meals;
    return axios
      .put(MOD_API + "users", newuser, { headers: authHeader() })
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

export default new modService();
export { modService };
