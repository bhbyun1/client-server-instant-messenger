import styles from '../styles.module.css'

import { Button, AppBar, Toolbar, Typography, IconButton } from '@mui/material';

var loginButton = {
  backgroundColor: "blue",
  color: "white",
  borderColor: "white",
  marginRight: "25px"
};

function App() {
  return (
    <div className="App">
      <AppBar sx={{position: 'fixed'}}>
        <Toolbar>
          <Typography variant='h6'>Login Screen</Typography>
          <IconButton
            sx={{marginLeft: 'auto'}}
            aria-label='close'
          >
          </IconButton>
          <Button
              variant='contained'
              type='submit'
              sx={{width: '7%', marginRight: '2%'}}
              href="./login">
              Login
          </Button>
          <Button
            variant='contained'
            type='submit'
            sx={{width: '8%'}}
            href="./chatpage">
            Chat Page
          </Button>
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default App;
