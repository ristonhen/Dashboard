import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import '@/styles/main.scss'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import * as labsComponents from 'vuetify/labs/components'

const myCustomLightTheme = {
  dark: false,
  colors: {
    background: '#FFFFFF',
    surface: '#FFFFFF',
    primary: '#6200EE',
    'primary-darken-1': '#3700B3',
    secondary: '#03DAC6',
    'secondary-darken-1': '#018786',
    error: '#B00020',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FB8C00',
  },
}

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
      options: {
        customProperties: true,
      },
      defaultTheme: 'myCustomLightTheme',
      themes: {
        myCustomLightTheme,
      },
      defaultFontFamily: 'sans-serif',
      fontSize: 10,
    }
  })