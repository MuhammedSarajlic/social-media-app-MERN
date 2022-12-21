import axios from "axios";
import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:5000/login", {
        email,
        password,
      })
      .then(() => {
        setEmail("");
        setPassword("");
        navigate("/");
      })
      .catch((error) => {
        if (error.response.status === 401) {
          setError(error.response.data.error);
        } else {
          setError("An unknown error occurred");
        }
      });
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label for="email">Email</label>
        <input
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <label for="password">Password</label>
        <input
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        {error && <p>{error}</p>}
        <button>Login</button>
      </form>
    </>
  );
};

export default Login;
