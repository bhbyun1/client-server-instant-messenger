// import "./App.css";
// import HttpCall from "./components/HttpCall";
import WebSocketCall from "./components/WebSocketCall";
import { io } from "socket.io-client";
import React, { useEffect, useState } from "react";
import CreateChat from "./components/CreateChat";
import { AppBar, Toolbar, Typography, Button, IconButton } from "@mui/material";


function Chatpage() {
  const [socketInstance, setSocketInstance] = useState("");
  const [loading, setLoading] = useState(true);
  const [showChat, setShowChat] = useState(true);
  const [showCreateChat, setShowCreateChat] = useState(0);
  const [selectedValue, setSelectedValue] = useState([]);

  const showChatClick = () => {
    if (!showChat) {
      setShowChat(true);
    } else {
      setShowChat(false);
    }
  };

  const hideCreateChatClick =(value) => {
    setShowCreateChat(false);
    setSelectedValue(value);
    console.log(value);
  }

  const showCreateChatClick = () => {
    if (!showCreateChat) {
      setShowCreateChat(true);
    } else {
      setShowCreateChat(false);
    }
    console.log("now isssa " + showCreateChat);
    // setShowCreateChat(true);
  }

  const clearCredentials = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('Username');
  }

  useEffect(() => {
    if (showChat) {
      const socket = io("127.0.0.1:5000/", {
        transports: ["websocket"],
        cors: {
          origin: "http://127.0.0.1:3000/",
        },
      });

      setSocketInstance(socket);
      setLoading(false);

      return function disconnect() {
        socket.disconnect();
      };
    }
  }, [showChat]);

  return (
    <div className="App">
      <AppBar sx={{position: 'fixed', margin: '0', width: '100%'}}>
        <Toolbar>
          <Typography variant='h6'>Login Screen</Typography>
          <IconButton
          sx={{marginLeft: 'auto'}}
          aria-label='close'
          >
          </IconButton>
          <Button
              variant='contained'
              type='submit'
              sx={{width: '7%', float: 'left'}}
              onClick={clearCredentials}
              href="./login">
              Logout
          </Button>
        </Toolbar>
      </AppBar>
      <div>
        <div>
          {!loading && <WebSocketCall socket={socketInstance} />}
        </div>
        <CreateChat
          selectedValue={selectedValue}
          open={showCreateChat}
          onClose={showCreateChatClick}
        />
        <Button
          variant='contained'
          onClick={showCreateChatClick}
        >Create Chat</Button>
      </div>
    </div>
  );
}

export default Chatpage;
