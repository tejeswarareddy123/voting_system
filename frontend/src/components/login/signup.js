import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import './signup.css';
import { useNavigate } from 'react-router-dom';
import Loginservice from '../../services/login/loginservice';
import poll from '../../assets/poll.jpg'

function Signup() {
  const [signupDetails, setSignUpDetails] = useState({
    name: '',
    email: '',
    phone_number: '',
    password: '',
  });

  const navigate = useNavigate();

  const userDetailsInputHandler = (e) => {
    setSignUpDetails({ ...signupDetails, [e.target.id]: e.target.value });
  };

  const userRegistrationHandler = async (e) => {
    e.preventDefault();
    const { name, email, password, phone_number } = signupDetails || {};

    if (name === undefined || name.length < 1) {
      toast.error('Name is required');
    } else if (email === undefined || email.length < 1) {
      toast.error('Email is required');
    } else if (password === undefined || password.length < 1) {
      toast.error('Password is required');
    } else if (phone_number === undefined || phone_number.length < 1) {
      toast.error('Phone number is required');
    } else {
      try {
        const response = await Loginservice.signupUser(
          name,
          email,
          phone_number,
          password
        );
        console.log(response);
        if (response.message === 'response success') {
          toast.success('Registration Successful');
          navigate('/');
        } else if (response.message === 'password is weak') {
          toast.warning('Password is weak');
        } else if (response.message === 'username or mail id already exists') {
          toast.warning('Username or mail id already exists');
        } else if (response.message === 'not an organization mail') {
          toast.warning('Enter the organization mail');
        }
      } catch (error) {
        console.error('Fetch error:', error);
        toast.error('An error occurred during registration.');
      }
    }
  };

  return (
    <div className="signup-container">
      <img src={poll} alt='poll'></img>
      <form className="signup-form" onSubmit={userRegistrationHandler}>
        <p className="title">Registration</p>
        <label htmlFor="name">Enter your Name</label>
        <input
          type="text"
          id="name"
          placeholder="Name"
          onChange={userDetailsInputHandler}
        />

        <label htmlFor="email">Enter your Email</label>
        <input
          type="text"
          id="email"
          placeholder="Email"
          onChange={userDetailsInputHandler}
        />

        <label htmlFor="phone_number">Enter your Phone Number</label>
        <input
          type="text"
          id="phone_number"
          placeholder="Phone number"
          onChange={userDetailsInputHandler}
        />

        <label htmlFor="password">Enter your password</label>
        <input
          type="password"
          id="password"
          placeholder="Password"
          onChange={userDetailsInputHandler}
        />

        <button type="submit">Signup</button>
        <p>Already have an account</p>
        <Link to="/" className="login-link">
          Login
        </Link>
      </form>
    </div>
  );
}

export default Signup;
