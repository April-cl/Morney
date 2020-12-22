const localStorageName = 'recordList';
const recordListModel = {
    data: [] as RecordItem[],
    clone(data: RecordItem[] | RecordItem) {
        return JSON.parse(JSON.stringify(data))
    },
    fetch() {
        this.data = JSON.parse(
            window.localStorage.getItem(localStorageName) || "[]"
        ) as RecordItem[];
        return this.data
    },
    save(data: RecordItem[]) {
        window.localStorage.setItem(localStorageName, JSON.stringify(this.data));
    }
}
export default recordListModel;