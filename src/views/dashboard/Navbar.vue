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
        function generateSubMenu(menuItems, parentId) {
          const submenus = response.data.filter((item) => item.pms_parent_id === parentId);

          return submenus
            .sort((a, b) => a.pms_menu_index - b.pms_menu_index)
            .map((menuItem) => ({
              pmsid: menuItem.pmsid,
              pms_menu_name: menuItem.pms_menu_name,
              pms_menu_image: menuItem.pms_menu_image,
              pms_page_name: menuItem.pms_page_name,
              pms_menu_index: menuItem.pms_menu_index,
              submenus: generateSubMenu(menuItems, menuItem.pmsid),
            }));
        }

        // Filter top-level items
        const topLevelItems = response.data.filter((item) => item.pms_menu_level === '1');

        // Generate the menu structure
        this.menuItems = topLevelItems
          .sort((a, b) => a.pms_menu_index - b.pms_menu_index)
          .map((menuItem) => ({
            pmsid: menuItem.pmsid,
            pms_menu_name: menuItem.pms_menu_name,
            pms_menu_image: menuItem.pms_menu_image,
            pms_page_name: menuItem.pms_page_name,
            pms_menu_index: menuItem.pms_menu_index,
            submenus: generateSubMenu(this.menuItems, menuItem.pmsid),
          }));

        function generateRoutes(menuItems, parentPath = '') {
          const routes = [];

          for (const menuItem of menuItems) {
            if (menuItem.submenus.length === 0) {
              const path = `${parentPath}/${menuItem.pms_page_name}`;
              const route = {
                path,
                name: menuItem.pms_page_name.charAt(0).toUpperCase() + menuItem.pms_page_name.slice(1),
              };
              routes.push(route);
            } else {
              const submenuRoutes = generateRoutes(menuItem.submenus, `${parentPath}/${menuItem.pms_page_name}`);
              routes.push(...submenuRoutes);
            }
          }
          return routes;
        }

        const routes = generateRoutes(this.menuItems);
        const userStore = useAuthStore();
        userStore.setRoute(JSON.stringify(routes));
      } else {
        console.log('Failed to retrieve menu items');
      }
    }
  } catch (error) {
    console.log(error.response);

    if (error.response && error.response.data && error.response.data.detail) {
      const errorDetails = error.response.data.detail;
      console.log('Error details:', errorDetails);
      // Handle the error or display the error messages to the user
    }
  }
}
  },
  mounted(){
    this.getMenu()
  }
}
</script>
<style>

</style>
  
  
  
  
  