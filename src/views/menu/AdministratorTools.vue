<template>
  <div>{{ items.title }}</div>
</template>
<script>
export default {
  name: 'Admin',
  data(){
    return {
      items:[],
    }
  },
  methods: {
    getRoute(){
      this.items= []
      const nameRoute = this.$route.matched[2].name
      this.items.push(
        {'title':nameRoute},
        {'title':this.userId,disabled: true, 'href': this.$route.matched[2].path}
      ) 
    },
  },
  computed: {
    userId() {
      return this.$route.params.id;
    }
  },
  watch:{
    $route(){
      this.getRoute()
      console.log('User ID:', this.userId);
      console.log('User ID:', this.items);
    }
  },
  created(){
    this.getRoute()
  }
}
</script>












<!-- <script>
export default {
  computed: {
    userId() {
      return this.$route.params.id;
    }
  },
  watch:{

  },
  mounted() {
    console.log('User ID:', this.userId);
  },

};
</script> -->