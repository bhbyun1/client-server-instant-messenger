// import './_app.css';

import { Button } from '@mui/material';
import { BrowserRouter as Router, Link } from 'react-router-dom';
import Login from "./login.js"

var loginButton = {
  backgroundColor: "gray",
  color: "white",
  borderColor: "black",
  marginRight: "25px"
}

function App() {
  return (
    <div className="App">
      <header className="App-background">
        <header className="App-header">
          <p className="App-title">Client-Server Messenger</p>
          {/* <Button variant="outlined" style={loginButton} component={Login} to="./Login">Login</Button> */}
          {/* <Router>
            <div>
            <Link to="/Login">
                <Button variant="outlined" style={loginButton}>Login</Button>
            </Link>
            </div>
            <div>
            <Link>
                <Button variant="outlined" style={loginButton}>Register</Button>
            </Link>
            </div>
          </Router> */}
        </header>
      </header>
    </div>
  );
}

export default App;
