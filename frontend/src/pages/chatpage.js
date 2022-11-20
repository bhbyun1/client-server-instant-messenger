import WebSocketCall from "./components/WebSocketCall";
import { io } from "socket.io-client";
import React, { useEffect, useState } from "react";
import CreateChat from "./components/CreateChat";
import { Button, AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import configData from "../config.json";

function Chatpage() {
  const [socketInstance, setSocketInstance] = useState("");
  const [loading, setLoading] = useState(true);
  const [showChat, setShowChat] = useState(true);

  useEffect(() => {
    if (showChat) {
      const socket = io(configData.HOSTNAME + ":5000/", {
        transports: ["websocket"],
        cors: {
          origin: configData.HOSTNAME + ":3000/",
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
      <AppBar sx={{position: 'sticky'}}>
        <Toolbar>
          <IconButton
            sx={{marginLeft: 'auto'}}
            aria-label='close'>
          </IconButton>
          <Button
            variant='contained'
            type='submit'
            sx={{width: '7%'}}
            href='/login'
            color='error'
            onClick={() => {
              sessionStorage.clear();
            }}
          >
          Logout
          </Button>
        </Toolbar>
      </AppBar>
      <br></br>
          <div>
            {!loading && <WebSocketCall socket={socketInstance} />}
          </div>
    </div>
  );
}

export default Chatpage;
