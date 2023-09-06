<template>
  <div>
    <v-list-group v-if="hasSubGroups" :value="item.title">
      <template #activator>
        <v-list-item :prepend-icon="item.icon" :title="item.title"></v-list-item>
      </template>
      <recursive-menu v-for="(subGroup, index) in item.subGroups" :item="subGroup" :key="index" />
    </v-list-group>
    <v-list-item v-else :title="item.title" :prepend-icon="item.icon"></v-list-item>
  </div>
</template>

<script>
export default {
  name: 'RecursiveMenu',
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  computed: {
    hasSubGroups() {
      return this.item.subGroups && this.item.subGroups.length > 0;
    },
  },
};
</script>