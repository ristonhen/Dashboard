<template>
  <div class="d-flex justify-space-between align-center">
    <span class="text-uppercase font-weight-medium" >{{ items[1].title }}</span>
    <!-- Breadcrums -->
    <v-breadcrumbs 
      :items="items" 
      divider="|"
    >
      <template v-slot:divider>
        <v-icon icon="mdi-chevron-right"></v-icon>   
      </template>
      <template v-slot:title="{ item }">
        <span>{{ item.title }}</span>
      </template>
    </v-breadcrumbs>
  </div>
</template>
<script>
export default {
  name: 'Breadcrumbs',
  data(){
    return {
      items:[],
    }
  },
  methods: {
    getRoute(){
      this.items=[]
      const nameRoute = this.$route.matched[2].name
      this.items.push(
        {'title': "Home",'to': '/'},
        {'title':nameRoute, disabled: true},
        // {'title':this.$route.matched[2].name,disabled: true, 'href': this.$route.matched[2].path}
      ) 
    },
  },
  watch:{
    $route(){
      this.getRoute()
      // console.log(this.$route.name);
    }
  },
  created(){
    this.getRoute()
  }
}
</script>

<style>

</style>