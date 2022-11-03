import { useEffect, useState } from "react";
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
    socket.emit("data", {'username': sessionStorage.Username + ": ", 'message': message});
    setMessage("");
  };

  useEffect(() => {
    socket.on("data", (data) => {
      setMessages([...messages, data.data]);
    });
    return () => {
      socket.off("data", () => {
        console.log("data event was removed");
      });
    };
  }, [socket, messages]);

  return (
    <div>
      <h2>WebSocket Communication</h2>
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