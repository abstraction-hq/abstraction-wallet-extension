export default defineContentScript({
    matches: ['*://*/*'],
    runAt: 'document_idle',
    main() {
        console.log('Hello content.');
        const script = document.createElement('script');
        script.setAttribute('type', 'text/javascript');

        // (document.head || document.documentElement).appendChild(script);
    },
});
