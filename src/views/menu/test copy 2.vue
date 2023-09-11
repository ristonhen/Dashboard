<template>
      <v-list v-model="open">
        <template v-for="(item, index) in menuItems" :key="index">
          <v-list-group v-if="hasSubmenu(item)" :key="'group-' + index" :value="item.pms_menu_name">
            <template v-slot:activator="{ props }">
              <v-list-item v-bind="props" :prepend-icon="item.pms_menu_image" :title="item.pms_menu_name"></v-list-item>
            </template>
            <template v-slot:default>
              <side-menu :menuItems="item.submenu"></side-menu>
            </template>
          </v-list-group>
          <v-list-item v-else :key="'item-' + index" :prepend-icon="item.pms_menu_image" :title="item.pms_menu_name" :to="item.pms_page_name"></v-list-item>
        </template>
      </v-list>
  </template>
  
  <script>
  export default {
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
    methods: {
      hasSubmenu(item) {
        return Array.isArray(item.submenu) && item.submenu.length > 0;
      },
    },
  };
  </script>