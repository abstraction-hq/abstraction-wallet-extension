async function getTabId() {
    const currentTab = await browser.tabs.getCurrent();
    console.log(currentTab)
    return browser.tabs.getCurrent().then(tab => tab.id);
}
export default defineBackground(() => {
    console.log('Hello background!', { id: browser.runtime.id });
    getTabId().then((tabId) => {
        browser.scripting.executeScript({
                target : {tabId: tabId as number, allFrames: true},
                files : [ "injected.js" ],
            }).then(() => console.log("script injected on target frames"));
    });
});
