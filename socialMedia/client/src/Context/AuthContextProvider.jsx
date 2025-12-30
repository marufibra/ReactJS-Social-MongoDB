import { useEffect, useState } from "react";
import axios from 'axios'
import { AuthContext } from "./AuthContext";


export const AuthContextProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem("user")) || null);
    // without JSON.parse() we would receive a string i.e 'false'
    // JSON.parse("true")   // --> true  (boolean)
    // JSON.parse("false")  // --> false (boolean)
    // JSON.parse("123")    // --> 123   (number)

    const login = async (inputs) => {
        const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`,
            inputs,
            { withCredentials: true }
        );
        setCurrentUser(res.data)
    };

    const logout = async () => {
        await axios.post(`${import.meta.env.VITE_API_URL}/auth/logout`,
            {},
            { withCredentials: true }
        );
        setCurrentUser(null);
    };


    useEffect(() => {
        localStorage.setItem("user", JSON.stringify(currentUser))
    }, [currentUser]);

    return (
        <AuthContext.Provider value={{ currentUser, login, logout }}>{children}</AuthContext.Provider>
    )
}