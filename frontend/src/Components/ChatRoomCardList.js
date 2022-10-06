import React, { useState, useEffect } from "react";
import ChatRoomCard from "./ChatRoomCard";
import { myAxios } from "../index";
import { Grid, Box } from "@mui/material";

const ChatRoomCardList = ({ ok, socket }) => {
  const [crs, setCrs] = useState([]);

  const getAllRooms = async () => {
    await myAxios
      .get("/safe/chat")
      .then((res) => {
        console.log("getAllChatrooms", res);
        res?.data && setCrs(res.data);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    getAllRooms();
    //eslint-disable-next-line
  }, []);

  const Chatrooms = ({ crs }) => {
    return (
      <>
        <Box sx={{ pt: 3, justifyContent: "center", display: "flex" }}>
          <Grid container spacing={2}>
            {crs.map((room) => (
              <Grid item xs={12} sm={6} md={6} lg={4} xl={3}>
                <ChatRoomCard key={room._id} room={room} socket={socket} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </>
    );
  };

  return <>{crs.length > 0 && <Chatrooms crs={crs} />}</>;
};

export default ChatRoomCardList;
