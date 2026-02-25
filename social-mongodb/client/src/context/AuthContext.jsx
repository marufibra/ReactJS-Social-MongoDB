
import { useReducer, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import AuthReducer from "./AuthReducer";
import { INITIAL_STATE, AuthContext } from "./AuthCreateContext";

export const AuthContextProvider = ({ children }) => {

    // ✅ Restore user from localStorage
    const init = (initialState) => {
        const stored = localStorage.getItem("user");
        return stored
            ? { ...initialState, user: JSON.parse(stored) }
            : initialState;
    };

    const [state, dispatch] = useReducer(
        AuthReducer,
        INITIAL_STATE,
        init
    );

    const socket = useRef(null);

    const logout = () => {
        localStorage.removeItem("user");

        if (socket.current) {
            socket.current.disconnect();
            socket.current = null;
        }

        dispatch({ type: "LOGOUT" });
    };

    useEffect(() => {
        if (!state.user) return;

        if (!socket.current) {
            socket.current = io(import.meta.env.VITE_WS_URL, {
                transports: ["websocket"],
                reconnection: true,
            });

            socket.current.on("connect", () => {
      
                socket.current.emit("addUser", state.user._id);
            });

            socket.current.on("reconnect", () => {
                
                socket.current.emit("addUser", state.user._id);
            });
        }

    }, [state.user]);

    return (
        <AuthContext.Provider
            value={{
                user: state.user,
                isFetching: state.isFetching,
                error: state.error,
                dispatch,
                socket, // ✅ Global access
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};