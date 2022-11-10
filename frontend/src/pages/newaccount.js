import React, {useContext} from "react";
import styles from '../styles.module.css'
import { Button, Alert, AlertTitle, AppBar, Toolbar, Typography, TextField, IconButton, Box } from '@mui/material';
import useRouter from 'next/router';

const Register = () => {
  const router = useRouter;
  // conditionally display error if login credentials were invalid
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