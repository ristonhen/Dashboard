<template>
  <div class="d-flex justify-space-between align-center">
    <span class="text-uppercase font-weight-medium" >{{ items[1].title }}</span>
    <!-- Breadcrums -->
    <v-breadcrumbs 
      :items="items" 
      divider="/"
    >
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
        {'title':nameRoute , disabled: true, 'href': this.$route.matched[2].path},
      )
      if(this.$route.params.id){
        this.items.push(
          {'title':this.userId, disabled: true, 'href': this.$route.matched[2].path}
        )
        if(this.items.length === 3 && this.items[1].disabled){
          this.items[1].disabled = false
        }
      }
    },  
  },
  computed: {
    userId() {
      return this.$route.params.id;
    }
  },
  watch:{
    $route(){
      this.getRoute() // console.log(this.$route.name); // console.log(this.items[1]);
    }
  },
  created(){
    this.getRoute()
  }
}
</script>
<style scoped>
.v-breadcrumbs-divider {
    padding: 0 0px
}
</style>