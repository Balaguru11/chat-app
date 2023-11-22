import React from "react";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Divider,
  Box,
  Chip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const ChatRoomCard = ({ socket, room }) => {
  const navigate = useNavigate();
  const { state } = useAuth();

  const joinRoom = (e, room) => {
    e.preventDefault();
    if (room !== "" && state?.username !== "") {
      socket.emit("join_room", {
        userId: state?.userId,
        username: state?.username,
        room,
      });
      navigate(`/chat/${room}`);
    }
  };
  return (
    <>
      <Card key={room._id} sx={{ m: 1, boxShadow: 3, display: "flex" }}>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <CardContent>
            <Typography variant="h6" component="h5">
              {room.chatRoomTitle}
            </Typography>
            <Typography variant="caption" component="p">
              Category: {room.chatRoomCategory} |{" "}
              {room.chatRoomType.toUpperCase()} Group
            </Typography>
            <Chip
              label={`Live Users: ${room.usersChatting.length}`}
              sx={{ backgroundColor: "papayawhip" }}
            />
          </CardContent>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CardActions>
            <Button
              variant="contained"
              color="warning"
              size="small"
              onClick={(e) => joinRoom(e, room._id)}
            >
              Join
            </Button>
          </CardActions>
        </Box>
      </Card>
    </>
  );
};

export default ChatRoomCard;
