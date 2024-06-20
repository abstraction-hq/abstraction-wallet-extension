import React from "react"
import { HashRouter, Route, Routes } from "react-router-dom"

import Auth from "~components/auth"
import CreateView from "~views/create"
import HomeView from "~views/home"

import "~popup.css"
import "~style.css"

function IndexPopup() {
    return (
        <HashRouter>
            <Routes>
                <Route
                    path="/"
                    element={
                        <Auth>
                            <HomeView />
                        </Auth>
                    }
                />
                <Route path="/create" element={<CreateView />} />
            </Routes>
        </HashRouter>
    )
}

export default IndexPopup
