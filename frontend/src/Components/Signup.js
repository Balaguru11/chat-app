import React from "react";
import { Box, TextField, Button } from "@mui/material";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { string, object } from "yup";
import { myAxios } from "../index";
import makeToast from "../Components/Toaster";
import { useNavigate } from "react-router-dom";

const initial = {
  username: "",
  email: "",
  password: "",
};

const validation = object({
  username: string().required("Username is required"),
  email: string().required("Email is required").email("Invalid email format"),
  password: string()
    .required("Password is required")
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/,
      "Must Contain 6 Characters and should include Upper and  Lowercase letters, Number and special Characters"
    ),
});

const Signup = () => {
  const navigate = useNavigate();
  return (
    <>
      <Formik
        initialValues={initial}
        validationSchema={validation}
        onSubmit={(values, formikHelpers) => {
          console.log(values);
          myAxios
            .post("/auth/signup", values)
            .then((res) => {
              console.log(res);
              makeToast("success", res.data.message);
              navigate("/signin");
            })
            .catch((err) => {
              makeToast("error", "Username / Email Id already exists");

              console.log(err);
            });
        }}
      >
        {(errors, touched) => (
          <Form>
            <Field
              label="Username"
              name="username"
              type="text"
              as={TextField}
              variant="standard"
              id="username"
              color="primary"
              fullWidth
              error={Boolean(errors.username) && Boolean(touched.username)}
            />
            {errors.username && touched.username ? (
              ""
            ) : (
              <ErrorMessage name="username" />
            )}
            <Box height={15} />
            <Field
              label="Email Id"
              name="email"
              type="email"
              as={TextField}
              variant="standard"
              id="email"
              color="primary"
              fullWidth
              error={Boolean(errors.email) && Boolean(touched.email)}
            />
            {errors.email && touched.email ? "" : <ErrorMessage name="email" />}
            <Box height={15} />

            <Field
              label="Password"
              name="password"
              type="password"
              as={TextField}
              variant="standard"
              id="password"
              color="primary"
              fullWidth
              error={Boolean(errors.password) && Boolean(touched.password)}
            />
            {errors.password && touched.password ? (
              ""
            ) : (
              <ErrorMessage name="password" />
            )}
            <Box height={15} />
            <Button type="submit" color="primary" variant="contained">
              SignUp
            </Button>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default Signup;
