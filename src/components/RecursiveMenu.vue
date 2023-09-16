<template>
  <v-list density="compact" nav>
    <template v-for="(item, index) in menuItems" :key="index">
      <v-list-group
        v-if="item.submenus && item.submenus.length > 0"
        :key="'group-' + index"
        :value="item.pms_menu_name"
      >
        <template v-slot:activator="{ props }">
          <v-list-item
            v-bind="props"
            :prepend-icon="item.pms_menu_image"
            :title="item.pms_menu_name"
          />
        </template>
        <template v-slot:default>
          <RecursiveMenu :menuItems="item.submenus" class="pa-0 ma-0" />
        </template>
      </v-list-group>
      <v-list-item
        v-else
        active-class="bg-blue-grey-darken-2"
        :key="'item-' + index"
        :prepend-icon="item.pms_menu_image"
        :title="item.pms_menu_name"
        :to="item.pms_page_name.charAt(0).toUpperCase() + item.pms_page_name.slice(1)"
      />
    </template>
  </v-list>
</template>

<script>
import router from '@/router';

export default {
  name: 'RecursiveMenu',
  props: {
    menuItems: {
      type: Array,
      required: true
    }
  },
  methods: {
    addRoute(item) {
      router.addRoute({
        path: `/${item.pms_menu_name}`,
        name: item.pms_menu_name,
        component: () => import(`@/views/menu/${item.pms_menu_name}.vue`)
      });
      this.$router.push(`/${item.pms_menu_name}`);
    },
  },
};
</script>