import axios from "axios";
import { REST_CONFIG } from "../constants/rest-config";
// import { history } from "../App";

const httpHandler = ({ url, method, payload = {}, params = {}, formData = undefined, isLoader = true, isAuth }) => {
  //LoaderHandler('show');
  isLoader ? LoaderHandler('show') : LoaderHandler('hide');

  // const finalUrl = `${REST_CONFIG.METHOD}://${REST_CONFIG.BASEURL}:${REST_CONFIG.PORT}/${REST_CONFIG.RESTAPPNAME}${url}`;
  // const finalUrl = `${REST_CONFIG.METHOD}://${REST_CONFIG.BASEURL}:${REST_CONFIG.PORT}${url}`;
  const finalUrl = !isAuth ? `${REST_CONFIG.METHOD}://${REST_CONFIG.BASEURL}/api/v1${url}`
    : `${REST_CONFIG.METHOD}://${REST_CONFIG.BASEURL_AUTH}${url}`;

  /*
  if (method === "get") {
    return axios[method](finalUrl, { params });
  } else {
    return axios[method](finalUrl, payload);
  }
  */

  if (method === "get") {
    return axios[method](finalUrl, { params });
  }
  else if (method === "post" || method === "put") {
    if (formData !== undefined) {
      return axios[method](finalUrl, formData);
    } else {
      return axios[method](finalUrl, payload);
    }
  }
  else {
    return axios[method](finalUrl, payload);
  }

};

axios.interceptors.request.use(function (config) {
  debugger
  const userData = sessionStorage.userData ? JSON.parse(sessionStorage.userData) : {};
  const isLoggedIn = userData.accessToken
    ? userData.accessToken
    : "";
  if (config?.data?.tokenValue) {
    delete config?.data?.tokenValue
  }
  if (isLoggedIn || config?.data?.tokenValue) {
    config.headers["Authorization"] = `Bearer ${isLoggedIn || config?.data?.tokenValue}`;
  }

  return config;
});

axios.interceptors.response.use(
  (req) => {
    // Add configurations here
    LoaderHandler('hide');
    return req;
  },

  (err) => {
    LoaderHandler('hide');
    if (err?.response?.data.status === '401') {
      ErrorHandling()

    }
    return Promise.reject(err);
  }
);

axios.interceptors.response.use(
  (res) => {
    LoaderHandler('hide');
    return res;
  },
  (err) => {
    LoaderHandler('hide');
    if (err?.response?.data.status === 401) {
      ErrorHandling()
    }
    return Promise.reject(err);
  }
);

const ErrorHandling = () => {
  // history.push(`${process.env.PUBLIC_URL}/login/signin`);
  // history.push(`${process.env.PUBLIC_URL}/login/signin`);
  sessionStorage.clear();
  window.location.href = `${process.env.PUBLIC_URL}/login/signin`;
}

const LoaderHandler = (arg) => {
  const element = document.getElementById('loader-container');
  element.classList.remove('d-none', 'd-block');

  if (arg === 'show') {
    element.classList.add('d-block');
  } else {
    element.classList.add('d-none');
  }


}

export { httpHandler, ErrorHandling };
