import React, {useContext} from "react";
import styles from '../styles.module.css'
import { Button, AppBar, Toolbar, Typography, TextField, IconButton, Box, Alert, AlertTitle } from '@mui/material';
import { useRouter } from 'next/router';
// import Router from "react-router-dom";

const Login = () => {
  const [user, setUser] = React.useState({username: '', password: ''});
  // updates state for displaying eror when email/password is incorrect
  const [showError, setShowError] = React.useState(false);
  const router = useRouter();
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
    headers.set('Accept', 'application/json');
    headers.set('Authorization', 'Basic ' + Buffer.from(username + ":" + password).toString('base64'));

    fetch(process.env.NEXT_PUBLIC_BACKEND_HOSTNAME + "/login", {
      headers: headers,
      method: 'POST',
    }).then((response) => response.json())
    .then((response) => {
      if (response.token) {
        sessionStorage.setItem('token', response['token'])
        sessionStorage.setItem('Username', username);
        router.push("/chatpage");
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
            <Typography variant='h6'>Login Screen</Typography>
            <IconButton
              sx={{marginLeft: 'auto'}}
              aria-label='close'
            >
            </IconButton>
          </Toolbar>
        </AppBar>
        {showError && <Alert data-testid='alert' severity="error">
          <AlertTitle>Error</AlertTitle>
          Login failed. Invalid username or password.
        </Alert>}
        <div className={styles.login_box}>
        <Box sx={{my: '10%', display: 'flex', justifyContent: 'center', flexDirection: 'column'}}>
          <TextField
            id='outlined-search'
            title='username'
            label='username'
            name='username'
            data-testid='username'
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
            data-testid='password'
            onChange={handleInputChange}
            required
            sx={{my: '3%', width: '300px'}}
          />
          <Button
            variant='contained'
            type='submit'
            data-testid='submit'
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