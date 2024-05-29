import { Route, HashRouter as Router, Routes } from "react-router-dom"

import { Login } from "./pages/login"
import { Home } from "~pages/home"

import "./popup.css"

function IndexPopup() {
  return (
    <div className="wallet">
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </Router>
    </div>
  )
}

export default IndexPopup
