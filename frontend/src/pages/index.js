import styles from '../styles.module.css'

import { Button, AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import {BrowserRouter as Router} from 'react-router-dom';

import Home from './home';

var loginButton = {
  backgroundColor: "blue",
  color: "white",
  borderColor: "white",
  marginRight: "25px"
};

function App() {
  return (
    <div className="App">
      <Home/>
    </div>
  );
};

export default App;
