import clone from '@/lib/clone.ts';

const localStorageName = 'recordList';
const recordStore = {
    recordList: [] as RecordItem[],
    createRecord(record: RecordItem) {
        record.createAt = new Date();
        this.recordList && this.recordList.push(clone(record));
        this.saveRecords()
    },
    fetchRecords() {
        this.recordList = JSON.parse(
            window.localStorage.getItem(localStorageName) || "[]"
        ) as RecordItem[];
        return this.recordList
    },
    saveRecords() {
        window.localStorage.setItem(localStorageName, JSON.stringify(this.recordList));
    }
}
export default recordStore;