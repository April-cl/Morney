import clone from '@/lib/clone.ts';

const localStorageName = 'recordList';
const recordStore = {
    recordList: [] as RecordItem[],
}
export default recordStore;