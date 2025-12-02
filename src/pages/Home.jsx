import React from "react";
import { useAuth } from "../contexts/AuthContext";

const Home = () => {
  const { user } = useAuth();
  return (
    <>
      <h1>Home Page</h1>
      {user && <p>{user.token.value}</p>}
    </>
  );
};

export default Home;
