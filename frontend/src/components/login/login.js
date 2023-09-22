import { useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import { Link } from "react-router-dom";
import "./login.css";
import { useNavigate } from "react-router-dom";

function Login() {
  const [signupDetails, setSignUpDetails] = useState({
    email: "",
    password: ""
  });

  const navigate = useNavigate();

  const userDetailsInputHandler = (e) => {
    setSignUpDetails({ ...signupDetails, [e.target.id]: e.target.value });
  };

  const userRegistrationHandler = async (e) => {
    e.preventDefault();
    const { email, password } = signupDetails || {};

    if (email === undefined || email.length < 1) {
      toast.error("email is required");
    } else if (password === undefined || password.length < 1) {
      toast.error("Password is required");
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

      fetch("http://localhost:5000/users/", options)
        .then(async (res) => {
          const data=await res.json()
          console.log("message",data.message)
          if (data.message==='User logged') {
            const user = data;
            console.log(user);
            toast.success("Login Successful");
            navigate("/pollList", { state: { user } });
          } 
          else if(data.message==='Admin logged'){
            toast.success("Admin Login Successful");
            navigate("/createpoll");
          }
          else{
            toast.warning("Invalid Username or Password");
          }
        })
        .catch((error) => {
          console.error("Fetch error:", error);
          toast.error("An error occurred during registration.");
        });
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={userRegistrationHandler}>
        <p className="title">Login</p>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          placeholder="Enter your email"
          onChange={userDetailsInputHandler}
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          placeholder="Enter your password"
          onChange={userDetailsInputHandler}
        />

        <button type="submit">
          Login
        </button>

        <p>
          Don't have an account?{" "}
          <Link to="/signup" className="signup-link">
            Signup
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
