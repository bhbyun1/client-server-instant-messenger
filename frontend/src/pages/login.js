import React from "react";
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

// var loginButton = {
//     backgroundColor: "gray",
//     color: "white",
//     borderColor: "black",
//     marginRight: "25px"
// };

const Login = () => {
    return (
        <div>
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
              title='email'
              label='email'
              name='email'
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
        </div>
    );
};

export default Login;