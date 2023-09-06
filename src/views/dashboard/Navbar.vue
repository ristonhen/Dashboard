<template>
  <v-list density="compact" nav>
    <v-list-group v-for="(item, index) in menuItems" :key="index" :value="item.pms_menu_name">
      <template v-slot:activator="{ props }">
        <v-list-item
          v-bind="props"
          :prepend-icon="item.pms_menu_image"
          :title="item.pms_menu_name"
        ></v-list-item>
      </template>

      <v-list-group v-for="(submenu, i) in item.submenus" :key="i" :value="submenu.pms_menu_name">
        <template v-slot:activator="{ props }">
          <v-list-item v-bind="props" :title="submenu.pms_menu_name"></v-list-item>
        </template>

        <v-list-group v-for="(childsubitem, j) in submenu.submenus" :key="j" :value="childsubitem.title">
          <template v-slot:activator="{ props }">
            <v-list-item v-bind="props" :title="childsubitem.pms_menu_name"></v-list-item>
          </template>

          <v-list-item
            v-for="(itemss, k) in childsubitem.submenus"
            :key="k"
            :title="itemss.pms_menu_name"
            :prepend-icon="itemss.icon"
            :value="itemss.title"
          ></v-list-item>
        </v-list-group>
      </v-list-group>
    </v-list-group>
  </v-list>
</template>
<script>
import { useAuthStore } from '@/store/authStore'
import  axios  from 'axios'
import { onMounted, ref } from 'vue';
export default {
  name: 'Navbar',
  data: () => ({ 
    menuItems: [], 
  }),
  methods:{
    getUser(){
      const data = JSON.parse(localStorage.getItem('user'))
      const bytes  = CryptoJS.AES.decrypt(data, 'Cana!@#123');
      const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      return decryptedData
    },
    async fetchData(){
      const authStore = useAuthStore()
      const baseUrl = `${import.meta.env.VITE_API_URL}/menu/getmenuassignedrole`
      const token = authStore.getToken
      try {
        if (token ){
          const res = await axios.get(baseUrl,
            {
              headers: { 'Content-Type': 'application/json',Authorization: `Bearer ${token}` },
            })
          const response = res.data;
          if (response.status === true) {
            // Create a recursive function to generate the submenu
            function generateSubMenu(menuItems, parentId) {
              const submenus = response.data.filter((item) => item.pms_parent_id === parentId)

              return submenus
              .sort((a, b) => a.pms_menu_index - b.pms_menu_index)
              .map((menuItem) => ({
                pmsid: menuItem.pmsid,
                pms_menu_name: menuItem.pms_menu_name,
                pms_menu_image: menuItem.pms_menu_image,
                pms_page_name: menuItem.pms_page_name,
                pms_menu_index: menuItem.pms_menu_index,
                submenus: generateSubMenu(menuItems, menuItem.pmsid),
              }))
            }
            // Filter top-level items
            const topLevelItems = response.data.filter((item) => item.pms_menu_level === '1')
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
          console.log(this.menuItems)
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
    this.fetchData()
    // this.getUser()
    console.log(import.meta.env.VITE_SOME_KEY) // 123
    console.log(import.meta.env.NEW_KEY1) // undefined
  }
}
</script>
<style>

</style>
  
  
  
  
  