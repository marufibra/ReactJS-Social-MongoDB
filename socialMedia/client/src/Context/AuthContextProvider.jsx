// import { useEffect, useState } from "react";
// import axios from 'axios'
// import { AuthContext } from "./AuthContext";


// export const AuthContextProvider = ({ children }) => {
//     const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem("user")) || null);
//     // without JSON.parse() we would receive a string i.e 'false'
//     // JSON.parse("true")   // --> true  (boolean)
//     // JSON.parse("false")  // --> false (boolean)
//     // JSON.parse("123")    // --> 123   (number)

//     const login = async (inputs) => {
//         const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`,
//             inputs,
//             { withCredentials: true }
//         );
//         setCurrentUser(res.data)
//     };

//     const logout = async () => {
//         await axios.post(`${import.meta.env.VITE_API_URL}/auth/logout`,
//             {},
//             { withCredentials: true }
//         );
//         setCurrentUser(null);
//     };


//     useEffect(() => {
//         localStorage.setItem("user", JSON.stringify(currentUser))
//     }, [currentUser]);

//     return (
//         <AuthContext.Provider value={{ currentUser, login, logout }}>{children}</AuthContext.Provider>
//     )
// }


import { useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";

axios.defaults.withCredentials = true;

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  // loading | authenticated | unauthenticated | offline
  const [status, setStatus] = useState("loading");

  // 🔑 Check auth status on app load
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
          // Backend is down / unreachable
          setStatus("offline");
        } else {
          // Not logged in
          setCurrentUser(null);
          setStatus("unauthenticated");
        }
      });
  }, []);

  // ✅ Normal login (username + password)
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
      throw err; // let UI show error
    }
  };

  // ✅ Logout (normal + Google)
  const logout = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/auth/logout`);
    } finally {
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
