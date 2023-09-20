import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './viewpoll.css';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';

const PollList = () => {
  const [polls, setPolls] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [submittedPolls, setSubmittedPolls] = useState([]); // To track submitted polls

  const location = useLocation();
  const user = location.state.user;

  useEffect(() => {
    // Fetch the list of polls from your server
    axios.get('http://localhost:3001/polls')
      .then((response) => {
        // Ensure that the response data is an array
        if (Array.isArray(response.data)) {
          // Parse the 'options' string into an array for each poll
          const parsedPolls = response.data.map((poll) => ({
            id: poll.poll_id, // Use 'poll_id' as 'id'
            question: poll.question,
            options: JSON.parse(poll.options),
          }));
          setPolls(parsedPolls);
        } else {
          console.error('Invalid poll data format:', response.data);
        }
      })
      .catch((error) => {
        console.error('Error fetching polls:', error);
      });
  }, []);

  const handleOptionChange = (pollId, optionIndex) => {
    setSelectedOptions({
      ...selectedOptions,
      [pollId]: optionIndex,
    });
    console.log('Selected Options:', selectedOptions);
  };

  const handleSubmit = async () => {
    // Create an array to store submitted poll data
    const submittedData = [];

    // Iterate through selected options and build the submitted data
    for (const pollId in selectedOptions) {
      if (selectedOptions.hasOwnProperty(pollId)) {
        submittedData.push({
          userId: user.id, // Assuming you have a user ID in the user object
          pollId: parseInt(pollId),
          selectedOptionIndex: selectedOptions[pollId],
        });
      }
    }


    try {
      // Send a POST request to your server to save the submitted data
      const response = await axios.post('http://localhost:3001/submitPolls', submittedData);
      if (response.status === 201) {
        // Clear selected options when successfully submitted
        setSelectedOptions({});
        // Add the submitted polls to the tracking list
        setSubmittedPolls(submittedData);
        console.log('Polls submitted successfully:', submittedData);
      } else {
        console.error('Failed to submit polls:', response.data);
      }
    } catch (error) {
      console.error('Error submitting polls:', error);
    }
  };

  return (
    <div className="poll-list">
      <h2>Poll List</h2>
      {polls.map((poll) => (
        <div key={poll.id} className="poll">
          <h3>{poll.question}</h3>
          <ul className="poll-options">
            {poll.options.map((option, index) => (
              <li key={index}>
                <input
                  type="radio"
                  name={`poll_${poll.id}`}
                  id={`poll_${poll.id}_option_${index}`}
                  value={option}
                  checked={selectedOptions[poll.id] === index}
                  onChange={() => handleOptionChange(poll.id, index)}
                />
                <label htmlFor={`poll_${poll.id}_option_${index}`}>{option}</label>
              </li>
            ))}
          </ul>
          {/* Add user's selected answer display here */}
          {selectedOptions[poll.id] !== undefined && (
            <p>Your Answer: {poll.options[selectedOptions[poll.id]]}</p>
          )}
          <Link to={`/poll`}>View Results</Link>
        </div>
      ))}

      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default PollList;
