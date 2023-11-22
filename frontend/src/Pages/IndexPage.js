import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const IndexPage = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useAuth();

  useEffect(() => {
    const token = localStorage.getItem("token") || state?.token;

    if (token) {
      navigate("/home");
    } else {
      navigate("/signin");
    }
    //elint-disable-next-line
  }, []);

  return <div></div>;
};

export default IndexPage;
