const localStorageName = 'recordList';
const model = {
    fetch() {
        return JSON.parse(
            window.localStorage.getItem(localStorageName) || "[]"
        )
    },
    save(data) {
        window.localStorage.setItem(localStorageName, JSON.stringify(data));
    }
}
export default model;