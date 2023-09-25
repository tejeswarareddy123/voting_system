import axios from "axios";

const apiBaseUrl = 'http://localhost:5000/users'; // Set your API base URL here

const Adminapiservice = {
    createPoll: async (newPoll) => {
        try {
            const response = await axios.post(`${apiBaseUrl}/polls`, newPoll); // Use axios for the POST request
            console.log("admin service", response);
            return response;
        } catch (error) {
            console.log("error creating poll", error);
            throw error; // You can rethrow the error to handle it elsewhere if needed
        }
    },

    fetchPolls: async () => {
        try {
            const response = await axios.get(`${apiBaseUrl}/polls`);
            if (Array.isArray(response.data.formattedPolls)) {
                const parsedPolls = response.data.formattedPolls.map((poll) => ({
                    id: poll.id,
                    question: poll.question,
                    options: JSON.parse(poll.options),
                }));
                return parsedPolls;
            } else {
                console.error('Invalid poll data format:', response.data);
                throw new Error('Invalid poll data format');
            }
        } catch (error) {
            console.error('Error fetching polls:', error);
            throw error;
        }
    },

    fetchPollDetailsbyId: async (pollId) => {
        try {
            const response = await axios.get(`${apiBaseUrl}/polls/${pollId}`);
            const pollData = response.data;
            pollData.options = JSON.parse(pollData.options);
            if (pollData && pollData.options) {
                return pollData;
            } else {
                console.error('Invalid poll data format:', pollData);
                throw new Error('Invalid poll data format');
            }
        } catch (error) {
            console.error('Error fetching poll details:', error);
            throw error;
        }
    },

    fetchPollResults: async (pollId) => {
        try {
            const response = await axios.get(`${apiBaseUrl}/pollResults/${pollId}`);
            console.log('Fetched poll results:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching poll results:', error);
            throw error;
        }
    },
};

export default Adminapiservice;
