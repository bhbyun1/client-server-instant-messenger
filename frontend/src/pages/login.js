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
    sessionStorage.setItem("Username", user.username)
    if (0) {
      console.log(0);
    } else {
      router.push('/home');
    }
  }

  // const onSubmit = (event) => {
  //   event.preventDefault();
  //   // checks with db that user exists
  //   fetch('/insert/api/here', {
  //     method: 'POST',
  //     body: JSON.stringify(user),
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //   })
  //     .then((res) => {
  //       if (!res.ok) {
  //         throw res;
  //       }
  //       return res.json();
  //     })
  //     .then((json) => {
  //       // puts user into the localstorage
  //       localStorage.setItem('member', JSON.stringify(json));
  //       // log out button become visible
  //       // setVisible(true);
  //       // goto to home page
  //       // history.push('/');
  //     })
  //     .catch((error) => {
  //       // displays error for incorrect username/password
  //       setError(`${error.statusText} - wrong username or password`);
  //     });
  // };
  

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

// const LoginWrapper = () => {
//   return (
//     <Router>
//       <Login />
//     </Router>
//   );
// };

// export default LoginWrapper;