import { useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";
import { socket } from "../socket";
// import { socket } from "../socket";

axios.defaults.withCredentials = true;

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  // loading | authenticated | unauthenticated | offline
  const [status, setStatus] = useState("loading");

  /* -------------------- AUTH CHECK -------------------- */
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/auth/me`, {
        timeout: 3000,
      })
      .then((res) => {
        setCurrentUser(res.data);
        setStatus("authenticated");
      })
      .catch((err) => {
        if (!err.response) {
          setStatus("offline");
        } else {
          setCurrentUser(null);
          setStatus("unauthenticated");
        }
      });
  }, []);

  /* -------------------- SOCKET JOIN -------------------- */
  useEffect(() => {
    if (status === "authenticated" && currentUser) {
      socket.connect();
      socket.emit("join", currentUser.id);
    }

    if (status !== "authenticated") {
      socket.disconnect();
    }

    return () => {
      socket.disconnect();
    };
  }, [status, currentUser]);

  /* -------------------- LOGIN -------------------- */
  const login = async (inputs) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        inputs
      );
      setCurrentUser(res.data);
      setStatus("authenticated");
    } catch (err) {
      setStatus("unauthenticated");
      throw err;
    }
  };

  /* -------------------- LOGOUT -------------------- */
  const logout = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/auth/logout`);
    } finally {
      socket.disconnect(); // 🔴 ensure clean disconnect
      setCurrentUser(null);
      setStatus("unauthenticated");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        status,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
