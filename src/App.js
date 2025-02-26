import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Home from "./components/Home";
import Settings from "./components/Settings";
import FocusMode from "./components/FocusMode";
import TaskBreakdown from "./components/TaskBreakdown";

const App = () => {
  return (
    <Router>
      <div style={{ padding: "20px", width: "300px" }}>
        <nav>
          <p> Welcome</p>   
          <Link to="/">Home</Link> | <Link to="/settings">Settings</Link>
            | <Link to="/taskBreakdown">Task Breakdown</Link>
     
        </nav>
        <FocusMode />
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/taskBreakdown" element={<TaskBreakdown />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
