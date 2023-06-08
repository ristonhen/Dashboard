<template>
  <div class="d-flex justify-center align-center h-screen">
    <div class="not-found section">
      <h1 class="error">404</h1>
      <div class="page">The page you requested could not be found.</div>
      <router-link to="/" class="">
        <v-hover>
          <template v-slot:default="{ isHovering, props }">
            <v-btn rounded="xs"
              v-bind="props"
              :color="isHovering ? 'teal' : undefined"
              size="large" 
              variant="outlined">GO TO HOME
            </v-btn>
          </template>
        </v-hover>
      </router-link>
    </div>
  </div>
</template>
<script>
export default {
  name: 'NotFound',
  data(){
    return{
      // pageTitle: '404 Page Not Found'  
    }
  },
  // created() {
  //   document.title = this.pageTitle;
  // },
}
</script>

<style scoped>
html, body{
  margin: 0;
  padding: 0;
  font-family: sans-serif;
  background-color: #E7FFFF;
}

.section{
  padding: 4rem 2rem;
  text-align: center;
}
.section .error{
  font-size: 150px;
  color: #008B62;
  text-shadow: 
    1px 1px 1px #00593E,    
    2px 2px 1px #00593E,
    3px 3px 1px #00593E,
    4px 4px 1px #00593E,
    5px 5px 1px #00593E,
    6px 6px 1px #00593E,
    7px 7px 1px #00593E,
    8px 8px 1px #00593E,
    25px 25px 8px rgba(0,0,0, 0.2);
}
.page{
  margin: 2rem 0;
  font-size: 20px;
  font-weight: 600;
  color: #444;
}
</style>