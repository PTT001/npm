import { defineStore } from 'pinia'

export default defineStore({
  id: 'store',
  state: () => ({
    config: null,
    data: null,
    info: null
  }),
  getters: {},
  actions: {}
})
