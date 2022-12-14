import { useEffect, useState } from "react";
import ConversationPanel from "./ConversationPanel";
import Message from './Message';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SendIcon from '@mui/icons-material/Send';
import styles from '../styles.module.css';
import CreateChat from "./CreateChat";
import { io } from "socket.io-client";
import { Button } from "@mui/material";
import configData from "../config.json";

export default function WebSocketCall({ socket }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([{'username': '', 'message': ''}]);
  const [showCreateChat, setShowCreateChat] = useState(false);
  const [showChat, setShowChat] = useState(true);

  const showCreateChatClick = () => {
    if (!showCreateChat) {
      setShowCreateChat(true);
    } else {
      setShowCreateChat(false);
    }
    console.log("now isssa " + showCreateChat);
    // setShowCreateChat(true);
  }

  const handleText = (e) => {
    const inputMessage = e.target.value;
    setMessage(inputMessage);
  };

  const handleSubmit = () => {
    if (!message) {
      return;
    }
    socket.emit("message", {'token': sessionStorage.token, 'content': message, 'public_id': sessionStorage.currentChat});
    setMessage("");
  };

  socket.emit("join", {'token': sessionStorage.token})
  useEffect(() => {
      socket.on("join", (data) => {
          console.log("received join response from socket");
          console.log(data);
      });
  });
  useEffect(() => {
    const socket = io(configData.HOSTNAME + ":5000/", {
    transports: ["websocket"],
    cors: {
        origin: configData.HOSTNAME + ":3000/",
    },
    });


    return function disconnect() {
    socket.disconnect();
    };

  }, [showChat])
  useEffect(() => {
    socket.on("message", (data) => {
      console.log("received data on socket");
      console.log(data);
      setMessages([...messages, data]);
    });
    return () => {
      socket.off("message", () => {
        console.log("message event was removed");
      });
    };
  }, [socket, messages]);


  return (
    <div>
      <div className={styles.chats_wrapper}>
        {/* <Typography variant="h5" className={styles.chats_header}>Select a Chat</Typography> */}
          <CreateChat
            open={showCreateChat}
            onClose={showCreateChatClick}
          />
          <Button sx={{ marginLeft: 1 }} variant="contained" onClick={showCreateChatClick}>Create Chat</Button>
        <ConversationPanel className={styles.conversation_panel} setConversationMessages={setMessages} />
      </div>
      <div className={styles.conversation_container}>
        <div className={styles.conversation}>
          <div className={styles.message_list}>
            {messages.map((data, ind) => {
              return (
                <Message key={ind} message={{'data': data, 'ind': ind, 'length': messages.length}} />
              );
            })}
          </div>
        </div>
        <div className={styles.text_field_wrapper}>
          <TextField
            className={styles.text_field}
            id="text-input"
            label="Start typing..."
            type={'text'}
            value={message}
            onChange={handleText}
            onKeyDown={(e) => {
                if (e.key === 'Enter'){
                  handleSubmit();
                }
              }
            }
            InputProps={{
              endAdornment: 
              <InputAdornment position="end">
                <IconButton
                  aria-label="send"
                  onClick={handleSubmit}
                  edge="end">
                <SendIcon />
                </IconButton>
              </InputAdornment>,
            }}
          />
        </div>
      </div>
    </div>
  );
}