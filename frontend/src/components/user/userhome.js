import React, { useState } from "react";
import CreatePoll from "../user/createpoll";
import PollList from "./viewpoll";
import './userhome.css';
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

function Userhome() {
  const [showCreatePoll, setShowCreatePoll] = useState(false);
  const navigate=useNavigate();
  const location = useLocation();
  const user = location.state.user.data;

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
        <button className="logout-button" onClick={handlelogout}>Logout</button>
      </div>
      <div className="polling">
        {<PollList user={user} />}
      </div>
    </div>
  );
}

export default Userhome;
