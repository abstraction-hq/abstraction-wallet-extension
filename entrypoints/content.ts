declare const chrome: any; // Add the 'chrome' type definition

export default defineContentScript({
    matches: ['*://*/*'],
    runAt: 'document_start',
    allFrames: true,
    main() {
        console.log('Hello content.');
        const script = document.createElement('script');
        script.src = `
        window.abstraction = {
            requestAccount: () => {
            return new Promise((resolve, reject) => {
                window.postMessage({ type: 'REQUEST_ACCOUNT' }, '*');
                window.addEventListener('message', function(event) {
                if (event.source !== window) return;
                if (event.data.type === 'ACCOUNT_RESULT') {
                    resolve(event.data.account);
                }
                });
            });
            },
        };
        `;

        (document.head || document.documentElement).appendChild(script);

        // contentScript.js
        window.addEventListener('message', function(event) {
            if (event.source !== window) return;
            if (event.data.type === 'REQUEST_ACCOUNT') {
                chrome.runtime.sendMessage({ type: 'REQUEST_ACCOUNT' }, function(response: any) {
                window.postMessage({ type: 'ACCOUNT_RESULT', account: response.account }, '*');
                });
            }
        });
    },
});
