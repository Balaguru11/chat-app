import React, { useState, useEffect } from "react";
import { myAxios } from "../index";
// import CreateChatRoom from "../Components/CreateChatRoom";
import { useParams } from "react-router-dom";
import { Container, Box, Grid, TextField, Button } from "@mui/material";

// chatroom : chat page

const ChatRoomPage = ({ socket, token }) => {
  const [messages, setMessages] = useState([]);
  const { roomid } = useParams();
  const userId = localStorage.getItem("userId");
  const username = localStorage.getItem("username");
  const [crName, setCrName] = useState("");
  const [msgText, setMsgText] = useState("");

  // socket.emit("connect", socket);

  console.log("socket from chatroomPage", socket);

  //get room data
  const roomData = async (roomid) => {
    myAxios
      .get(`/safe/chat/${roomid}`)
      .then((res) => {
        res?.status === 200 && setCrName(res.data.chatRoomTitle);
        roomMsgs(res.data._id);
        console.log("roomData", res);
      })
      .catch((err) => console.log(err));
  };

  const roomMsgs = async (roomid) => {
    myAxios
      .get(`/safe/chat/message/${roomid}`)
      .then((res) => {
        console.log("roomMsgs", res);
        setMessages((prev) => [...prev, ...res.data]);
      })
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    roomData(roomid);

    //eslint-disable-next-line
  }, [roomid]);

  // as per the chat cosey
  const sendMessage = () => {
    if (socket) {
      //emit the message and clear the input field.
      socket.emit("send_message", {
        message: msgText,
        username,
        room: roomid,
        sendTime: Date.now(),
      });
      setMsgText("");
    }
  };

  useEffect(() => {
    if (socket) {
      console.log(socket.id);
      socket.on("receive_message", (data) => {
        console.log(data);
        setMessages((state) => [
          ...state,
          {
            message: data.message,
            userId: userId,
            room: roomid,
            sendTime: data.sendTime,
          },
        ]);
      });
    }
    // Remove event listener on component unmount
    return () => socket.off("receive_message");
    //eslint-disable-next-line
  }, []);

  const leaveHere = () => {
    socket.emit("disconnect");
  };
  return (
    <>
      <Container>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            {/* Name of the Chatroom
        display messages (map here)
        form to add new message */}
            <Box sx={{ p: 1, m: 1, borderColor: "grey", display: "flex" }}>
              {crName}
            </Box>
            {messages.length > 0 && messages.map((m) => <p>{m.message}</p>)}
            <form onSubmit={sendMessage}>
              <TextField
                type="text"
                name="message"
                placeholder="Say something!"
                value={msgText}
                onChange={(e) => setMsgText(e.target.value)}
              />
              <Button type="submit">Send</Button>
            </form>
          </Grid>
        </Grid>
        <Button onClick={leaveHere}>Leave</Button>
      </Container>
    </>
  );
};

export default ChatRoomPage;
