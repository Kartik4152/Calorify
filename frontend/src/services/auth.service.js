import axios from "axios";
import authHeader from "./auth.header";

const PROD_API = "https://calorify.onrender.com/authentication/";

class AuthService {
  login(email, password, remember) {
    return axios
      .post(PROD_API + "login", {
        email,
        password,
      })
      .then((res) => {
        if (remember)
          localStorage.setItem("jwt", JSON.stringify(res.data.access_token));
        else
          sessionStorage.setItem("jwt", JSON.stringify(res.data.access_token));
        return res.status;
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

  signout() {
    localStorage.clear();
    sessionStorage.clear();
  }

  signup({ name, email, password }) {
    return axios
      .post(PROD_API + "signup", {
        name,
        email,
        password,
      })
      .then((res) => res.status)
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

  getAccessToken() {
    if (sessionStorage.getItem("jwt"))
      return JSON.parse(sessionStorage.getItem("jwt"));
    else return JSON.parse(localStorage.getItem("jwt"));
  }
  async checkLoginState() {
    return axios
      .get("https://calorify.onrender.com/user/calorielimit", {
        headers: authHeader(),
      })
      .then((res) => res.status === 200)
      .catch((err) => false);
  }
}

export default new AuthService();
