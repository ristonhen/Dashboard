import { createRouter, createWebHistory } from "vue-router"
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import BlankLayout from '@/layouts/BlankLayout.vue'
import NotFound from '@/layouts/NotFound.vue'
import HomeVue from '@/views/Home.vue'
import DashboardVue from "@/views/menu/Dashboard.vue"

import { useAuthStore } from '@/store/authStore'

var r=[]
if (localStorage.getItem('r_')) {
  const parsedR = JSON.parse(localStorage.getItem('r_'));
    
  r = parsedR.map((route) => ({
      path: `${route.name}`,
      name: `${route.path}`,
      component: () => import(`@/views/menu/${route.name}.vue`),
      props: true,
  }));
} 
const routes = [
  {
    path: '/:catchAll(.*)',
    name: 'NotFound',
    component: NotFound,
  },
  {
    path: '',
    name: 'DefaultLayout',
    component: DefaultLayout,
    children: [
      {
        path: '',
        name: 'Home',
        component: HomeVue,
        children: [
          {
            path: '',
            name: "temp",
            redirect: '/Dashboard',
          },
          {
            path: '/Dashboard',
            name: 'Dashboard',
            component: DashboardVue,
            meta: {
              requiresAuth: true
            }
          },
          ...r],
      }
    ],
    
  },
  {
    path: '',
    name: 'BlankLayout',
    component: BlankLayout,
    children: [
      {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/auth/Login.vue'),
        meta: {
          requiresNoAuth: true
        }
      },
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})
// check token before login and dynamic header title name
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  // get token from localStorage
  const token = authStore.getToken
  if(to.matched.some(record => record.meta.requiresAuth)){
    if (!token) {
      next('/login');
    } else {
      next();
    }
  }else if (to.matched.some(record => record.meta.requiresNoAuth)) {
    if (token) {
      next('/');
    } else {
      next();
    }
  }else {
    // Call the next() function to continue navigating
    next();
  }
  // Set the document title based on the name of the current route
  // document.title = to.name + ' - APP';
  document.title = 'APP';
});
export default router