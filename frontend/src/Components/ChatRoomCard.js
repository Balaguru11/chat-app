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
const ChatRoomCard = (props) => {
  const navigate = useNavigate();
  const { state } = useAuth();

  const joinRoom = (e, room) => {
    if (room !== "" && state?.username !== "") {
      props.socket.emit("join_room", { username: state?.username, room });
      navigate(`/chat/${room}`);
    }
  };
  return (
    <>
      <Card key={props.room._id} sx={{ m: 1, boxShadow: 3, display: "flex" }}>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <CardContent>
            <Typography variant="h6" component="h5">
              {props.room.chatRoomTitle}
            </Typography>
            <Typography variant="caption" component="p">
              Category: {props.room.chatRoomCategory} |{" "}
              {props.room.chatRoomType.toUpperCase()} Group
            </Typography>
            <Chip
              label={`Live Users: ${props.room.usersChatting.length}`}
              sx={{ backgroundColor: "papayawhip" }}
            />
          </CardContent>
        </Box>
        <CardActions>
          <Button
            variant="contained"
            color="warning"
            size="small"
            onClick={(e) => joinRoom(e, props.room._id)}
          >
            Join
          </Button>
        </CardActions>
      </Card>
    </>
  );
};

export default ChatRoomCard;
