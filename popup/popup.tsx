import React from "react"
import { HashRouter, Route, Routes } from "react-router-dom"

import Auth from "~components/auth"
import HomeView from "~popup/home"

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
            </Routes>
        </HashRouter>
    )
}

export default IndexPopup
