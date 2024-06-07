async function getTabId() {
    const currentTab = await browser.tabs.query({
        currentWindow: true,
    });
    console.log(currentTab)
    return currentTab[0].id;
}
export default defineBackground(() => {
    console.log('Hello background!', { id: browser.runtime.id });
    getTabId().then((tabId) => {
        console.log(tabId)
        browser.scripting.executeScript({
                target : {tabId: tabId as number},
                files : [ "injected.js" ],
            }).then(() => console.log("script injected on target frames"));
    });
});
