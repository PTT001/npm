import { defineStore } from 'pinia'

export default defineStore({
  id: 'store',
  state: () => ({
    QRCodeIsExpired: false,
    headitem: 0,
    itemitem: 0,
    handitem: 0,
    energyitem: 0,
    haveitem: '',
    name: '',
    content: '',
    option: ''
  }),
  getters: {},
  actions: {}
})
