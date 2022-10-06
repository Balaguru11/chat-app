import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import io from "socket.io-client";

import IndexPage from "./Pages/IndexPage";
import SignUpPage from "./Pages/SignUpPage";
import LoginPage from "./Pages/LoginPage";
import HomePage from "./Pages/HomePage";
import ChatRoomPage from "./Pages/ChatRoomPage";

const App = () => {
  const [socket, setSocket] = useState(null);
  const token = localStorage.getItem("token") || null;

  const setupSocket = () => {
    if (token && !socket) {
      const newSocket = io("http://localhost:8010", {
        query: {
          token: token,
        },
      });

      newSocket.on("disconnect", () => {
        setSocket(null);
        // setTimeout(setupSocket, 5000);
        console.log("socket disconnected");
      });

      newSocket.on("connection", () => {
        console.log("socket connected");
      });

      setSocket(newSocket);
    }
  };

  useEffect(() => {
    setupSocket();
    //eslint-disable-next-line
  }, []);

  return (
    <>
      <div className="App">
        <Routes>
          <Route path="/" exact element={<IndexPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route
            path="/signin"
            element={<LoginPage setupSocket={setupSocket} token={token} />}
          />
          <Route path="/home" element={<HomePage socket={socket} />} />
          <Route
            path="/chat/:roomid"
            element={<ChatRoomPage socket={socket} token={token} />}
          />
        </Routes>
      </div>
    </>
  );
};

export default App;
