<template>
  <v-list density="compact" nav>
    <div v-for="(item,index) in menu" :key="index"
      style="padding: 2px 0;"
    > 
      <v-list-item v-if="item.sub == false"
        active-class="bg-blue-grey-darken-2"
        :prepend-icon="item.icon"  
        :title="item.title" 
        :value="item" 
        :to="{ name : item.title}"
      >
      </v-list-item>
      <!-- dropdown -->
      <div v-else>
        <v-list-group :value="item.title">
          <template v-slot:activator="{ props }">
            <v-list-item
              active-color="bg-blue-grey-darken-2"
              v-bind="props"
              :prepend-icon="item.icon"
              :title="item.title" 
              :value="item" 
            >
            </v-list-item>
          </template>
          <v-list density="compact" nav class="pa-0 ma-0">
          <v-list-item
            active-class="bg-blue-grey-darken-2"
            v-for="a in item.admins" :key="a"
            :value="a.title"
            :title="a.title"
            :to="a.to"
          >
            <template v-slot:prepend>
              <v-icon
                style="margin-left: 4px;"
                variant="text"
                size="15"
                icon="mdi-circle-outline"
              ></v-icon>
            </template>
          </v-list-item>
          </v-list>
        </v-list-group>
      </div>
    </div>
  </v-list>
</template>
<script>
export default {
  name: 'Navbar',
  data: () => ({ 
    pageTitle: 'MY PAGE TITLE',
    items:[],
    manageApp: [
    //   { apptitle: 'App Admin', logo: './assets/img/app-logo.png' } 
    ],
    menu: [
      { title: 'Dashboard', icon: 'mdi-view-dashboard',to: '',to_name: "",sub: false },
      { title: 'Todo', icon: 'mdi-format-list-checkbox',to: '/todo',to_name: "Todo",sub: false },
      { title: 'About', icon: 'mdi-information' ,to: '/about', to_name: "About",sub: false },
      { title: 'User-config', icon: 'mdi-account-cog-outline',to: '/user-config' ,sub: true , 
        admins: [
          {title:'Add user', icon: 'mdi-account-multiple-outline',to: '/user-config' },
          {title:'Reset password', icon: 'mdi-cog-outline',to: '/user-config' }
        ],
      },
      { title: 'Report', icon: 'mdi-chart-areaspline',to: '/report' ,sub: true,
        admins: [
          { title : 'Create', icon: 'mdi-plus-outline',to: '/Report' },
          // { title : 'Read', icon: 'mdi-file-outline',to: '/Report' },
          // { title : 'Update', icon: 'mdi-update',to: '/Report' },
          // { title : 'Delete', icon: 'mdi-delete',to: '/Report' },
        ]
      },
      { title: 'Configuration', icon: 'mdi-cog-transfer' ,to: '/configuration',sub: false },
      { title: 'Team', icon: 'mdi-microsoft-teams', to: '/team',sub: false },
      { title: 'Add-more-item ', icon: 'mdi-timer-cog', sub: true, 
        admins: [
          {title:'Management', icon: 'mdi-account-multiple-outline' },
          {title:'Settings', icon: 'mdi-cog-outline' }
      ]},
      
    ],  
  }),
  // created() {
  //   document.title = this.$route.matched[2].name
  // },
  methods:{
    // updateTitle(){
    //   this.pageTitle = this.$route.matched[2].name
    // },
    activeClass(){
      if(this.items[0] ==''){
        return true
      }

    }
  },
  watch:{
    $route(){
      // this.pageTitle = this.$route.matched[2].name
      // console.log(this.$route.matched[2].name)
    //   this.items = []
    //   this.items.push(this.$route.matched[2].name)

    },
    
    
  },
  
}
</script>
<style>

</style>
  
  
  
  
  