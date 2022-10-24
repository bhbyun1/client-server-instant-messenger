// import "./App.css";
import HttpCall from "./components/HttpCall";
import WebSocketCall from "./components/WebSocketCall";
import { io } from "socket.io-client";
import { useEffect, useState } from "react";

function Chatpage() {
  const [socketInstance, setSocketInstance] = useState("");
  const [loading, setLoading] = useState(true);
  const [showChat, setShowChat] = useState(false);

  const showChatClick = () => {
    if (!showChat) {
      setShowChat(true);
    } else {
      setShowChat(false);
    }
  };

  useEffect(() => {
    if (showChat) {
      const socket = io("localhost:5000/", {
        transports: ["websocket"],
        cors: {
          origin: "http://localhost:3000/",
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
      <div>
        {/* <HttpCall /> */}
      </div>
      {!showChat ? (
        <button onClick={showChatClick}>Chat On</button>
      ) : (
        <>
          <button onClick={showChatClick}>Chat Off</button>
          <div>
            {!loading && <WebSocketCall socket={socketInstance} />}
          </div>
        </>
      )}
    </div>
  );
}

export default Chatpage;