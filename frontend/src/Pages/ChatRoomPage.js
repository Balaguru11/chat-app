import React, { useState, useEffect } from "react";
import { myAxios } from "../index";
// import CreateChatRoom from "../Components/CreateChatRoom";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Box, Grid, TextField, Button } from "@mui/material";
import useAuth from "../hooks/useAuth";
import MsgCard from "../Components/MsgCard";
// chatroom : chat page

const ChatRoomPage = ({ socket }) => {
  const { state, dispatch } = useAuth();
  const [messages, setMessages] = useState([]);
  const { roomid } = useParams();
  const navigate = useNavigate();
  const [crName, setCrName] = useState("");
  const [msgText, setMsgText] = useState("");

  console.log(state);

  useEffect(() => {
    if (!state?.isLoggedIn) {
      navigate("/signin");
    }
  }, []);

  //get room data
  const roomData = async (roomid) => {
    myAxios
      .get(`/safe/chat/${roomid}`)
      .then((res) => {
        res?.status === 200 && setCrName(res.data.chatRoomTitle);
        console.log("roomData", res);
        roomMsgs(res.data._id);
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
  const sendMessage = (e) => {
    e.preventDefault();
    // if (socket) {
    socket.emit("send_message", {
      message: msgText,
      userId: state?.userId,
      room: roomid,
      sendTime: Date.now(),
    });
    setMsgText("");
    // }
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      console.log(data);
      setMessages((state) => [
        ...state,
        {
          message: data.message,
          username: data.username,
          room: data.room,
          sendTime: data.sendTime,
        },
      ]);
    });
    // Remove event listener on component unmount
    return () => socket.off("receive_message");
    //eslint-disable-next-line
  }, [socket]);

  const leaveHere = () => {
    socket.emit("leave_chatroom", {
      userId: state?.userId,
      username: state?.username,
      room: roomid,
    });
    // socket.disconnect();
    navigate("/home");
  };
  return (
    <>
      <Container sx={{ width: "100vh" }}>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            {/* Name of the Chatroom
        display messages (map here)
        form to add new message */}
            <Box sx={{ p: 1, m: 1, borderColor: "grey", display: "flex" }}>
              {crName}
            </Box>
            <MsgCard />
            {messages.length > 0 &&
              messages.map((m) =>
                m.userId === state?.userId ? (
                  <p>me: {m.message}</p>
                ) : (
                  <p>{m.message}</p>
                )
              )}
            <form onSubmit={(e) => sendMessage(e)}>
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
