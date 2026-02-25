import { useContext, useRef } from "react"
import "./login.css"
import { Link, useNavigate } from "react-router-dom"
import { loginCall } from "../../apiCalls"
import { AuthContext } from "../../context/AuthCreateContext"
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const Login = () => {
    const email = useRef();
    const password = useRef();
    const navigate = useNavigate()
    const { user, isFetching, error, dispatch } = useContext(AuthContext);

    const handleClick = (e) => {
        e.preventDefault();
        loginCall({ email: email.current.value, password: password.current.value }, dispatch)
    }

    return (
        <div className="login">
            <div className="loginWrapper">
                <div className="loginLeft">
                    <h3 className="loginLogo">Marufsocial</h3>
                    <span className="loginDesc">
                        Connect with friends and the world around you on Marufsocial
                    </span>
                </div>
                <div className="loginRight">
                    <form className="loginBox" onSubmit={handleClick}>
                        <input
                            required
                            type="email"
                            placeholder="Email"
                            className="loginInput"
                            ref={email}
                        />
                        <input
                            required
                            type="password"
                            placeholder="Password"
                            className="loginInput"
                            minLength="5"
                            ref={password}
                        />
                        <button className="loginButton" type="submit" disabled={isFetching}>{isFetching
                            ? <Box sx={{ display: 'flex', justifyContent: "center" }}>
                                <CircularProgress style={{ color: "white" }} />
                            </Box>
                            : "Login"}
                        </button>
                        <div style={{textAlign:"center"}}>
                            <a href={`${import.meta.env.VITE_API_URL}/auth/google`}>
                                Continue with Google
                            </a>
                        </div>
                        <span className="loginForgot">Forgot Password</span>

                        <button type="button" onClick={()=>{navigate("/register")}} className="loginRegisterButton">
                            {isFetching
                                ? <Box sx={{ display: 'flex', justifyContent: "center" }}>
                                    <CircularProgress style={{ color: "white" }} />
                                </Box>
                                : "Create a New Account"}
                        </button>


                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login