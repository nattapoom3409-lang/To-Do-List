// Login.js
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Validation from "./LoginValidation";
import "./Register.css";

function Login() {
  const [values, setValues] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleInput = (event) => {
    setValues((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  axios.defaults.withCredentials = true;
  const handleSubmit = (event) => {
    event.preventDefault();
    const validationResult = Validation(values);
    setErrors(validationResult);
    axios
      .post("http://localhost:8081/login", values, { withCredentials: true })
      .then((res) => {
        if (res.data.Status === "Success") {
          alert("Login Success");
          navigate("/home");
        } else {
          alert(res.data.Message);
        }
      })
      .catch((err) => console.log(err));
  };

  // ... rest of the component remains the same
  return (
    <div className="Container">
      <div className="register-form">
        <div className="header">Login</div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={values.email}
              onChange={handleInput}
              className="input-box"
              placeholder="Enter email"
            />
            {errors.email && (
              <span className="error-notice">{errors.email}</span>
            )}
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={values.password}
              onChange={handleInput}
              className="input-box"
              placeholder="Password"
            />
            {errors.password && (
              <span className="error-notice">{errors.password}</span>
            )}
          </div>

          <button type="submit" className="submit-btn">
            Login
          </button>
          <p className="change-site">
            Don't have an account? <Link to="/register">Register</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
