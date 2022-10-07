import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { string, object } from "yup";
import { Box, Container, TextField, Typography, Button } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const initialValues = {
  email: "",
  password: "",
};
const validationSchema = object({
  email: string().required("Email is required").email("Invalid Email format"),
  password: string().required("Password is required"),
});
const Login = ({ setupSocket }) => {
  const { state, dispatch } = useAuth();
  const navigate = useNavigate();
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values, formikHelpers) => {
        console.log(values);
        axios
          .post("/auth/signin", { ...values })
          .then((res) => {
            console.log(res);
            // localStorage.setItem("token", res.data.token);
            // localStorage.setItem("userId", res.data.others._id);
            // localStorage.setItem("username", res.data.others.username);
            dispatch({
              type: "LOGIN",
              payload: {
                userId: res.data.others._id,
                email: res.data.others.email,
                token: res.data.token,
                username: res.data.others.username,
              },
            });
            navigate("/home");
            setupSocket();
          })
          .catch((err) => console.log(err));

        formikHelpers.resetForm();
      }}
    >
      {(errors, touched) => (
        <Form>
          <Field
            name="email"
            id="email"
            // label="email"
            type="text"
            as={TextField}
            variant="outlined"
            color="primary"
            fullWidth
            error={Boolean(errors.email) && Boolean(touched.email)}
          />
          {errors.email && touched.email ? "" : <ErrorMessage name="email" />}
          <Box height={10} />
          <Field
            name="password"
            id="password"
            // label="password"
            type="password"
            as={TextField}
            variant="outlined"
            color="primary"
            fullWidth
            error={Boolean(errors.password) && Boolean(touched.password)}
          />
          {errors.password && touched.password ? (
            ""
          ) : (
            <ErrorMessage name="password" />
          )}
          <Box height={10} />
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Button type="submit" variant="contained" color="primary">
              Login
            </Button>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default Login;
