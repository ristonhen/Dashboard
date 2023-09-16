import { createRouter, createWebHistory } from "vue-router"
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import BlankLayout from '@/layouts/BlankLayout.vue'
import NotFound from '@/layouts/NotFound.vue'
import HomeVue from '@/views/Home.vue'
import DashboardVue from "@/views/menu/Dashboard.vue"
import ManageUserVue from "@/views/menu/ManageUser.vue"
import AdministratorToolsVue from "@/views/menu/AdministratorTools.vue"
import AboutVue from "@/views/menu/About.vue"
import ConfigurationVue from "@/views/menu/Configuration.vue"
import ReportVue from "@/views/menu/Report.vue"
import TeamVue from "@/views/menu/Team.vue"
import { useAuthStore } from '@/store/authStore'
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
            component: DashboardVue,
            meta: {
              requiresAuth: true
            }
          },
          {
            path: '/User',
            name: 'User_&_Permission',
            props: true,
            component: BlankLayout,
            children: [
              {
                path: '/User/:id',
                name: 'User',
                component: ManageUserVue,
              }
            ]
          },
          {
            path: '/Administrator',
            name: 'Administrator',
            props: true,
            component: BlankLayout,
            children: [
              {
                path: '/Administrator/:id',
                name: 'Admin',
                component: AdministratorToolsVue,
              }
            ]
          },
          {
            path: '/about',
            name: 'About',
            props: true,
            component: AboutVue,
          },
          {
            path: '/Configuration',
            name: 'Configuration',
            props: true,
            component: ConfigurationVue
          },
          
          {
            path: '/Configuration',
            name: 'Configuration',
            props: true,
            component: ConfigurationVue
          },
          {
            path: '/report',
            name: 'Report',
            props: true,
            component: ReportVue
          },
          {
            path: '/Team',
            name: 'Team',
            props: true,
            component: TeamVue
          },
          {
            path: '/test',
            name: 'test',
            props: true,
            component: () => import('../views/menu/test.vue')
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
  document.title = to.name + ' - APP';
});
export default router