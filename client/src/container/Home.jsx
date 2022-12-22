import Cookies from "js-cookie";
import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const handleLogOut = () => {
    Cookies.remove("jwt_token");
    navigate("/login");
    console.log("User logged out");
  };

  return (
    <>
      Home
      <button onClick={handleLogOut}>Log out</button>
    </>
  );
};

export default Home;
