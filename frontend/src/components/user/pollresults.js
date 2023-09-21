import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './pollresults.css'; // Import a CSS file for styling

const PollResults = () => {
  const [pollDetails, setPollDetails] = useState({});
  const [results, setResults] = useState([]);
  const { pollId } = useParams();
  console.log(pollId)
  
  const getVoteCountForOption = (optionIndex) => {
    const result = results.find((item) => item.selected_option_index === optionIndex);
    return result ? result.voteCount : 0;
  };

  useEffect(() => {
    console.log('Fetching poll details...');
    axios
      .get(`http://localhost:3001/polls/${pollId}`)
      .then((response) => {
        console.log('Fetched poll details:', response.data);
        const pollData = response.data;
      if (pollData && pollData.options) {
        // Parse the options field as JSON
        // pollData.options = JSON.parse(pollData.options);
        setPollDetails(pollData); // Set the poll details state
      } else {
        console.error('Invalid poll data format:', pollData);
      }
    })
      .catch((error) => {
        console.error('Error fetching poll details:', error);
      });

    axios
      .get(`http://localhost:3001/pollResults/${pollId}`)
      .then((response) => {
        console.log('Fetched poll results:', response.data);
        setResults(response.data); // Set the results state
      })
      .catch((error) => {
        console.error('Error fetching poll results:', error);
      });
  }, [pollId]);

  return (
    <div className="poll-results-container">
      <h1 className="poll-results-heading">Poll Results</h1>
      <div className="poll-details">
        <h2 className="poll-question">{pollDetails.question}</h2>
        <ul className="poll-options-list">
          {pollDetails.options &&
            pollDetails.options.map((option, index) => (
              <li key={index} className="poll-option">
                {option}: <span className="vote-count">{getVoteCountForOption(index)}</span> votes
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default PollResults;
