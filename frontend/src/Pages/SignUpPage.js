import React from "react";
import Signup from "../Components/Signup";
import { Grid, Typography, Box, Divider, Button } from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import makeToast from "../Components/Toaster";
const SignUpPage = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  if (token) {
    makeToast("warning", "Please signout to create a new account");
    navigate("/home");
  }

  return (
    <>
      <Grid
        container
        direction="row"
        sx={{
          backgroundColor: "#D8806D",
          height: "100vh",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Grid
          item
          sx={{
            p: 2,
            backgroundColor: "#fff",
            borderRadius: "10px",
            minWidth: "500px",
            boxShadow: 4,
          }}
        >
          <Box>
            <Typography variant="h4" component="h1" textAlign="center">
              Sign Up
            </Typography>
            <Typography variant="body1" fontSize="16px" textAlign="center">
              Enter your credentials to continue
            </Typography>
            <hr />
          </Box>
          <Box height={25} />
          <Signup />
          <Box height={15} />
          <Divider />
          <Box height={15} />
          <Typography variant="caption" component="p" display="inline">
            Already have an account?
          </Typography>{" "}
          <Link to="/signin">Sign In here</Link>
        </Grid>
      </Grid>
    </>
  );
};

export default SignUpPage;
