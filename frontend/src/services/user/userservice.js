import axios from 'axios';

const BASE_URL = 'http://localhost:5000/users';

const UserService = {
  fetchSubmittedPolls: async (user) => {
    try {
      const response = await axios.get(`${BASE_URL}/${user}/submittedPolls`);
      if (Array.isArray(response.data)) {
        const submittedPollIds = response.data.map((submittedPoll) => submittedPoll.poll_id);
        return submittedPollIds;
      } else {
        console.error('Invalid submitted poll data format:', response.data);
        return [];
      }
    } catch (error) {
      console.error('Error fetching submitted polls:', error);
      throw error;
    }
  },

  fetchPollDetailsbyId: async (pollId) => {
    try {
      const response = await axios.get(`${BASE_URL}/polls/${pollId}`);
      const pollData = response.data;
      pollData.options = JSON.parse(pollData.options);
      return pollData;
    } catch (error) {
      console.error('Error fetching poll details:', error);
      throw error;
    }
  },

  submitPollResponse: async (submittedData) => {
    try {
      const response = await axios.post(`${BASE_URL}/submitPolls`, submittedData);
      return response;
    } catch (error) {
      console.error('Error submitting poll:', error);
      throw error;
    }
  },
};

export default UserService;
