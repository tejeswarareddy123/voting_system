import React, { useState } from "react";
import PollList from "./viewpoll";
import './userhome.css';
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

function Userhome() {
  const [showCreatePoll, setShowCreatePoll] = useState(false);
  const navigate=useNavigate();
  const user=localStorage.getItem("user");
  const toggleCreatePoll = () => {
    setShowCreatePoll(!showCreatePoll);
  };

  const handlelogout=()=>{
    localStorage.removeItem("user");
    navigate('/');
  }
  return (
    <div>
      <div className="sidebar">
        <h1>Polling System</h1>
        <button className="logout-button" onClick={handlelogout}>Logout</button>
      </div>
      <div className="polling">
        {<PollList/>}
      </div>
    </div>
  );
}

export default Userhome;
