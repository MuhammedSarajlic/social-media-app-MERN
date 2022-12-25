import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { Home, Register, Login } from "./container/index";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = Cookies.get("jwt_token");
    if (token) {
      setIsAuthenticated(true);
      axios
        .post("http://localhost:5000/api/protected", {
          headers: {
            Authorization: token,
          },
        })
        .then((response) => {
          setUser(response.data.user);
        });
    }
  }, [isAuthenticated]);

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Home
                setIsAuthenticated={setIsAuthenticated}
                user={user}
                setUser={setUser}
              />
            ) : (
              <Login setIsAuthenticated={setIsAuthenticated} />
            )
          }
        />
        <Route path="/register" element={<Register />} />
        <Route
          path="/login"
          element={<Login setIsAuthenticated={setIsAuthenticated} />}
        />
      </Routes>
    </>
  );
}

export default App;
