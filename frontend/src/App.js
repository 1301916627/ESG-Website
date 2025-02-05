import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage';
import SignUpPage from './components/SignUpPage';
import LoginPage from './components/LoginPage';
import SearchPage from './components/SearchPage';
import ESGDetails from './components/esg-details-complete';
import ESGScores from './components/esg-scores';
import FrameworksPage from './components/FrameworkPage';
import Comparison from './components/ComparePage'
import ESGMetricsChart from './components/esg_graph'


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/esgdetails/:perm_id" element={<ESGDetails />} />
        <Route path="/esgscore/:perm_id" element={<ESGScores />} />
        <Route path="/frameworks" element={<FrameworksPage />} />
        <Route path="/compare" element={<Comparison />} />
        <Route path="/esggraph/:perm_id" element={<ESGMetricsChart />} />

      </Routes>
    </Router>
  );
}

export default App;