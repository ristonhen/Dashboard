<template>
  <v-list density="compact" nav>
    <div v-for="(item,index) in menu" :key="index"
      style="padding: 2px 0;"
    > 
      <!-- :to="{ name : item.title}" -->
      <v-list-item
        active-class="bg-blue-grey-darken-2"
        prepend-icon="mdi-view-dashboard"  
        :title="item.pms_menu_name" 
      >
      </v-list-item>
      <!-- dropdown -->
      <!-- <div v-else>
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
      </div> -->
    </div>
  </v-list>
</template>
<script>
import { useAuthStore } from '@/store/authStore'
import  axios  from 'axios'
import { onMounted, ref } from 'vue';
export default {
  name: 'Navbar',
  data: () => ({ 
    pageTitle: 'MY PAGE TITLE',
    items:[],
    manageApp: [
    //   { apptitle: 'App Admin', logo: './assets/img/app-logo.png' } 
    ],
    menu: null,
    // menu: [
    //   { title: 'Dashboard', icon: 'mdi-view-dashboard',to: '',to_name: "",sub: false },
    //   { title: 'User & Permission', icon: 'mdi-account-cog-outline',to: '/User' ,sub: true , 
    //     admins: [
    //       {title:'Create Users', icon: 'mdi-account-multiple-outline',to: { name: 'User', params: { id: 'CreateUser' } },},
    //       {title:'Reset password', icon: 'mdi-cog-outline',to: { name: 'User', params: { id: 'ResetPassword' } },},
    //       {title:'Create Role', icon: 'mdi-cog-outline',to: { name: 'User', params: { id: 'CreateRole' } },},
    //       {title:'Role Permission', icon: 'mdi-cog-outline',to: { name: 'User', params: { id: 'RolePermission' } },}
    //     ],
    //   },
    //   { title: 'Administrator Tools', icon: 'mdi-cogs',to: '/Administrator' ,sub: true , 
    //     admins: [
    //       {title:'Exchange Rate', icon: 'mdi-account-multiple-outline',to: { name: 'Admin', params: { id: 'ExchangeRate' } },},
    //       {title:'Online Counter', icon: 'mdi-cog-outline',to: { name: 'Admin', params: { id: 'OnlineCounter' } },},
    //       {title:'Free Counter', icon: 'mdi-cog-outline',to: { name: 'Admin', params: { id: 'FreeCounter' } },},
    //       {title:'Online Ticket & TV', icon: 'mdi-cog-outline',to: { name: 'Admin', params: { id: 'OnlineTicket&TV' } },},
    //       {title:'Create Branch', icon: 'mdi-cog-outline',to: { name: 'Admin', params: { id: 'CreateBranch' } },},
    //       {title:'Create Service', icon: 'mdi-cog-outline',to: { name: 'Admin', params: { id: 'Create Service' } },},
    //       {title:'Branch Service', icon: 'mdi-cog-outline',to: { name: 'Admin', params: { id: 'BranchService' } },},
    //       {title:'Counter Service', icon: 'mdi-cog-outline',to: { name: 'Admin', params: { id: 'CounterService' } },},
    //       {title:'Queue Monitoring', icon: 'mdi-cog-outline',to: { name: 'Admin', params: { id: 'QueueMonitoring' } },},
    //       {title:'Import Video', icon: 'mdi-cog-outline',to: { name: 'Admin', params: { id: 'ImportVideo' } },},
    //     ],
    //   },
    //   { title: 'Configuration', icon: 'mdi-cog-transfer' ,to: '/configuration',sub: false },
    //   { title: 'Report', icon: 'mdi-chart-areaspline',to: '/report' ,sub: true,
    //     admins: [
    //       { title : 'Create', icon: 'mdi-plus-outline',to: '/Report' },
    //       // { title : 'Read', icon: 'mdi-file-outline',to: '/Report' },
    //       // { title : 'Update', icon: 'mdi-update',to: '/Report' },
    //       // { title : 'Delete', icon: 'mdi-delete',to: '/Report' },
    //     ]
    //   },
    //   { title: 'Team', icon: 'mdi-microsoft-teams', to: '/team',sub: false },
    //   { title: 'About', icon: 'mdi-information' ,to: '/about', to_name: "About",sub: false },
    // ],  
  }),
  methods:{
    async fetchData(){
      const authStore = useAuthStore()
      const baseUrl = `${import.meta.env.VITE_API_URL}/getmenuassignedrole`
      const token = authStore.getToken
      try {
        if (token){
          const response = await axios.get(baseUrl, {
            headers: { 'Content-Type': 'application/json' },
            headers: {Authorization: `Bearer ${token}`}
          })
          if (response.status === 200 ) {
            console.log(response.data.data)
            // this.menu = response.data.data
            const filteredData = response.data.data.filter(item => item.pms_parent_id === null)
            this.menu = filteredData
          } else {
            // Failed login
          }
        }
      } catch (error) {
        console.log(error.response);
      }
    }
  },
  mounted(){
    this.fetchData()
  }
}
</script>
<style>

</style>
  
  
  
  
  