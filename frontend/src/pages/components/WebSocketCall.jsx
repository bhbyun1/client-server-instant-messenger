import { useEffect, useState } from "react";
import Container from '@mui/material/Container';
import styles from '../../styles.module.css';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import SendIcon from '@mui/icons-material/Send';

export default function WebSocketCall({ socket }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const handleText = (e) => {
    const inputMessage = e.target.value;
    setMessage(inputMessage);
  };

  const handleSubmit = () => {
    if (!message) {
      return;
    }
    socket.emit("data", sessionStorage.Username + ": " + message);
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
      <Container maxWidth="sm">
      <ul>
        {messages.map((message, ind) => {
          return <li key={ind}>{message}</li>;
        })}
      </ul>

      <FormControl sx={{ m: 1, width: '80%' }} variant="outlined">
          <InputLabel htmlFor="text-input">Start typing...</InputLabel>
          <OutlinedInput
            id="text-input"
            type={'text'}
            value={message}
            onChange={handleText}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="send"
                  onClick={handleSubmit}
                  edge="end"
                >
                  <SendIcon />
                </IconButton>

              </InputAdornment>
            }
            label="text-input"
          />
      </FormControl>
      </Container>
    </div>
  );
}