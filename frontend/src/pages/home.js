import React, {useEffect} from "react";
import useRouter from 'next/router';

function Home() {
  const router = useRouter;

  useEffect(() => {
    router.push(localStorage.getItem("Username") ? '/chatpage' : '/login');
  });
};

export default Home;
