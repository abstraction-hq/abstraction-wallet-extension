import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Popup from './popup';
import CryptoDetail from './CryptoDetail';
import './App.css';

const App = () => (
    <Router>
        <Routes>
            <Route path="/" element={<Popup />} />
            <Route path="/crypto/:symbol" element={<CryptoDetail />} />
        </Routes>
    </Router>
);

ReactDOM.render(<App />, document.getElementById('root'));
