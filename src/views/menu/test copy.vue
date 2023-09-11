<template>
    <side-menu :menuItems="menuItems"></side-menu>
</template>


<script>
import axios from 'axios';
import { useAuthStore } from '@/store/authStore';
import SideMenu from './SideMenu.vue';

export default {
  name: 'Navbar',
  data() {
    return {
      menuItems: [],
      
    };
  },
  components: {
    SideMenu,
  },
  methods: {
    itemHasSubmenu(item) {
      return item.submenu && item.submenu.length > 0;
    },
    toggleSubmenu(item) {
      item.expanded = !item.expanded;
    },
    async listMenu() {
      const baseUrl = `${import.meta.env.VITE_API_URL}/login`;
      const userStore = useAuthStore();
      const u = JSON.parse(userStore.getUser);
      const t = JSON.parse(userStore.getToken);
      try {
        const res = await axios.post(baseUrl, JSON.stringify({ roleid: u.roleid }), {
          headers: {
            'Content-Type': 'application/json',
            Authorization: Bearer ${t.tokenkey},
          },
        });
        const response = res.data;
        if (response.status === 'successed') {

         // Create a recursive function to generate the submenu
          function generateSubMenu(menuItems, parentId) {
            const submenu = response.data.filter((item) => item.pms_parent_id === parentId);

            return submenu
              .sort((a, b) => a.pms_menu_index - b.pms_menu_index)
              .map((menuItem) => ({
                pmsid: menuItem.pmsid,
                pms_menu_name: menuItem.pms_menu_name,
                pms_menu_image: menuItem.pms_menu_image,
                pms_page_name: menuItem.pms_page_name,
                pms_menu_index: menuItem.pms_menu_index,
                submenu: generateSubMenu(menuItems, menuItem.pmsid),
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
              submenu: generateSubMenu(this.menuItems, menuItem.pmsid),
            }));


            console.log(this.menuItems);

         
      


        } else {
          console.log('Failed to retrieve menu items');
        }
       
      } catch (error) {
        console.log(error.response);
      }
    },
  },
  mounted() {
    this.listMenu();
  },
  
};
</script>

<style>
.submenu {
  cursor: pointer;
}

.submenu-icon-rotated {
  transform: rotate(180deg);
}
</style>