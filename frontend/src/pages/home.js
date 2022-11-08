import styles from '../styles.module.css'
import React, {useEffect} from "react";
import { Button, AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import useRouter from 'next/router';

var loginButton = {
  backgroundColor: "blue",
  color: "white",
  borderColor: "white",
  marginRight: "25px"
};

function Home() {
  const router = useRouter;

  useEffect(() => {
    router.push(localStorage.getItem("Username") ? '/chatpage' : '/newaccount');
  });
};

export default Home;
