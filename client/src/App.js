import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { Home, Register, Login } from "./container/index";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = Cookies.get("jwt_token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Home setIsAuthenticated={setIsAuthenticated} />
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
