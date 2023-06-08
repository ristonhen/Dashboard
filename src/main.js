import { createApp } from 'vue'
import { createPinia  } from 'pinia'
import './style.css'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import VueApexCharts from "vue3-apexcharts"
// import BlankLayout from './layouts/BlankLayout.vue'
// import DefaultLayout from './layouts/DefaultLayout.vue'
// .component('DefaultLayout', DefaultLayout)
// .component('BlankLayout',BlankLayout)

const pinia = createPinia()
loadFonts()

createApp(App)
  .use(router)
  .use(pinia)

  .use(vuetify)
  .use(VueApexCharts)
  .mount('#app')
