import React from "react";
import styles from '../styles.module.css'
import { Button, Grid, Paper, Card } from '@mui/material';
import SignIn from './signIn.js'

// var loginButton = {
//     backgroundColor: "gray",
//     color: "white",
//     borderColor: "black",
//     marginRight: "25px"
// };

const Login = () => {
    return (
        <div className="App">
            <SignIn></SignIn>
        </div>
      );
};

export default Login;