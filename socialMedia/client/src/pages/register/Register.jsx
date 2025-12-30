import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import "./register.scss"
import { useState } from "react";

function Register() {
  const [inputs, setInputs] = useState({
    username: "",
    email: "",
    password: "",
    name: "",
  })

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }


  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !inputs.username.trim() ||
      !inputs.email.trim() ||
      !inputs.password.trim() ||
      !inputs.name.trim()
    ) {
      setError("All fields are required");
      return;
    }

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, inputs);
      navigate("/login")
    } catch (err) {
      //because of 409 http code at the backend, error is triggered
      setError(err.response?.data || "Something went wrong")
    }
  }

  return (
    <div className='register'>
      <div className="card">
        <div className="left">
          <h1>Maruf Social.</h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate tempora in exercitationem voluptatibus, reprehenderit perferendis provident odio nam asperiores dignissimos.
          </p>
          {/* <span>Do you have an account?</span>
          <Link to='/login'>
            <button>Login</button>
          </Link> */}
        </div>
        <div className="right">
          <h1>Register</h1>
          <form>
            <input required type="text" name="username" id="username" placeholder='Username' onChange={handleChange} />
            <input required type="email" name="email" id="email" placeholder='Email' onChange={handleChange} />
            <input required type="password" name="password" id="password" placeholder='Password' onChange={handleChange} />
            <input required type="text" name="name" id="name" placeholder='Name' onChange={handleChange} />
            {error && <p style={{ color: "red" }}>{error}</p>}
            <button onClick={handleSubmit}>Register</button>

            <span>Already have an account?

              <span style={{ paddingLeft: "10px" }}>
                <Link to="/login">
                  Login
                </Link>
              </span>
            </span>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Register