import React, {useContext} from "react";
import styles from '../styles.module.css'
import { Button, Grid, Paper, Card } from '@mui/material';
import SignIn from './signIn.js'
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
// import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
// import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
// import CategoryContext from './CategoryContext';
// import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Box from '@mui/material/Box';
// import styles from '../styles.module.css'
// import {useNavigate} from 'react-router-dom';
// import {BrowserRouter as Router} from 'react-router-dom';
import useRouter from 'next/router';
// import Router from "react-router-dom";

const Login = () => {
  const [user, setUser] = React.useState({username: '', password: ''});
  // updates state for displaying eror when email/password is incorrect
  const [error, setError] = React.useState('');
  const router = useRouter;
  const handleInputChange = (event) => {
    // grabs data from input boxes
    const {value, name} = event.target;
    // grabs from the user state
    const u = user;
    // u[name] is the actual input
    u[name] = value;
    // sets the state defined above
    setUser(u);
  };

  const onSubmit = (event) => {
    event.preventDefault();
    // checks with db that user exists
    const username = user.username;
    const password = user.password;
    
    let headers = new Headers();
    headers.set('Content-Type', 'application/json');
    headers.set('Authorization', 'Basic ' + Buffer.from(username + ":" + password).toString('base64'));

    fetch('http://localhost:5000/login', {
      headers: headers,
      method: 'POST',
      body: JSON.stringify({ 'username': username, 'password': password })
    }).then((response) => response.json())
    .then((response) => {
      if (response.token) {
        sessionStorage.setItem('token', response['token'])
        sessionStorage.setItem('Username', username);
        router.push('http://localhost:3000/chatpage');
        return response;
      } else {
        // TODO: Maybe show alert that username and password are wrong
        router.reload();
      }
    });
  };
  

  return (
    <form onSubmit={onSubmit}>
        <AppBar sx={{position: 'fixed'}}>
          <Toolbar>
            <Typography variant='h6'>Login Screen</Typography>
            <IconButton
              sx={{marginLeft: 'auto'}}
              aria-label='close'
            >
            </IconButton>
          </Toolbar>
        </AppBar>
        <div className={styles.login_box}>
        <Box sx={{my: '10%', display: 'flex', justifyContent: 'center', flexDirection: 'column'}}>
          <TextField
            id='outlined-search'
            title='username'
            label='username'
            name='username'
            onChange={handleInputChange}
            required
            sx={{my: '2%', width: '300px'}}
          />
          <TextField
            id='outlined-search'
            title='password'
            label='password'
            name='password'
            onChange={handleInputChange}
            required
            sx={{my: '3%', width: '300px'}}
          />
          <Button
            variant='contained'
            type='submit'
            // onClick={onSubmit}
            sx={{my: '3%', width: '300px'}}>
            Login
          </Button>
          <Button
            variant='contained'
            href='/newaccount'
            sx={{width: '300px'}}>
            New User
          </Button>
          <Typography variant='subtitle1'>
          </Typography>
        </Box>
      </div>
    </form>
  );
};

export default Login;