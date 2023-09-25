import axios from 'axios';

const BASE_URL = 'http://localhost:5000/users';

const Loginservice = {
  loginUser: async (email, password) => {
    try {
      const response = await axios.post(`${BASE_URL}/`, { email, password });
      return response.data;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  },

  signupUser: async (name, email, phone_number, password) => {
    try {
      const response = await axios.post(`${BASE_URL}/signup`, {
        name,
        email,
        phone_number,
        password,
      });
      return response.data;
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  },
};

export default Loginservice;
