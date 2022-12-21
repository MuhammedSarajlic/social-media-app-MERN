import axios from "axios";
import React from "react";

const Home = () => {
  axios.get("http://localhost:5000/register").then((res) => console.log(res));

  return <div>Home</div>;
};

export default Home;
