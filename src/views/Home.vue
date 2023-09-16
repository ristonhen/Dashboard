<template>
  <v-app id="inspire" v-for="(app,index) in manageApp" :key="index">
    <!-- permanent , expand-on-hover  , @click="rail = false""-->
    <v-navigation-drawer 
      v-model="drawer"
      :rail="rail"
      
      expand-on-hover
    >
      <div class="sticky-top">
        <v-list-item
          lines="two"
          :prepend-avatar="app.logo"
          nav
          
        >
          <template v-slot:append>
            <v-icon
              variant="text"
              icon="mdi-dots-vertical"
              @click.stop="rail = !rail"
            />
          </template>
          <v-list-item-title class="font-weight-black text-body-2">{{ app.apptitle }}</v-list-item-title>
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
  import { onMounted } from 'vue'
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
      
    },
    setup() {
      onMounted(() => {
        // console.log(user); // Log the user object to the console after component is mounted
      });
    },
  }
</script>
<style lang="sass">
  .v-navigation-drawer__content
    overflow: hidden !important

  .sticky-top
    position: sticky
    top: 0
    background-color: white // Optional: Set a background color if desired
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