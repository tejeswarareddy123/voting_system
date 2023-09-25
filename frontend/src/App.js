import logo from './logo.svg';
import './App.css';
import CreatePoll from './components/admin/createpoll';
import PollList from './components/user/viewpoll'
import Login from './components/login/login';
import { BrowserRouter as Router,Routes, Route } from "react-router-dom";
import Signup from './components/login/signup';
import PollResults from './components/user/pollresults';
import Adminhome from './components/admin/adminhome';
import Userhome from './components/user/userhome';
function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
        
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            {/* <Route path="/pollResults/:pollId" element={<PollResults/>} /> */}
            <Route path="/createpoll" element={<CreatePoll />} />
            <Route path="/pollList" element={<PollList />} />
            <Route path="/adminhome" element={<Adminhome/>}/>
            <Route path="/userhome" element={<Userhome/>}/>
        </Routes>
    </Router>
    </div>
  );
}

export default App;
