import React, { useState } from "react";
import CreatePoll from "./createpoll";
import Viewpoll from "./viewpoll";
import './adminhome.css';
import { useNavigate } from "react-router-dom";

function Adminhome() {
  const [showCreatePoll, setShowCreatePoll] = useState(false);
  const navigate=useNavigate();

  const toggleCreatePoll = () => {
    setShowCreatePoll(!showCreatePoll);
  };

  const handlelogout=()=>{
    navigate('/');
  }
  return (
    <div>
      <div className="sidebar">
        <h1>Polling System</h1>
        <button className="create-poll-button" onClick={toggleCreatePoll}>
          {showCreatePoll ? "Close Create Poll" : "Create Poll"}
        </button>
        <button className="logout-button" onClick={handlelogout}>Logout</button>
      </div>
      <div className="polling">
        {showCreatePoll ? <CreatePoll /> : <Viewpoll />}
      </div>
    </div>
  );
}

export default Adminhome;
