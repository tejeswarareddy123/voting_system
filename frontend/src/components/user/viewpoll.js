
import React, { useEffect, useState } from "react";
import './viewpoll.css'; 
import Answerpoll from "./answerpoll";
import Adminapiservice from "../../services/admin/adminservice";
import UserService from "../../services/user/userservice";

function PollList() {
  const [polls, setPolls] = useState([]);
  const [answerpoll, setanswerpoll] = useState(false); 
  const [selectedPollId, setSelectedPollId] = useState(null); 
  const [showpolls, setshowpolls] = useState(false);
  const [userSubmittedPolls, setUserSubmittedPolls] = useState([]);
  const [showpoll, setshowpoll] = useState(false);
  const user = localStorage.getItem("user");

  useEffect(() => {
    Adminapiservice.fetchPolls()
      .then((parsedPolls) => {
        setPolls(parsedPolls);
      })
      .catch((error) => {
        console.error('Error fetching polls:', error);
      });

    UserService.fetchSubmittedPolls(user)
      .then((submittedPollIds) => {
        setUserSubmittedPolls(submittedPollIds);
      })
      .catch((error) => {
        console.error('Error fetching submitted polls:', error);
      });
  }, [user]);

  const handleViewResult = (pollId) => {
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
          <Answerpoll pollId={selectedPollId} showpoll={showpoll} updateUserSubmittedPolls={(pollId) => {
            setUserSubmittedPolls([...userSubmittedPolls, pollId]);
          }} />
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
