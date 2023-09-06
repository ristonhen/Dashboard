<template>
  <v-card class="mx-auto" width="300">
    <v-list v-model:opened="open">
      <v-list-item prepend-icon="mdi-home" title="Home"></v-list-item>
      <v-list-group v-for="(group, index) in menuItems" :key="index" :value="group.title">
        <template v-slot:activator="{ props }">
          <v-list-item
            v-bind="props"
            :prepend-icon="group.icon"
            :title="group.title"
          ></v-list-item>
        </template>

        <v-list-group v-for="(subGroup, i) in group.subGroups" :key="i" :value="subGroup.title">
          <template v-slot:activator="{ props }">
            <v-list-item v-bind="props" :title="subGroup.title"></v-list-item>
          </template>

          <v-list-group v-for="(childGroup, j) in subGroup.childGroups" :key="j" :value="childGroup.title">
            <template v-slot:activator="{ props }">
              <v-list-item v-bind="props" :title="childGroup.title"></v-list-item>
            </template>

            <v-list-item
              v-for="(item, k) in childGroup.items"
              :key="k"
              :title="item.title"
              :prepend-icon="item.icon"
              :value="item.title"
            ></v-list-item>
          </v-list-group>
        </v-list-group>
      </v-list-group>
    </v-list>
  </v-card>
</template>

<script>
export default {
  data: () => ({
    open: [],
    menuItems: [
      {
        title: 'Users',
        icon: 'mdi-account-circle',
        subGroups: [
          {
            title: 'Admin',
            childGroups: [
              {
                title: 'Management',
                items: [
                  { title: 'Manage Users', icon: 'mdi-account-multiple-outline' },
                  { title: 'Manage Settings', icon: 'mdi-cog-outline' },
                ],
              },
              {
                title: 'Reports',
                items: [
                  { title: 'Sales Report', icon: 'mdi-chart-bar' },
                  { title: 'User Activity Report', icon: 'mdi-chart-line' },
                ],
              },
            ],
          },
          {
            title: 'Actions',
            childGroups: [
              {
                title: 'Create',
                items: [
                  { title: 'Create User', icon: 'mdi-plus-outline' },
                  { title: 'Create Document', icon: 'mdi-file-plus' },
                ],
              },
              {
                title: 'Update',
                items: [
                  { title: 'Update User', icon: 'mdi-account-edit' },
                  { title: 'Update Document', icon: 'mdi-file-edit' },
                ],
              },
            ],
          },
        ],
      },
    ],
  }),
};
</script>