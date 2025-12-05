import React from "react";
import { useAuth } from "../contexts/AuthContext";

const Home = () => {
  const { user } = useAuth();
  return (
    <>
      <h1>Home Page</h1>
    </>
  );
};

export default Home;
