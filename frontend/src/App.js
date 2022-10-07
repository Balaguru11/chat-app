import React, { useState, useEffect, createContext, useReducer } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import io from "socket.io-client";

import IndexPage from "./Pages/IndexPage";
import SignUpPage from "./Pages/SignUpPage";
import LoginPage from "./Pages/LoginPage";
import HomePage from "./Pages/HomePage";
import ChatRoomPage from "./Pages/ChatRoomPage";

//implementing context api

export const AuthContext = createContext({});

const initialState = {
  isLoggedIn: false,
  token: null,
  username: null,
  email: null,
  userId: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      localStorage.setItem("token", JSON.stringify(action.payload.token));
      localStorage.setItem("userId", JSON.stringify(action.payload.userId));
      localStorage.setItem("username", JSON.stringify(action.payload.username));
      localStorage.setItem("email", JSON.stringify(action.payload.email));

      return {
        ...state,
        isLoggedIn: true,
        token: action.payload.token,
        username: action.payload.username,
        email: action.payload.email,
        userId: action.payload.userId,
      };

    case "LOGOUT":
      localStorage.clear();
      return {
        ...state,
        isLoggedIn: false,
        username: null,
        email: null,
        userId: null,
        token: null,
      };

    default:
      return state;
  }
};

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const userId = JSON.parse(localStorage.getItem("userId") || null);
    const username = JSON.parse(localStorage.getItem("username") || null);
    const token = JSON.parse(localStorage.getItem("token") || null);
    const email = JSON.parse(localStorage.getItem("email") || null);

    if (userId && token) {
      dispatch({
        type: "LOGIN",
        payload: {
          userId,
          username,
          token,
          email,
        },
      });
    }
  }, []);

  const [socket, setSocket] = useState(null);

  const setupSocket = () => {
    if (state?.token && !socket) {
      const newSocket = io("http://localhost:8010", {
        query: {
          token: state?.token,
        },
      });

      console.log("newSocket", newSocket);

      newSocket.on("disconnect", () => {
        setSocket(null);
        setTimeout(setupSocket, 5000);
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
      <AuthContext.Provider value={{ state, dispatch }}>
        <div className="App">
          <Routes>
            <Route path="/" exact element={<IndexPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route
              path="/signin"
              element={<LoginPage setupSocket={setupSocket} />}
            />
            <Route path="/home" element={<HomePage socket={socket} />} />
            <Route
              path="/chat/:roomid"
              element={<ChatRoomPage socket={socket} />}
            />
          </Routes>
        </div>
      </AuthContext.Provider>
    </>
  );
};

export default App;
