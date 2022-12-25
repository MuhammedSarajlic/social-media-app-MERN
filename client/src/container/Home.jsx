import axios from "axios";
import Cookies from "js-cookie";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Home = ({ setIsAuthenticated, user, setUser }) => {
  const navigate = useNavigate();

  const handleLogOut = () => {
    Cookies.remove("jwt_token");
    setIsAuthenticated(false);
    navigate("/login");
  };

  if (!user) return <div>Loading...</div>;

  return (
    <>
      {console.log(user)}
      Home
      <p>{user?.user.firstName}</p>
      <button onClick={handleLogOut}>Log out</button>
    </>
  );
};

export default Home;
