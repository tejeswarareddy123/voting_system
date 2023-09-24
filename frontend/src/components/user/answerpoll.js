import React, { useState, useEffect } from "react";
import axios from "axios";
import "./answerpoll.css"; // Import your custom CSS file for styling

function Answerpoll({ pollId, showpoll, user }) {
  const [pollDetails, setPollDetails] = useState({});
  const [selectedOption, setSelectedOption] = useState("");
  const [polloptions, setPollOptions] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (showpoll) {
      axios
        .get(`http://localhost:5000/users/polls/${pollId}`)
        .then((response) => {
          const pollData = response.data;
          pollData.options = JSON.parse(pollData.options);
          setPollDetails(pollData);
          setPollOptions(pollData.options);
        })
        .catch((error) => {
          console.error("Error fetching poll details:", error);
        });
    }
  }, [pollId, showpoll]);

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleSubmit = async () => {
    // Handle submission logic here
    try {
      // Send a POST request to your server to save the submitted data
      const submittedData = {
        userId: user,
        pollId: pollId,
        selectedOption: polloptions.indexOf(selectedOption),
      };

      const response = await axios.post(
        "http://localhost:5000/users/submitPolls",
        submittedData
      );

      if (response.status === 201) {
        // Clear selected option and mark as submitted
        setSelectedOption("");
        setSubmitted(true);
        console.log("Poll submitted successfully:", submittedData);
      } else {
        console.error("Failed to submit poll:", response.data);
      }
    } catch (error) {
      console.error("Error submitting poll:", error);
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
