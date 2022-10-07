import React, { useState, useEffect } from "react";
import ChatRoomCardList from "../Components/ChatRoomCardList";
import CreateChatRoom from "../Components/CreateChatRoom";
import { Box, Container, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const HomePage = ({ socket }) => {
  const navigate = useNavigate();
  const [ok, setOk] = useState(false);
  const { state, dispatch } = useAuth();
  console.log("state frok home page", state);

  useEffect(() => {
    if (!state?.isLoggedIn) {
      navigate("/signin");
    }
    // eslint-disable-next-line
  }, [state]);

  const logOut = () => {
    dispatch({
      type: "LOGOUT",
    });
  };
  return (
    <>
      <Container>
        {state?.isLoggedIn && (
          <Button onClick={logOut} variant="contained">
            Logout
          </Button>
        )}
        <Box fullWidth sx={{ p: 1, m: 1, backgroundColor: "grey" }}>
          <CreateChatRoom ok={ok} setOk={setOk} socket={socket} />
        </Box>

        <ChatRoomCardList ok={ok} socket={socket} />
      </Container>
      {/* A button should be placed here to Start a New Chat. On click of that, Create new chat form should appear as Modal */}
    </>
  );
};

export default HomePage;
