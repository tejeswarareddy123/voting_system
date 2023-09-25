import React, { useState, useEffect } from 'react';
import { json, useParams } from 'react-router-dom';
import './pollresults.css';
import Adminapiservice from '../../services/admin/adminservice';

const PollResults = ({ pollId }) => {
  const [pollDetails, setPollDetails] = useState({});
  const [results, setResults] = useState([]);

  const getVoteCountForOption = (optionIndex) => {
    const result = results.find((item) => item.selected_option_index === optionIndex);
    return result ? result.voteCount : 0;
  };

  useEffect(() => {
    Adminapiservice.fetchPollDetailsbyId(pollId)
      .then((pollData) => {
        setPollDetails(pollData);
      })
      .catch((error) => {
        console.log("error fetching polls", error);
      });

    Adminapiservice.fetchPollResults(pollId)
      .then((pollResults) => {
        setResults(pollResults);
      })
      .catch((error) => {
        console.log("error fetching polls", error);
      });
  }, [pollId]);

  return (
    <div className="poll-results-container">
      <h1 className="poll-results-heading">Poll Results</h1>
      <div className="poll-details">
        {console.log("o", pollDetails)}
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
