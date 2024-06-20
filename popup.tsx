import React, { useEffect } from "react"
import { HashRouter, Route, Routes } from "react-router-dom"

import Auth from "~components/auth"
import ConnectView from "~views/connect"
import CreateView from "~views/create"
import HomeView from "~views/home"

import "~popup.css"
import "~style.css"

import SignTransactionView from "~views/signTransaction"
import WelcomeView from "~views/welcome"

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
                <Route
                    path="/connect"
                    element={
                        <Auth>
                            <ConnectView />
                        </Auth>
                    }
                />
                <Route path="/welcome" element={<WelcomeView />} />
                <Route path="/create" element={<CreateView />} />
                <Route
                    path="/signTransaction"
                    element={
                        <Auth>
                            <SignTransactionView />
                        </Auth>
                    }
                />
            </Routes>
        </HashRouter>
    )
}

export default IndexPopup
