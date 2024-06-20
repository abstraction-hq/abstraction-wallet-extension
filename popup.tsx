import React, { useEffect } from "react"
import { HashRouter, Route, Routes } from "react-router-dom"
import Auth from "~components/auth"
import HomeView from "~views/home"
import ConnectView from "~views/connect"
import WelcomeView from "~views/welcome"
import CreateView from "~views/create"
import { useUserStore } from "~stores"
import { openTab } from "~utils/browser"

import "~popup.css"
import "~style.css"

function IndexPopup() {
    const credentials = useUserStore(state => state.credentials)

    useEffect(() => {
        if (!credentials) {
            openTab("welcome")
            window.close()
        }
    }, [])

    return (
        <HashRouter>
            <Routes>
                <Route path="/" element={
                    <Auth>
                        <HomeView />
                    </Auth>
                } />
                <Route path="/connect" element={
                    <Auth>
                        <ConnectView />
                    </Auth>
                } />
                <Route path="/welcome" element={<WelcomeView />} />
                <Route path="/create" element={<CreateView />} />
            </Routes>
        </HashRouter>
    )
}

export default IndexPopup
