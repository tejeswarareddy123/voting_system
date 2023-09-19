// src/components/PollList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './viewpoll.css';

const PollList = () => {
  const [polls, setPolls] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState({});

  useEffect(() => {
    // Fetch the list of polls from your server
    axios.get('http://localhost:3001/polls')
      .then((response) => {
        // Parse the 'options' string into an array for each poll
        const parsedPolls = response.data.map((poll) => ({
          ...poll,
          options: JSON.parse(poll.options),
        }));
        setPolls(parsedPolls);
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
        </div>
      ))}
    </div>
  );
};

export default PollList;
