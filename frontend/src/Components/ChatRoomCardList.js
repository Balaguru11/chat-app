import React, { useState, useEffect } from "react";
import ChatRoomCard from "./ChatRoomCard";
import { myAxios } from "../index";
import { Grid, Box } from "@mui/material";
import useAuth from "../hooks/useAuth";

const ChatRoomCardList = ({ ok, socket }) => {
  const [crs, setCrs] = useState([]);
  const { state } = useAuth();

  const getAllRooms = async () => {
    await myAxios
      .get("/safe/chat")
      .then((res) => {
        console.log(res);
        res?.status === 200 && setCrs(res.data);
      })
      .catch((err) => console.log(err));
    // try {
    //   let response = await myAxios.get("/safe/chat");
    //   console.log("getAllChatrooms", response);
    //   response?.data && setCrs(response.data);
    // } catch (err) {
    //   console.log(err);
    // }
  };

  useEffect(() => {
    if (state?.isLoggedIn) {
      getAllRooms();
    }
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
