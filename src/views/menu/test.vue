<template>
  <div>
    <button @click="addRoute">Add Dynamic Route</button>

    <router-view></router-view>
  </div>
</template>

<script>
export default {
  data() {
    return {
      routes: []
    };
  },
  methods: {
    addRoute() {
      this.routes.push({
        path: '/dynamic',
        component: {
          template: '<h2>Dynamic Route</h2>'
        }
      });
    }
  },
  created() {
    // Register dynamically added routes
    this.routes.forEach(route => {
      this.$router.addRoute(route);
    });
  }
};
</script>