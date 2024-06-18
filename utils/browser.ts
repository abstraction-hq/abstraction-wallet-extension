import browser from "webextension-polyfill"

export const openTab = async (url: string) => {
    return await browser.windows.create({
        url: `${browser.runtime.getURL(url)}`,
        focused: true,
        type: "popup",
        width: 357,
        height: 600
    })
}

export const getTab = async (tabId: number): Promise<browser.Tabs.Tab | undefined> => {
    const tabs = await browser.tabs.query({ active: true, currentWindow: true })
    return tabs.find((tab) => tab.id === tabId)
}

export const getTabHostName = async (tabId: number): Promise<string> => {
    const tab = await getTab(tabId)
    if (!tab) return ""
    return new URL(tab?.url || "").hostname
}