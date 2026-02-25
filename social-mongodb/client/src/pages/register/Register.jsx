import { useContext, useRef } from "react";
import "./register.css"
import { AuthContext } from "../../context/AuthCreateContext";
import axios from "axios";
import {useNavigate} from "react-router-dom"

const Register = () => {
    const email = useRef();
    const username = useRef();
    const password = useRef();
    const passwordAgain = useRef();
    const navigate = useNavigate()

    const { user, isFetching, error, dispatch } = useContext(AuthContext);

    const handleClick = async (e) => {
        e.preventDefault();
        if (password.current.value !== passwordAgain.current.value) {
            passwordAgain.current.setCustomValidity("Passwords don't match!")
        } else {
            const user = {
                username: username.current.value,
                email: email.current.value,
                password: password.current.value,
            }
            try {
                await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, user)
                navigate("/login")
            }catch(err){
                console.log(err)
            }
        }
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

                        <input required ref={username} type="text" placeholder="Username" className="loginInput" />
                        <input required ref={email} type="email" placeholder="Email" className="loginInput" />
                        <input minLength="5" required ref={password} type="password" placeholder="Password" className="loginInput" />
                        <input required ref={passwordAgain} type="password" placeholder="Password Again" name="" className="loginInput" />
                        <button type="submit" className="loginButton">Sign Up</button>

                        <button type="button" onClick={()=>{navigate("/login")}} className="loginRegisterButton">Log into Account</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Register