import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import './login.css';
import { useNavigate } from 'react-router-dom';
import LoginService from '../../services/login/loginservice';

function Login() {
  const [loginDetails, setLoginDetails] = useState({
    email: '',
    password: '',
  });

  const navigate = useNavigate();

  const loginDetailsInputHandler = (e) => {
    setLoginDetails({ ...loginDetails, [e.target.id]: e.target.value });
  };

  const userLoginHandler = async (e) => {
    e.preventDefault();
    const { email, password } = loginDetails || {};

    if (email === undefined || email.length < 1) {
      toast.error('Email is required');
    } else if (password === undefined || password.length < 1) {
      toast.error('Password is required');
    } else {
      try {
        const response = await LoginService.loginUser(email, password);
        console.log(response);
        if (response.message === 'User logged') {
          toast.success('Login Successful');
          localStorage.setItem('user', response.data);
          navigate('/userhome');
        } else if (response.message === 'Admin logged') {
          toast.success('Admin Login Successful');
          navigate('/adminhome');
        } else {
          toast.error('Invalid Username or Password');
        }
      } catch (error) {
        console.error('Fetch error:', error);
        toast.error('An error occurred during login.');
      }
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={userLoginHandler}>
        <p className="title">Login</p>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          placeholder="Enter your email"
          onChange={loginDetailsInputHandler}
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          placeholder="Enter your password"
          onChange={loginDetailsInputHandler}
        />

        <button type="submit">Login</button>

        <p>
          Don't have an account?{' '}
          <Link to="/signup" className="signup-link">
            Signup
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
