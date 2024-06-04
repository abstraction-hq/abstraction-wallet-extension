export default defineContentScript({
    matches: ['<all_urls>'],
    main() {
        console.log('Hello content.');
        const script = document.createElement('script');
        script.setAttribute('src', `
        window.abstraction = {
            name: 'abstraction',
        }
        `);

        (document.head || document.documentElement).appendChild(script);
    },
});
