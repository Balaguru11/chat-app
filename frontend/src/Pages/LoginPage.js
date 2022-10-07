import React from "react";
import Login from "../Components/Login";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  Divider,
  colors,
} from "@mui/material";

import useAuth from "../hooks/useAuth";

const LoginPage = (props) => {
  const navigate = useNavigate();
  const { state, dispatch } = useAuth();

  if (state?.token) {
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
              Login
            </Typography>
            <Typography variant="body1" fontSize="16px" textAlign="center">
              Enter your credentials to continue
            </Typography>
            <hr />
          </Box>
          <Box height={25} />
          <Login setupSocket={props.setupSocket} />
          <Box height={15} />
          <Divider />
          <Box height={15} />
          <Typography variant="subtitle1" component="p">
            Don't have an account?
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => navigate("/signup")}
          >
            SignUp Now
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default LoginPage;
