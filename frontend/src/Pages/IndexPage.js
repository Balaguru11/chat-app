import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const IndexPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

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
