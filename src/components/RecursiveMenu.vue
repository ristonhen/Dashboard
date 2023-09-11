<template>
  <v-list density="compact" nav>
    <template v-for="(item, index) in menuItems" :key="index">
      <v-list-group v-if="item.submenus && item.submenus.length > 0" :key="'group-' + index" :value="item.pms_menu_name">
        <template v-slot:activator="{ props }">
          <v-list-item 
            v-bind="props" 
            :prepend-icon="item.pms_menu_image" 
            :title="item.pms_menu_name"
          ></v-list-item>
        </template>
        <template v-slot:default>
          <RecursiveMenu :menuItems="item.submenus"></RecursiveMenu>
        </template>
      </v-list-group>
      <v-list-item 
        v-else 
        active-class="bg-blue-grey-darken-2"
        :key="'item-' + index" 
        :prepend-icon="item.pms_menu_image" 
        :title="item.pms_menu_name" 
        :to="{ name: 'Admin', params: { id: item.pms_menu_name } }"
      ></v-list-item>
    </template>
  </v-list>
</template>
  
<script>
export default {
    name: 'RecursiveMenu',
    data() {
      return {
        open: [] // Array to store the expansion state of the menu
      };
    },
    props: {
      menuItems: {
        type: Array,
        required: true,
      },
    },
  };
  </script>