// router/index.js
const router = new VueRouter({
  routes: [
    { path: '/login', component: Login },
    { path: '/home', component: Home }
  ]
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (to.path !== '/login' && !token) next('/login')
  else next()
})

// Login.vue
methods: {
  login() {
    // login logic here
    localStorage.setItem('token', 'some-token')
    this.$router.push('/home')
  }
}

// Home.vue
created() {
  const token = localStorage.getItem('token')
  if (!token) this.$router.push('/login') 
}