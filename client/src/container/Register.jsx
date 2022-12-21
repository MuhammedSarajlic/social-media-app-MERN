import React from "react";
import { useState } from "react";

const Register = () => {
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    imageUrl: "",
  });

  const handleRegister = async (e) => {
    e.preventDefault();
    await fetch("http://localhost:5000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        password: user.password,
        imageUrl: user.imageUrl,
      }),
    });
    setUser({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      imageUrl: "",
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
        <button>Register</button>
      </form>
    </>
  );
};

export default Register;
