<template>
  <v-main>
    <v-container
      class="bg-blue-grey-lighten-5 h-100 pt-0"
      fluid
    >
      <!-- Breadcrums -->
      <Breadcrumbs />
      <router-view/>
      <div class="tbn-scroll">
        <v-btn 
          v-scroll="onScroll"
          v-show="fab"
          icon="mdi-chevron-up" 
          color="blue-darken-3"
          @click="toTop"
        ></v-btn>
      </div>
      <!-- APP FOOTER -->
      <Footer />
    </v-container>
  </v-main>
</template>
<script>
  import Breadcrumbs from './Breadcrumbs.vue'
  import Footer from './Footer.vue'
  export default {
    components: { Footer,Breadcrumbs },
    data(){
      return {
        fab: false,
      }
    },
    methods:{
      toggleDrawer(newValue){
        this.drawer = newValue
      },
      onScroll (e) {
        if (typeof window === 'undefined') return
          const top = window.pageYOffset ||   e.target.scrollTop || 0
          this.fab = top > 20  
      },
      toTop () {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        })
      }
    },
  }
  </script>
  
  <style>
    .tbn-scroll{
      position: fixed;
      bottom: 60px;
      right: 40px;
      z-index: 99;
    }
  </style>