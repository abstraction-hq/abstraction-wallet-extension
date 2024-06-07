// @ts-ignore
export default defineUnlistedScript({
    main() {
        console.log("Hello from injected script!")
        // @ts-ignore
        window.abstraction = {
            name: "abstraction",
        }
    }
})