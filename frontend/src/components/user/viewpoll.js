import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './viewpoll.css';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';

const PollList = () => {
  const [polls, setPolls] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [userSubmittedPolls, setUserSubmittedPolls] = useState([]); // Track submitted polls by the user

  const location = useLocation();
  const user = location.state.user.data;
    useEffect(() => {
    // Fetch the list of polls from your server
    axios.get('http://localhost:5000/users/polls')
      .then((response) => {
        console.log('Polls response:', response.data);
        if (Array.isArray(response.data)) {
          const parsedPolls = response.data.map((poll) => ({
            id: poll. id,
            question: poll.question,
            options: JSON.parse(poll.options),
          }));
          console.log("parsedpolls",parsedPolls)
          setPolls(parsedPolls);
          // Initialize selectedOptions state for all polls
          const initialSelectedOptions = {};
          parsedPolls.forEach((poll) => {
            initialSelectedOptions[poll.id] = undefined;
          });
          setSelectedOptions(initialSelectedOptions);
        } else {
          console.error('Invalid poll data format:', response.data);
        }
      })
      .catch((error) => {
        console.error('Error fetching polls:', error);
      });

    // Fetch the user's submitted polls from the server
    axios.get(`http://localhost:5000/users/${user}/submittedPolls`)
      .then((response) => {
        console.log('Submitted polls response:', response.data);
        if (Array.isArray(response.data)) {
          // Update the userSubmittedPolls state with the submitted poll IDs
          const submittedPollIds = response.data.map((submittedPoll) => submittedPoll.poll_id);
          setUserSubmittedPolls(submittedPollIds);
        } else {
          console.error('Invalid submitted poll data format:', response.data);
        }
      })
      .catch((error) => {
        console.error('Error fetching submitted polls:', error);
      });
  }, [user]);

  const handleOptionChange = (pollId, optionIndex) => {
    // Check if the user has already submitted this poll
    if (userSubmittedPolls.includes(pollId)) {
      return; // Do not allow changing options for submitted polls
    }

    setSelectedOptions({
      ...selectedOptions,
      [pollId]: optionIndex,
    });
  };

  const handleSubmit = async (pollId) => { // Add pollId as an argument
    console.log('Submitting poll for pollId:', pollId);
    if (selectedOptions[pollId] === undefined) {
      return; // No option selected, do not submit
    }

    // Create an array to store submitted poll data
    const submittedData = {
      userId: user,
      pollId: pollId, // Use the passed pollId
      selectedOptionIndex: selectedOptions[pollId],
    };

    try {
      // Send a POST request to your server to save the submitted data
      console.log("sybmitting data",submittedData)
      const response = await axios.post('http://localhost:5000/users/submitPolls', submittedData);
      console.log('Response from server:', response);
      if (response.status === 201) {
        // Clear selected options for the specific poll when successfully submitted
        setSelectedOptions({
          ...selectedOptions,
          [pollId]: undefined,
        });
        // Update the userSubmittedPolls state with the submitted poll ID
        setUserSubmittedPolls([...userSubmittedPolls, pollId]);
        console.log('Poll submitted successfully:', submittedData);
      } else {
        console.error('Failed to submit poll:', response.data);
      }
    } catch (error) {
      console.error('Error submitting poll:', error);
    }
  };

  return (
    <div className="poll-list">
      <h2>Poll List</h2>
      {console.log("poll",polls)}
      {polls.map((poll) => (
        <div key={poll.id} className="poll">
          {console.log("poll data",poll)}
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
                  disabled={userSubmittedPolls.includes(poll.id)}
                />
                <label htmlFor={`poll_${poll.id}_option_${index}`}>{option}</label>
              </li>
            ))}
          </ul>
          {selectedOptions[poll.id] !== undefined && (
            <p>Your Answer: {poll.options[selectedOptions[poll.id]]}</p>
          )}
          <button onClick={() => handleSubmit(poll.id)} disabled={selectedOptions[poll.id] === undefined}>
            Submit
          </button>
          <Link to={`/pollResults/${poll.id}`}>View Results</Link>
        </div>
      ))}
    </div>  
  );
};

export default PollList;
