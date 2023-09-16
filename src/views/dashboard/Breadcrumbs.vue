<template>
  <div class="d-flex justify-space-between align-center">
    <span class="text-uppercase font-weight-medium" >{{ breadcrumbs[1].text }}</span>
    <!-- Breadcrums -->
    <v-breadcrumbs 
      :items="breadcrumbs" 
      divider="/"
    >
      <template v-slot:title="{ item }">
        <span>{{ item.text }}</span>
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
      breadcrumbs: [],
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
    generateBreadcrumbs(path) {
      if (typeof path !== 'string') {
        console.error('Path must be a string.');
        return;
      }

      const segments = path.split('/').filter(Boolean);
      let currentPath = '';
      this.breadcrumbs = [
        {
          text: 'Home',
          to: '/',
          disabled: false,
        },
        ...segments.map((segment, index) => {
          currentPath += `/${segment}`;
          return {
            text: segment,
            to: currentPath,
            disabled: true,
          };
        }),
      ];
    }, 
  },
  computed: {
    userId() {
      return this.$route.params.id;
    }
  },
  watch:{
    $route(){
      // this.getRoute() // console.log(this.$route.name); // console.log(this.items[1]);
      // console.log(this.$route.matched[2].name)
      this.generateBreadcrumbs(this.$route.name)
    }
  },
  created(){
    // this.getRoute()
    this.generateBreadcrumbs(this.$route.name);
  },
}
</script>
<style scoped>
.v-breadcrumbs-divider {
    padding: 0 0px
}
</style>