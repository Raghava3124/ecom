import { useEffect, useState } from "react";

const Navbar = ({ onLogout }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const id = localStorage.getItem("userId");
    setIsLoggedIn(!!id);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userId");
    setIsLoggedIn(false);
    onLogout();
  };

  return (
    <nav style={{ padding: "1rem", background: "#eee" }}>
      {isLoggedIn ? (
        <button onClick={handleLogout}>Logout</button>
      ) : (
        <a href="/login">Login</a>
      )}
    </nav>
  );
};

export default Navbar;
