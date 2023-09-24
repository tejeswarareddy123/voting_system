// Viewpoll.js
import axios from "axios";
import React, { useEffect, useState } from "react";
import './viewpoll.css'; // Import your custom CSS file for styling
import PollResults from "../user/pollresults";

function Viewpoll() {
  const [polls, setPolls] = useState([]);
  const [showResults, setShowResults] = useState(false); // State for showing/hiding results
  const [selectedPollId, setSelectedPollId] = useState(null); // State to store selected poll id
  const [showpolls,setshowpolls]=useState(false);

  useEffect(() => {
    axios
      .get('http://localhost:5000/users/polls')
      .then((response) => {
        console.log('Polls response:', response.data);
        if (Array.isArray(response.data.formattedPolls)) {
          const parsedPolls = response.data.formattedPolls.map((poll) => ({
            id: poll.id,
            question: poll.question,
            options: JSON.parse(poll.options),
          }));
          console.log("parsedpolls", parsedPolls);
          setPolls(parsedPolls);
        } else {
          console.error('Invalid poll data format:', response.data);
        }
      });
  }, []);

  const handleViewResult = (pollId) => {
    // Set the selected poll id and showResults to true
    setSelectedPollId(pollId);
    setShowResults(true);
  };
  
  const handleclose=()=>{
    setShowResults(false);
  }

  return (
    <div className="poll-container">
      {showResults && !showpolls ? (
        <div>
        <PollResults pollId={selectedPollId} />
        <button onClick={handleclose}>Back to polls</button>
        </div>
      ) : (
        <div>
          <h2 className="poll-heading">View Polls</h2>
          <table className="poll-table">
            <thead>
              <tr>
                <th>Question</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {polls.map((poll) => (
                <tr key={poll.id}>
                  <td>{poll.question}</td>
                  <td>
                    <button
                      className="view-result-button"
                      onClick={() => handleViewResult(poll.id)} // Pass poll.id to handleViewResult
                    >
                      View Result
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Viewpoll;
