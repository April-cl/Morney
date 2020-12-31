import Vue from 'vue';
import Vuex from 'vuex';
import clone from '@/lib/clone.ts';

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    recordList: [] as RecordItem[]
  },
  mutations: {
    fetchRecords(state) {
      state.recordList = JSON.parse(window.localStorage.getItem('recordList') || "[]") as RecordItem[];
    },
    createRecord(state, record: RecordItem) {
      record.createAt = new Date();
      this.recordList && state.recordList.push(clone(record));
      store.commit('saveRecords')
    },
    saveRecords(state) {
      window.localStorage.setItem('recordList', JSON.stringify(state.recordList));
    }
  }
})

export default store;
