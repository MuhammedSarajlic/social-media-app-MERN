import React from "react";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    imageUrl: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    const { firstName, lastName, email, password, imageUrl } = user;
    axios
      .post("http://localhost:5000/register", {
        firstName,
        lastName,
        email,
        password,
        imageUrl,
      })
      .then(() => {
        setUser({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          imageUrl: "",
        });
        setError("");
        navigate("/login");
      })
      .catch((error) => {
        if (error.response.status === 400) {
          setError(error.response.data.error);
        } else {
          setError("An unknown error occurred");
        }
      });
  };

  const handleChange = (e) => {
    setUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <>
      Register
      <form onSubmit={handleRegister}>
        <label for="firstName">First name</label>
        <input
          type="text"
          id="firstName"
          name="firstName"
          value={user.firstName}
          onChange={handleChange}
          placeholder="First Name"
          required
        />
        <label for="lastName">Last name</label>
        <input
          type="text"
          id="lastName"
          name="lastName"
          value={user.lastName}
          onChange={handleChange}
          placeholder="Last Name"
          required
        />
        <label for="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={user.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />
        <label for="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={user.password}
          onChange={handleChange}
          placeholder="Password"
          required
        />
        {error && <p>{error}</p>}
        <button>Register</button>
      </form>
    </>
  );
};

export default Register;
