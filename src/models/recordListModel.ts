import clone from '@/lib/clone.ts';

const localStorageName = 'recordList';
const recordListModel = {
    data: [] as RecordItem[],
    create(record: RecordItem) {
        record.createAt = new Date();
        this.data.push(clone(record));
        this.save()
    },
    fetch() {
        this.data = JSON.parse(
            window.localStorage.getItem(localStorageName) || "[]"
        ) as RecordItem[];
        return this.data
    },
    save() {
        window.localStorage.setItem(localStorageName, JSON.stringify(this.data));
    }
}
export default recordListModel;