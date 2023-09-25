import React, { useState, useEffect } from "react";
import axios from "axios";
import "./answerpoll.css";
import { toast } from 'react-toastify';
import UserService from "../../services/user/userservice";

function Answerpoll({ pollId, showpoll, updateUserSubmittedPolls }) {
  const [pollDetails, setPollDetails] = useState({});
  const [selectedOption, setSelectedOption] = useState("");
  const [polloptions, setPollOptions] = useState([]);
  const [submitted, setSubmitted] = useState(false);


  useEffect(() => {
    if (showpoll) {
      UserService.fetchPollDetailsbyId(pollId) // Use PollService to fetch poll details
        .then((pollData) => {
          setPollDetails(pollData);
          setPollOptions(pollData.options);
        })
        .catch((error) => {
          console.error('Error fetching poll details:', error);
        });
    }
  }, [pollId, showpoll]);

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("entered");
    const user = localStorage.getItem("user");
    const submittedData = {
      userId: user,
      pollId: pollId,
      selectedOption: polloptions.indexOf(selectedOption),
    };
    try {
      const response = await UserService.submitPollResponse(submittedData);
      console.log('response', response);
      if (response.status === 201) {
        updateUserSubmittedPolls(pollId);
        setSelectedOption('');
        setSubmitted(true);
        console.log('Poll submitted successfully:', submittedData);
        toast.success('Poll submitted successfully');
      } else {
        toast.error('Failed to submit poll:', response.data);
      }
    } catch (error) {
      console.error('Error submitting poll:', error);
    }
  };

  return (
    <div className="answer-poll-container">
      <h1 className="title">Answer Poll</h1>
      <h2 className="question">{pollDetails.question}</h2>
      <form>
        <ul className="options">
          {polloptions.map((option, index) => (
            <li className="option" key={index}>
              <label className="radio-label">
                <input
                  type="radio"
                  name="pollOption"
                  value={option}
                  checked={selectedOption === option}
                  onChange={handleOptionChange}
                  className="radio-input"
                  disabled={submitted}
                />
                {option}
              </label>
            </li>
          ))}
        </ul>
        {!submitted && (
          <button
            className="submit-button"
            onClick={handleSubmit}
            disabled={!selectedOption}
          >
            Submit
          </button>
        )}
      </form>
    </div>
  );
}

export default Answerpoll;
