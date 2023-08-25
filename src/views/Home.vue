<template>
  <v-app id="inspire" v-for="(app,index) in manageApp" :key="index">
    <!-- permanent , expand-on-hover  , @click="rail = false""-->
    <v-navigation-drawer 
      v-model="drawer"
      :rail="rail"
      style="position:fixed"
      expand-on-hover
    >
      <v-list-item
        lines="two"
        prepend-avatar="https://avatars0.githubusercontent.com/u/9064066?v=4&s=460"
        nav
      >
        <template v-slot:append>
          <v-icon
            variant="text"
            icon="mdi-chevron-left"
            @click.stop="rail = !rail"
          />
        </template>
        <v-list-item-title class="font-weight-black text-body-2">{{ app.apptitle }}</v-list-item-title>
      </v-list-item>
      <v-divider />
      <!-- NavBAr -->
      <!--  -->
      <Navbar/>
    </v-navigation-drawer>
    <!-- HEADER BAR -->
    <Headers :drawer="drawer" @toggleDrawer="toggleDrawer"/>
    <!-- CONTAINER -->
    <Container />
  </v-app>
</template>
<script>
  import { useAuthStore } from '@/store/authStore'
  import { onMounted } from 'vue'
  import Navbar from './dashboard/Navbar.vue'
  import Headers from './dashboard/Headers.vue'
  import Container from './dashboard/Container.vue'
  import { storeToRefs } from 'pinia'
  export default {
    name: 'Home',
    components: { Navbar, Headers , Container },
    data: () => ({ 
      manageApp: [
        { apptitle: 'App Admin', logo: '../assets/img/app-logo.png'} 
      ],
      token: null,
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
      const useStore = useAuthStore();
      const user = useStore.getUser;
      onMounted(() => {
        // console.log(user); // Log the user object to the console after component is mounted
      });

      return {
        user,
      };
    },
  }
</script>
<style lang="sass">
  .v-navigation-drawer__content
    height: 100%
    overflow-y: auto
    overflow-x: hidden !important
    &::-webkit-scrollbar
      width: 7px                             
    &::-webkit-scrollbar-thumb
      padding-right: 2px
      background: black                                 
      border-radius: 20px
      background: gray
</style>