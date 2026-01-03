import { Link, useNavigate } from 'react-router-dom'
import './login.scss'
import { useContext } from 'react'
import { AuthContext } from '../../Context/AuthContext'
import { useState } from 'react'

function Login() {
  const [inputs, setInputs] = useState({
    username: "",
    password: "",
  })

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }


  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const { login } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (
      !inputs.username.trim() ||
      !inputs.password.trim()
    ) {
      setError("All fields are required");
      return;
    }
    try {
      await login(inputs);
      navigate("/")
    } catch (err) {
      setError(err.response.data || "Something went wrong1");
    }
  }

  return (
    <div className='login'>
      <div className="card">
        <div className="left">
          <h1>Hello World.</h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate tempora in exercitationem voluptatibus, reprehenderit perferendis provident odio nam asperiores dignissimos.
          </p>
          {/* <span>Don't you have an account?</span>
          <Link to='/register'>
            <button>Register</button>
          </Link> */}
        </div>
        <div className="right">
          <h1>Login</h1>
          <form>
            <input type="text" name="username" id="username" placeholder='Username' onChange={handleChange} />
            <input type="password" name="password" id="password" placeholder='Password' onChange={handleChange} />
            {error && <p style={{ color: "red" }}>{error}</p>}
            <button onClick={handleLogin}>Login</button>

            <span>

              <a href={`${import.meta.env.VITE_API_URL}/auth/google`}>
             {/* "http://localhost:8800/api/auth/google" */}
                Continue with Google
              </a>
            </span>
            <span>Don't you have an account?

              <span style={{ paddingLeft: "10px" }}>
                <Link to="/register">
                  Register
                </Link>
              </span>
            </span>
          </form>
        </div>


      </div>

    </div>
  )
}

export default Login