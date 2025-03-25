import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';
import Dashboard from './Dashboard';

function App() {
  const [topRows, setTopRows] = useState([]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage setTopRows={setTopRows} />} />
        <Route path="/dashboard" element={<Dashboard topRows={topRows} />} />
      </Routes>
    </Router>
  );
}

export default App;
