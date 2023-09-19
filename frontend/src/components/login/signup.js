import { useState } from "react";
import { toast } from 'react-toastify';
import { Link } from "react-router-dom";
import "./signup.css";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [signupDetails, setSignUpDetails] = useState({
    'name': "",
    'email': "",
    'phone_number': "",
    'password': ""
  });

  const navigate = useNavigate();

  const userDetailsInputHandler = (e) => {
    setSignUpDetails({ ...signupDetails, [e.target.id]: e.target.value });
  };

  const userRegistrationHandler = (e) => {
    e.preventDefault();
    const { name, email, password, phone_number } = signupDetails || {};

    if (name === undefined || name.length < 1) {
      toast.error("Name is required");
    } else if (email === undefined || email.length < 1) {
      toast.error("email is required");
    } else if (password === undefined || password.length < 1) {
      toast.error("Password is required");
    } else if (phone_number === undefined || phone_number.length < 1) {
      toast.error("Phone number is required");
    } else {
      console.log(signupDetails);

      const options = {
        method: "post",
        headers: {
          'Content-Type': "application/json",
          'accept': 'application/json'
        },
        body: JSON.stringify(signupDetails)
      };

      fetch("http://localhost:8000/signup", options)
        .then((res) => {
          if (res.status === 201) {
            toast.success("Registration Successful");
            navigate('/');
          } else if (res.status === 409) {
            toast.warning("Email is already existed.");
          }
        })
        .catch((error) => {
          console.error("Fetch error:", error);
          toast.error("An error occurred during registration.");
        });
    }
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={userRegistrationHandler}>
        <p className="title">Registration</p>
        <label htmlFor="name">Enter your Name</label>
        <input
          type="text"
          id="name"
          placeholder="Name"
          onChange={userDetailsInputHandler}
        />

        <label htmlFor="username">Enter your Email</label>
        <input
          type="text"
          id="email"
          placeholder="Email"
          onChange={userDetailsInputHandler}
        />

        <label htmlFor="email">Enter your Phone Number</label>
        <input
          type="text"
          id="phone_number"
          placeholder="phone number"
          onChange={userDetailsInputHandler}
        />

        <label htmlFor="password">Enter your password</label>
        <input
          type="password"
          id="password"
          placeholder="password"
          onChange={userDetailsInputHandler}
        />

        <button type="submit">
          Signup
        </button>
        <p>Already have an account</p>
        <Link to="/" className="login-link">Login</Link>
      </form>
    </div>
  );
}

export default Signup;
