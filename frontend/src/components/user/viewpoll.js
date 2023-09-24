// Viewpoll.js
import axios from "axios";
import React, { useEffect, useState } from "react";
import './viewpoll.css'; // Import your custom CSS file for styling
import Answerpoll from "./answerpoll";

function PollList({ user }) {
  const [polls, setPolls] = useState([]);
  const [answerpoll, setanswerpoll] = useState(false); // State for showing/hiding results
  const [selectedPollId, setSelectedPollId] = useState(null); // State to store selected poll id
  const [showpolls, setshowpolls] = useState(false);
  const [userSubmittedPolls, setUserSubmittedPolls] = useState([]);
  const [showpoll,setshowpoll]=useState(false);

  useEffect(() => {
    axios
      .get('http://localhost:5000/users/polls')
      .then((response) => {
        if (Array.isArray(response.data.formattedPolls)) {
          const parsedPolls = response.data.formattedPolls.map((poll) => ({
            id: poll.id,
            question: poll.question,
            options: JSON.parse(poll.options),
          }));
          setPolls(parsedPolls);
        } else {
          console.error('Invalid poll data format:', response.data);
        }
      });

    axios.get(`http://localhost:5000/users/${user}/submittedPolls`)
      .then((response) => {
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

  const handleViewResult = (pollId) => {
    // Set the selected poll id and showResults to true
    setSelectedPollId(pollId);
    setanswerpoll(true);
    setshowpoll(true);
  };

  const handleclose = () => {
    setanswerpoll(false);
    setshowpoll(false);
  }

  return (
    <div className="poll-container">
      {answerpoll && !showpolls ? (
        <div>
          <Answerpoll pollId={selectedPollId} showpoll={showpoll} user={user} />
          <button className="back-polls" onClick={handleclose}>Back to polls</button>
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
                    {userSubmittedPolls.includes(poll.id) ? (
                      <div>
                        <button className="poll-answered" disabled>Answered</button>
                      </div>
                    ) : (
                      <button
                        className="view-result-button"
                        onClick={() => handleViewResult(poll.id)}
                      >
                        Answer Poll
                      </button>
                    )}
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

export default PollList;
