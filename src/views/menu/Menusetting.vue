<template>
  <v-card>
    <v-card-title class="d-flex justify-end align-center">
      <v-btn color="blue-grey-darken-3" @click="openDialog" icon>
        <v-icon>mdi-plus</v-icon>
      </v-btn>
      <v-spacer></v-spacer>
      <v-text-field
          :loading="loading"
          variant="solo"
          v-model="search"
          append-inner-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
          @click:append-inner="onClick"
          class="custom-text-field pr-4"
        ></v-text-field>
      
    </v-card-title>
    <v-data-table
      :headers="headers"
      :items="menus"
      :search="search"
      class="elevation-1 custom-datatable"
    >
    </v-data-table>
    <ModalDialog
      v-model="dialogVisible"
      :toggleVisible="dialogVisible"
      :dialog-title="dialogTitle"
      :dialog-action="dialogAction"
      :form-data="newMenu"
      :form-fields="formFields"
      @closeDialog="closeDialog"
      @submit-form="addMenu"
    ></ModalDialog>
  </v-card>
  <!-- Display the entered user data -->
<!-- <v-card v-if="enteredUserData">
  <v-card-title class="headline">Entered User Data</v-card-title>
  <v-card-text>
    <pre>{{ JSON.stringify(enteredUserData, null, 2) }}</pre>
  </v-card-text>
</v-card> -->
</template>

<script>
import axios from 'axios'
import { useAuthStore } from '@/stores/authStore'
import ModalDialog from '@/components/ModalDialog.vue'
export default {
  name: 'Usermanagement',
  components:{ ModalDialog },
  data(){
    return {
      branchData: [],
      roleData: [],
      enteredUserData: null,
      dialogVisible: false,
      dialogTitle: 'ADD USER',
      dialogAction: 'Add',
      messsage: null,
       search: '',
        headers: [
          { align: 'start', key: 'user_id', sortable: false, title: 'NO',key: 'id'},
          { menuname: 'menuname', title: 'Menu Name',key: 'pms_menu_name' },
          { levle: 'levle', title: 'Level',key: 'pms_menu_level' },
          { parentmenu: 'parentmenu', title: 'Parent Menu' ,key: 'pms_parent_id'},
          { pagename: 'pagename', title: 'Page Namee',key: 'to_name' },
          { menutype: 'menutype', title: 'Menu Type',key: 'pms_menu_type' },
          { menuindex: 'menuindex', title: 'Index',key: 'pms_menu_index' },
          { menuimage: 'menuimage', title: 'Menu Image',key: 'pms_menu_image' },
          { created_by: 'created_by', title: 'Created By',key: 'created_by' },
          { created_date: 'created_date', title: 'Created Date',key: 'created_date' },
          { modified_by: 'modified_by', title: 'Modified By',key: 'modified_by' },
          { modified_date: 'modified_date', title: 'Modified Date',key: 'modified_date' },
        ],
      menus: [],
      newMenu: {
        pms_menu_name: '',
        pms_menu_level: '',
        pms_parent_id: '',
        to_name: '',
        pms_menu_type: '',
        pms_menu_index: '',
        pms_menu_image: '',  
      }
    }
  },
  computed: {
    formFields() {
      return [
        {
          name: 'pms_menu_name',
          component: 'v-text-field',
          label: 'Menu Name',
          required: true,
          variant: "outlined",
          rules: [
            v => !!v || 'Menu Name is required',
          ]
        },
        {
          name: 'pms_menu_level',
          component: 'v-text-field',
          label: 'Menu Level',
          required: true,
          variant: "outlined",
          rules: [
            v => !!v || 'Level is required',
          ]
        },
        {
          name: 'pms_parent_id',
          component: 'v-text-field',
          label: 'Parent ID',
          required: true,
          variant: "outlined",
          rules: [
            v => !!v || 'Parent ID is required',
          ]
        },
        {
          name: 'to_name',
          component: 'v-text-field',
          label: 'Page Name',
          required: true,
          variant: 'outlined',
          rules: [
            v => !!v || 'Page name is required',
          ],
        },
        {
          name: 'pms_menu_type',
          component: 'v-text-field',
          label: 'Menu Type',
          required: true,
          variant: "outlined",
          rules: [
            v => !!v || 'Menu Type is required',
          ]
        },
        {
          name: 'pms_menu_image',
          component: 'v-text-field',
          label: 'Menu Icon',
          required: true,
          variant: 'outlined',
          rules: [
            v => !!v || 'Menu index is required',
          ],
        },
        {
          name: 'pms_menu_index',
          component: 'v-text-field',
          label: 'Menu Inex',
          required: true,
          variant: 'outlined',
          rules: [
            v => !!v || 'Level is required',
          ],
        },
        
      ];
    },
  },
  methods:{
    
    async getMenu(){
      const authStore = useAuthStore();
      const baseUrl = `${import.meta.env.VITE_API_URL}/menu`
      const token = await authStore.getToken
      try {
        const respone = await axios.get(baseUrl,{
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
        })
        if(respone.data.status === true){
          this.menus = respone.data.data
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
      }
    },
    openDialog() {
      this.dialogVisible = true;
    },
    closeDialog() {
      this.dialogVisible = false;
      this.formFields = {}
    },
    async addMenu() {
      const baseUrl = `${import.meta.env.VITE_API_URL}/menu`
      const authStore = useAuthStore()
      const token = authStore.getToken
      try {
        const response = await axios.post(baseUrl, this.newMenu, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })
        if(response.status == 201){
          this.menus.push( response.data )

        }
        // this.enteredUserData = { ...this.newMenu }
      } catch (error) {
        console.error('Error adding menu:', error);
      }
    },
  },
  mounted(){
    this.getMenu()
  }
  
}
</script>

<style>

  .custom-datatable {
    font-size: 13px;
  }
  .custom-datatable .v-data-table-header th {
    font-size: 16px;
  }
  .custom-text-field {
    min-width: 300px;
    max-width: 400px;
    border-radius: 50px !important;
  }
</style>