import { defineStore} from 'pinia'

export default useDataStore = defineStore('data',
{
  state: () => (
    {
    someData: [],
  }),

  actions: {
    setSomeData(data) {
      this.someData = data;
    },
  },
})

