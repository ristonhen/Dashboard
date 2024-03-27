import { createRouter, createWebHistory } from "vue-router"
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import BlankLayout from '@/layouts/BlankLayout.vue'
import NotFound from '@/layouts/NotFound.vue'
import HomeVue from '@/views/Home.vue'
import DashboardVue from "@/views/menu/Dashboard.vue"
import Utest from "@/views/menu/ManageUser.vue"
import Test from '@/components/Test.vue'
import DropZone from '@/components/Utilities/DropZone.vue'
import HomeTest from '@/components/Utilities/HomeTest.vue'

import CryptoJS from 'crypto-js'
const depass = `${import.meta.env.VITE_DEPASS}`;


const routes = [
  {
    path: '/:pathMatch(.*)*',
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
          },
          {
            path: '/Test',
            name: 'Test',
            component: Test,
          },
        ],
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
      {
        path: '',
        name: 'hometest',
        component: BlankLayout,
        meta: {
          requiresNoAuth: true
        },
        children: [
          {
            path: '/dragdrop',
            name: 'dragdrop',
            component: HomeTest,
            meta: {
              requiresNoAuth: true
            }
          }
        ]
      },
      {
        path: '/resetpassword/:param',
        name: 'Resetpwd',
        component: () => import('@/views/menu/Resetpwd.vue'),
        meta: {
          requiresNoAuth: true,
          title: "Forgotten Password | Can't login"
        },
        beforeEnter: (to, from, next) => {
          document.title = to.meta.title || 'Default Title';
          next();
        }
      },
      {
        path: '/forgot-password',
        name: 'forgot-password',
        component: () => import('@/components/ForgetPassword.vue'),
        meta: {
          requiresNoAuth: true,
          title: "Forgotten Password | Can't login"
        },
      },
    ]
  }
]
const router = createRouter({
  history: createWebHistory(),
  routes,
})

const addRoutesFromStorage = async () => {
  const data = sessionStorage.getItem('route')
  if (data){
    const bytes  = CryptoJS.AES.decrypt(data, depass);
    const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    const dynamicRoutes = JSON.parse(decryptedData)
    dynamicRoutes.forEach((route) => {
      router.addRoute('Home', {
        path: `/${route.name}`,
        name: `${route.path}`,
        component: () => import(`@/views/menu/${route.name}.vue`),
        props: true,
      });
    });
  }
};
addRoutesFromStorage();
export default router