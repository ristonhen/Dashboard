<template>
  <div>
    <ul>
      <li v-for="item in menuItems" :key="item.pmsid">
        {{ item.pms_page_name }}
        <RecursiveComponent :menuItems="item.submenu" v-if="item.submenu" />
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'RecursiveComponent',
  props: {
    menuItems: {
      type: Array,
      required: true
    }
  },
  mounted(){
    console.log(this.menuItems)
  }
};
</script>