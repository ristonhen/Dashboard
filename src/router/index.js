import { createRouter, createWebHistory } from "vue-router"
import DefaultLayout from '../layouts/DefaultLayout.vue'
import BlankLayout from '../layouts/BlankLayout.vue'
import { useAuthStore } from "../store/auth"

const routes = [
  {
    path: '/:catchAll(.*)',
    name: 'NotFound',
    component: () => import('../layouts/NotFound.vue'),
  },
  {
    path: '',
    name: 'DefaultLayout',
    component: DefaultLayout,
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('../views/Home.vue'),
        meta: {
          requiresAuth: true
        },
        children: [
          {
            path: '',
            name: "temp",
            redirect: '/Dashboard',
          },
          {
            path: '/Dashboard',
            name: 'Dashboard',
            component: () => import('../views/menu/Dashboard.vue'),
            meta: {
              requiresAuth: true
            }
          },
          {
            path: '/about',
            name: 'About',
            props: true,
            component: () => import('../views/menu/About.vue')
          },
          {
            path: '/Configuration',
            name: 'Configuration',
            props: true,
            component: () => import('../views/menu/Configuration.vue')
          },
          {
            path: '/todo',
            name: 'Todo',
            props: true,
            component: () => import('../views/menu/Todo.vue')
          },
          {
            path: '/user-config',
            name: 'User-config',
            props: true,
            component: () => import('../views/menu/ManageUser.vue')
          },
          {
            path: '/Configuration',
            name: 'Configuration',
            props: true,
            component: () => import('../views/menu/Configuration.vue')
          },
          {
            path: '/report',
            name: 'Report',
            props: true,
            component: () => import('../views/menu/Report.vue')
          },
          {
            path: '/Team',
            name: 'Team',
            props: true,
            component: () => import('../views/menu/Team.vue')
          },
          
        ]
      }
    ]
  },
  {
    path: '',
    name: 'BlankLayout',
    component: BlankLayout,
    children: [
      {
        path: '/login',
        name: 'Login',
        component: () => import('../views/auth/Login.vue'),
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
  // get token from localStorage
  const token = localStorage.getItem('token')
  // const token = useAuthStore()
  
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
  document.title = to.name + ' - ADMINAPP';
});
export default router