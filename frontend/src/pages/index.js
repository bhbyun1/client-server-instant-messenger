import styles from '../styles.module.css'

import { Button } from '@mui/material';

var loginButton = {
  backgroundColor: "gray",
  color: "white",
  borderColor: "black",
  marginRight: "25px"
};

function App() {
  return (
    <div className="App">
      <header className={styles.App_background}>
        <header className={styles.App_header}>
          <p className={styles.App_title}>Client-Server Messenger</p>
          <Button variant="outlined" style={loginButton} href="./login">Login</Button>
          <Button variant="outlined" style={loginButton} href="./chatpage">Chatpage</Button>
        </header>
      </header>
    </div>
  );
}

export default App;
