import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';
import HomePage from './pages/Homepage/index';
import AdminPanel from './pages/Adminpanel/index';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/adminpanel" element={<AdminPanel />} />
      </Routes>
    </Router>
  );
}

export default App;