import browser from "webextension-polyfill"
import { IDapp } from "~types/storages/types"

export const openWindow = async (tab: string) => {
    return await browser.windows.create({
        url: `${browser.runtime.getURL(`tabs/${tab}.html`)}`,
        focused: true,
        type: "popup",
        width: 357,
        height: 600
    })
}

export const openTab = async (tab: string) => {
    return await browser.tabs.create({
        url: `${browser.runtime.getURL(`tabs/${tab}.html`)}`,
    })
}

export const getTab = async (tabId: number): Promise<browser.Tabs.Tab | undefined> => {
    const tabs = await browser.tabs.query({})
    return tabs.find((tab) => tab.id === tabId)
}

export const getDappHostName = async (tabId: number): Promise<string> => {
    const tab = await getTab(tabId)
    if (!tab) return ""
    return new URL(tab?.url || "").hostname
}

export const getDappInfo = async (tabId: number): Promise<IDapp> => {
    const tab = await getTab(tabId)
    if (!tab) return { hostname: "", name: "", icon: "" }

    return {
        hostname: new URL(tab?.url || "").hostname,
        name: tab.title || "",
        icon: tab.favIconUrl || "",
    }
}