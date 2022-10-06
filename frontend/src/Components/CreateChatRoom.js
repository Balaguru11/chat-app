import React, { useRef, useState, useEffect } from "react";
import { Box, TextField, Button, Typography, Grid } from "@mui/material";
import { myAxios } from "../index";

const CreateChatRoom = ({ ok, setOk }) => {
  const [newTitle, setNewTitle] = useState("");
  const inputRef = useRef(null);

  const createNew = (e) => {
    e.preventDefault();
    newChat(newTitle);
  };

  const newChat = async (newTitle) => {
    await myAxios
      .post("/safe/chat", { chatRoomTitle: newTitle })
      .then((res) => res?.status === 200 && setOk((prev) => !prev))
      .catch((err) => console.log(err));
  };

  return (
    <>
      <Grid container sx={{ display: "flex", justifyContent: "center" }}>
        <Grid fullWidth item xs={8} sm={8} md={8} lg={8}>
          <TextField
            fullWidth
            label="Chatroom title"
            variant="outlined"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
        </Grid>
        <Grid item sx={{ display: "flex" }}>
          <Button
            type="submit"
            variant="contained"
            color="secondary"
            onClick={(e) => {
              createNew(e);
            }}
          >
            Create
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default CreateChatRoom;
