import { Route, HashRouter as Router, Routes } from "react-router-dom"

import { Login } from "./pages/login"
import { Home } from "~pages/home"
import { Create } from "~pages/create"

import "./popup.css"
// import "./style.css"

function IndexPopup() {
  return (
    <div className="wallet">
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/create" element={<Create />} />
        </Routes>
      </Router>
    </div>
  )
}

export default IndexPopup
