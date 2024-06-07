async function main() {
    // handle requests from injected script
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        console.log(`Received request: ${request.method} with params: ${request.params}`);
        // handle request
        sendResponse({ result: "success" });
    });
}

main()