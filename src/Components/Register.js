import React, { useState } from "react";
import "./Register.css";
import Validation from "./RegisterValidation";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const [values, setValues] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleInput = (event) => {
    setValues((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const validationErrors = Validation(values);
    setErrors(validationErrors);

    if (
      validationErrors.firstname === "" &&
      validationErrors.lastname === "" &&
      validationErrors.email === "" &&
      validationErrors.password === ""
    ) {
axios
  .post("http://localhost:8081/register", values)
  .then((res) => {
    if (res.data.Status === "Fail" && res.data.Message === "Email already exists") {
      alert("This email is already registered!");
    } else if (res.data.Status === "Success") {
      alert("Register successful!");
      navigate("/login");
    } else {
      alert("Something went wrong: " + res.data.Message);
    }
  })
  .catch((err) => console.log(err));

    }
  };

  return (
    <div className="Container">
      <div className="register-form">
        <div className="header">Register</div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Firstname</label>
            <input
              type="text"
              name="firstname"
              onChange={handleInput}
              className="input-box"
              placeholder="Enter Firstname"
            />
            {errors.firstname && (
              <span className="error-notice">{errors.firstname}</span>
            )}
          </div>

          <div className="form-group">
            <label>Lastname</label>
            <input
              type="text"
              name="lastname"
              onChange={handleInput}
              className="input-box"
              placeholder="Enter Lastname"
            />
            {errors.lastname && (
              <span className="error-notice">{errors.lastname}</span>
            )}
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              onChange={handleInput}
              className="input-box"
              placeholder="Enter Email"
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
              onChange={handleInput}
              className="input-box"
              placeholder="Password"
            />
            <p className="passwordreq">
              * Password must be at least 8 characters long, include uppercase
              and lowercase letters, a number, and a special character (@$!%*?&)
            </p>
            {errors.password && (
              <span className="error-notice">{errors.password}</span>
            )}
          </div>

          <button type="submit" className="submit-btn">
            Register
          </button>

          <p className="change-site">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;
