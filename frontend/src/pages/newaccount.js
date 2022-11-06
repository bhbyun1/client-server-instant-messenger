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
  // used to update the log out button to appear after logging in
  // const {setVisible} = useContext(CategoryContext);
  // used to go back to the main home page and goto new account page
  // const history = useNavigate();
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
    let username = user.username;
    let password = user.password;

    fetch('http://localhost:5000/user', {
      method: 'POST',
      body: { 'username': username, 'password': password }
    }).then(function (response) {
      if (response.ok) {
        return response.json();
      }
      throw response;
    }).then(function (data) {
      console.log(data);
    }).catch(function (error) {
      console.warn(error);
    });
  };

  return (
    <form onSubmit={onSubmit}>
        <AppBar sx={{position: 'fixed'}}>
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
              href="./home">
              Home
            </Button>
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

export default Login;

// const LoginWrapper = () => {
//   return (
//     <Router>
//       <Login />
//     </Router>
//   );
// };

// export default LoginWrapper;