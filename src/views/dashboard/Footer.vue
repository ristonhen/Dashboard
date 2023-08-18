<template>
    <v-footer 
      v-for=" appFooter in versionApp" :key="appFooter"
      class="text-medium-emphasis py-3 d-flex justify-space-between text-medium-emphasis" 
      app
      border
      elevation="10"
    >
      <div>
        <span>© 2023 Developed By </span>
        <span class="font-weight-bold">{{ appFooter.developby }}</span>
      </div>
      <div>
        <span>Release {{ appFooter.release }}</span><span class="font-weight-bold"> V </span><span>{{ appFooter.version }}</span>
      </div>
    </v-footer>
  </template>
  <script setup>
    const versionApp = [{ developby : 'Canadia Bank Database Team', version: '0.0.1', release: 2023 }]
  </script>
  