import { useEffect, useState } from "react";
import ConversationPanel from "./ConversationPanel";
import Message from './Message';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SendIcon from '@mui/icons-material/Send';
import styles from '../../styles.module.css';

export default function WebSocketCall({ socket }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([{'username': '', 'message': ''}]);

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
      <h2>WebSocket Communication</h2>
      <ConversationPanel setConversationMessages={setMessages} />
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
                if (e.key == 'Enter'){
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