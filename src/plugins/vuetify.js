import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import * as labsComponents from 'vuetify/labs/components'

export default createVuetify({

    components:{ 
      ...components,
      ...labsComponents,
    },
    directives,
    icons: {
      defaultSet: 'mdi', 
      aliases,
      sets: {
        mdi,
      },
    },
    theme: {
      defaultFontFamily: 'sans-serif'
    }
  })