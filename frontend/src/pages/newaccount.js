import React, {useContext} from "react";
import styles from '../styles.module.css'
import { Button, Grid, Paper, Card, Alert, AlertTitle } from '@mui/material';
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
import bcrypt from 'bcryptjs';

const Register = () => {
  // updates state for displaying eror when email/password is incorrect
  // used to update the log out button to appear after logging in
  // const {setVisible} = useContext(CategoryContext);
  // used to go back to the main home page and goto new account page
  // const history = useNavigate();
  const router = useRouter;
  const [showError, setShowError] = React.useState(false);
  let user = {username: '', password: ''}
  const handleInputChange = (event) => {
    const {value, name} = event.target;
    user[name] = value;
  };

  const onSubmit = (event) => {
    event.preventDefault();
    const username = user.username;
    const password = user.password;
    // checks with db that user exists
    fetch('http://localhost:5000/user', {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({ 'username': username, 'password': password })
    }).then((response) => response.json())
    .then((response) => {
      if (response.message == 'Registration successful') {
        router.push('http://localhost:3000/login');
        return response;
      } else {
        setShowError(true);
      }
    });
  };

  return (
    <form onSubmit={onSubmit}>
        <AppBar sx={{position: 'sticky'}}>
          <Toolbar>
            <Typography variant='h6'>Register</Typography>
            <IconButton
              sx={{marginLeft: 'auto'}}
              aria-label='close'
            >
            </IconButton>
            <Button
              variant='contained'
              type='submit'
              sx={{width: '7%'}}
              href="./login">
              Login
            </Button>
          </Toolbar>
        </AppBar>
        {showError && <Alert severity="error">
          <AlertTitle>Error</AlertTitle>
          Registration failed. A username with that account already exists.
        </Alert>}
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
            type='password'
            onChange={handleInputChange}
            required
            sx={{my: '3%', width: '300px'}}
          />
          <Button
            variant='contained'
            type='submit'
            // onClick={onSubmit}
            sx={{my: '3%', width: '300px'}}>
            Register
          </Button>
          <Typography variant='subtitle1'>
          </Typography>
        </Box>
      </div>
    </form>
  );
};

export default Register;

// const LoginWrapper = () => {
//   return (
//     <Router>
//       <Login />
//     </Router>
//   );
// };

// export default LoginWrapper;