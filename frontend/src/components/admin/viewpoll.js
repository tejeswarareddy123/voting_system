
import React, { useEffect, useState } from "react";
import './viewpoll.css'; 
import PollResults from "../user/pollresults";
import Adminapiservice from '../../services/admin/adminservice';

function Viewpoll() {
  const [polls, setPolls] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [selectedPollId, setSelectedPollId] = useState(null); 
  const [showpolls, setshowpolls] = useState(false);

  useEffect(() => {
    Adminapiservice.fetchPolls()
      .then((parsedPolls) => {
        setPolls(parsedPolls);
      })
      .catch((error) => {
        console.log("error fetching polls", error);
      });
  }, []);

  const handleViewResult = (pollId) => {
    setSelectedPollId(pollId);
    setShowResults(true);
  };

  const handleclose = () => {
    setShowResults(false);
  }

  return (
    <div className="poll-container">
      {showResults && !showpolls ? (
        <div>
          <PollResults pollId={selectedPollId} />
          <button onClick={handleclose} className="back-to-polls">Back to polls</button>
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
                      onClick={() => handleViewResult(poll.id)} 
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
