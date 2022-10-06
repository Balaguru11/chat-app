import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import "./index.css";

import axios from "axios";

axios.defaults.baseURL = process.env.REACT_APP_BASEURL;

axios.interceptors.request.use((request) => {
  const token = `Bearer ${localStorage.getItem("token")}`;
  request.headers.authorization = token;
  return request;
});

export const myAxios = axios.create({
  baseUrl: process.env.REACT_APP_BASEURL,
  headers: {
    "content-type": "application/json",
    authorization: `Bearer ${localStorage.getItem("token")}`,
    "Access-Control-Allow-Credentials": true,
  },
});

myAxios.interceptors.response.use((response) => {
  console.log("axios res", response);
  return response;
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
