import React from "react"
import { HashRouter, Route, Routes } from "react-router-dom"

import "../style.css"
import "./popup.css"

import LoginView from "~popup/login"
import WelcomeView from "~popup/welcome"
import CreateView from "~popup/create"
import HomePage from "~popup/home"

function IndexPopup() {
    return (
        <HashRouter>
            <Routes>
                <Route path="/" Component={WelcomeView} />
                <Route path="/login" Component={LoginView} />
                <Route path="/home" Component={HomePage} />
                <Route path="/create" Component={CreateView} />
            </Routes>
        </HashRouter>
    )
}

export default IndexPopup
