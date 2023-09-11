<template>
  <!-- <div>
      <ul>
        <li v-for="item in items" :key="item.id">
          {{ item.name }}
          <RecursiveComponent :items="item.children" v-if="item.children" />
        </li>
      </ul>
    </div> -->
  <div>
    <RecursiveComponent :menuItems="menuItems" />
  </div>
</template>

<script>
import RecursiveComponent from '@/components/RecursiveMenu.vue'
export default {
  components: {
    RecursiveComponent
  },
  data() {
    return {
      menuItems: [
        {
          id: 1,
          name: "Parent 1",
          children: [
            {
              id: 2,
              name: "Child 1.1",
              children: [
                {
                  id: 3,
                  name: "Sub-Child 1.1.1",
                  children: []
                }
              ]
            },
            {
              id: 4,
              name: "Child 1.2",
              children: []
            }
          ]
        },
        {
          id: 5,
          name: "Parent 2",
          children: [
            {
              id: 6,
              name: "Child 2.1",
              children: []
            }
          ]
        }
      ]
    };
  },
  mounted(){
    // console.log(this.items)
  }
};

// export default {
//   name: 'RecursiveComponent',
//   props: {
//     items: {
//       type: Array,
//       required: true
//     }
//   },
//   mounted(){
//     console.log(this.items)
//   }
// };
</script>




