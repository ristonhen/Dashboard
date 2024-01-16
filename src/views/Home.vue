<template>
  <v-app id="inspire">
    <!-- permanent , expand-on-hover  , @click="rail = false""-->
    <v-navigation-drawer 
      v-model="drawer"
      :rail="rail"
      expand-on-hover
    >
      <div class="sticky-top">
        <v-list-item
          lines="two"
          prepend-avatar="../assets/canalogo.webp"
          nav
          
        >
          <template v-slot:append>
            <v-icon
              variant="text"
              icon="mdi-dots-vertical"
              @click.stop="rail = !rail"
            />
          </template>
          <v-list-item-title class="font-weight-black text-body-2">App Admin</v-list-item-title>
        </v-list-item>
        <v-divider />
      </div>
      <!-- NavBAr -->
      <!--  -->
      <!-- <div style="overflow-y: auto; max-height: calc(100vh - 64px);"> -->
      <div class="custom-scrollbar">
        <Navbar />
      </div>
    </v-navigation-drawer>
    <!-- HEADER BAR -->
    <Headers :drawer="drawer" @toggleDrawer="toggleDrawer"/>
    <!-- CONTAINER -->
    <Container />
  </v-app>
</template>
<script>
import { useAuthStore } from '@/stores/authStore'
import { useRoute, useRouter } from 'vue-router';

import Navbar from './dashboard/Navbar.vue'
import Headers from './dashboard/Headers.vue'
import Container from './dashboard/Container.vue'

export default {
  name: 'Home',
  components: { Navbar, Headers , Container },
  data: () => ({ 
    manageApp: [
      { apptitle: 'App Admin', logo: '../assets/canalogo.webp'} 
    ],
    drawer: true,
    rail: false, 
  }),
  methods:{
    toggleDrawer(newValue){
      this.drawer = newValue
    },
    toggleRail(newRail){
      this.drawer = newRail
    },
    async registerRoutesFromStorage() {
      const authStore = useAuthStore()
      const { getRoute } = authStore;
      const dynamicRoutes = await getRoute
      if (dynamicRoutes) {
        dynamicRoutes.forEach((route) => {
          this.$router.addRoute('Home', {
            path: `/${route.name}`,
            name: `${route.path}`,
            component: () => import(`@/views/menu/${route.name}.vue`),
            props: true,
          });
        });
      }
    },
  },
  mounted(){
    this.registerRoutesFromStorage()
  }
}
</script>
<style lang="sass">
  .v-navigation-drawer__content
    overflow: hidden !important

  .sticky-top
    position: sticky
    top: 0
    z-index: 1

  .custom-scrollbar
    height: 100%
    overflow-x: hidden !important

    &::-webkit-scrollbar
      width: 0px
      transition: width 0.3s

    &::-webkit-scrollbar-thumb
      padding-right: 2px
      background: gray
      border-radius: 15px
      transition: background-color 0.3s

    &::-webkit-scrollbar-thumb:hover
      background: black

  .custom-scrollbar:not(:hover)::-webkit-scrollbar
    width: 0
  
</style>