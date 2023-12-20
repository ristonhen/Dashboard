<template>
    <RecursiveMenu :menuItems="menuItems"></RecursiveMenu>
</template>
<script>
import { useAuthStore } from '@/store/authStore'
import RecursiveMenu from '@/components/RecursiveMenu.vue'
import  axios  from 'axios'
export default {
  name: 'Navbar',
  components: {
    RecursiveMenu
  },
  data: () => ({ 
    menuItems: [], 
  }),
  methods:{
    async getMenu() {
      const authStore = useAuthStore();
      const baseUrl = `${import.meta.env.VITE_API_URL}/menu/getmenuassignedrole`;
      const { getToken } = authStore;
      try {
        if (getToken) {
          const res = await axios.get(baseUrl, {
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken}` },
          });
          const response = res.data;
          if (response.status === true) {
            // Create a recursive function to generate the submenu
            const generateMenuItem = (menuItem) => {
              const { pmsid, pms_menu_name, pms_menu_image, pms_page_name, pms_menu_index } = menuItem;
              const submenus = generateSubMenu(this.menuItems, pmsid);
              return {
                pmsid,
                pms_menu_name,
                pms_menu_image,
                pms_page_name,
                pms_menu_index,
                submenus,
              };
            };
            const generateSubMenu = (menuItems, parentId) =>
              response.data
                .filter((item) => item.pms_parent_id === parentId)
                .sort((a, b) => a.pms_menu_index - b.pms_menu_index)
                .map(generateMenuItem);
            this.menuItems = response.data
              .filter((item) => item.pms_menu_level === '1')
              .sort((a, b) => a.pms_menu_index - b.pms_menu_index)
              .map(generateMenuItem);
            const routes = this.generateRoutes(this.menuItems);
            const userStore = useAuthStore();
            userStore.setRoute(JSON.stringify(routes).toString())

          } else {
            console.log('Failed to retrieve menu items')
          }
        }
      } catch (error) {
        console.log(error.response);
        if (error.response && error.response.data && error.response.data.detail) {
          const errorDetails = error.response.data.detail;
          console.log('Error details:', errorDetails);
        }
      }
    },
    generateRoutes(menuItems, parentPath = ''){
      const routes = [];
      for (const menuItem of menuItems) {
        const name = menuItem.pms_page_name.charAt(0).toUpperCase() + menuItem.pms_page_name.slice(1)
        if (menuItem.submenus.length === 0) {
          const path = `${parentPath}/${menuItem.pms_page_name}`;
          
          const route = {
            path,
            name: name,
          };
          routes.push(route);
        } else {
          const submenuRoutes = this.generateRoutes(menuItem.submenus, `${parentPath}/${menuItem.pms_page_name}`);
          routes.push(...submenuRoutes);
        }
      }
      return routes;
    },
    addRoute() {
      const newRoute = {
        path: '/search',
        name: 'Search',
        component: () => import('@/components/Search.vue'),
        props: true,
      };
      this.$router.addRoute(newRoute);
    },
  },
  mounted(){
    this.getMenu()
    this.addRoute()
  }
}
</script>

  
  
  