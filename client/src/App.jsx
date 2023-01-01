import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { Home, Register, Login, UserProfile } from "./container/index";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUserEmail, setCurrentUserEmail] = useState();
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const handleLogOut = () => {
    Cookies.remove("jwt_token");
    setCurrentUserEmail("");
    setIsAuthenticated(false);
    setUser(null);
    navigate("/login");
  };

  const getUser = async () => {
    await axios
      .get(`http://localhost:5000/user?email=${currentUserEmail}`)
      .then((res) => {
        setUser(res.data);
      })
      .catch((error) => console.log(error));
  };

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
          setCurrentUserEmail(response.data.user.email);
        });
      getUser();
    }
  }, [currentUserEmail]);

  return (
    <>
      <div className="bg-[#f0f2f5]">
        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Home
                  setIsAuthenticated={setIsAuthenticated}
                  user={user}
                  handleLogOut={handleLogOut}
                />
              ) : (
                <Login
                  setIsAuthenticated={setIsAuthenticated}
                  setCurrentUserEmail={setCurrentUserEmail}
                />
              )
            }
          />
          <Route path="/register" element={<Register />} />
          <Route
            path="/login"
            element={
              <Login
                setIsAuthenticated={setIsAuthenticated}
                setCurrentUserEmail={setCurrentUserEmail}
              />
            }
          />
          <Route
            path="/:username"
            element={<UserProfile user={user} handleLogOut={handleLogOut} />}
          />
        </Routes>
      </div>
    </>
  );
}

export default App;
