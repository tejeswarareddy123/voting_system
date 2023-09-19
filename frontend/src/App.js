import logo from './logo.svg';
import './App.css';
import CreatePoll from './components/admin/createpoll';
import PollList from './components/user/viewpoll'
import Login from './components/login/login';
import { BrowserRouter as Router,Routes, Route } from "react-router-dom";
import Signup from './components/login/signup';
function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
        
            <Route path="/" element={<Login />} />
            <Route path="signup" element={<Signup />} />
            <Route path="/createpoll" element={<CreatePoll />} />
            <Route path="/pollList" element={<PollList />} />
        </Routes>
    </Router>
    </div>
  );
}

export default App;
