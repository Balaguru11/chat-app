import React, { useState, useEffect } from "react";
import ChatRoomCardList from "../Components/ChatRoomCardList";
import CreateChatRoom from "../Components/CreateChatRoom";
import { Box, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { myAxios } from "../index";
const HomePage = ({ socket }) => {
  const navigate = useNavigate();
  const [ok, setOk] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/");
    }
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <Container>
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
