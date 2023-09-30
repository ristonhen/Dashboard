<template>
  <v-card>
    <v-card-title class="d-flex justify-end align-center">
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
      <v-btn color="blue-grey-darken-3" @click="openDialog" icon>
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </v-card-title>
    <v-data-table
      :headers="headers"
      :items="users"
      :search="search"
      class="elevation-1 custom-datatable"
    >
    </v-data-table>
    <ModalDialog
      v-model="dialogVisible"
      :toggleVisible="dialogVisible"
      :dialog-title="dialogTitle"
      :dialog-action="dialogAction"
      :form-data="newUser"
      :form-fields="formFields"
      @closeDialog="closeDialog"
      @submit-form="addUser"
    ></ModalDialog>
  </v-card>
  <!-- Display the entered user data -->
<v-card v-if="enteredUserData">
  <v-card-title class="headline">Entered User Data</v-card-title>
  <v-card-text>
    <pre>{{ JSON.stringify(enteredUserData, null, 2) }}</pre>
  </v-card-text>
</v-card>
</template>

<script>
import axios from 'axios'
import { useAuthStore } from '@/store/authStore'
import ModalDialog from '@/components/ModalDialog.vue'
export default {
  name: 'Usermanagement',
  components:{ ModalDialog },
  data(){
    return {
      enteredUserData: null,
      dialogVisible: false,
      dialogTitle: 'ADD USER',
      dialogAction: 'Add',
       search: '',
        headers: [
          { align: 'start', key: 'user_id', sortable: false, title: 'ID'},
          { fullname: 'calories', title: 'fullname',key: 'fullname' },
          { username: 'calories', title: 'username',key: 'username' },
          { email: 'fat', title: 'Email' ,key: 'email'},
          { branch_name: 'carbs', title: 'Branch Name',key: 'branch_name' },
          { rolename: 'protein', title: 'Role Name',key: 'rolename' },
          { created_by: 'iron', title: 'created_by',key: 'created_by' },
          { created_date: 'iron', title: 'created_date',key: 'created_date' },
          { modified_by: 'iron', title: 'modified_by',key: 'modified_by' },
          { modified_date: 'iron', title: 'modified_date',key: 'modified_date' },
          { last_pwd_modified_date: 'iron', title: 'last_pwd_modified_date',key: 'last_pwd_modified_date' },
          { deviceid: 'iron', title: 'deviceid',key: 'deviceid' },
          { phone_number: 'iron', title: 'phone_number',key: 'phone_number' },
        ],
      users: [],
      newUser: {
        fullname: '',
        username: '',
        email: '',
        password: '',
        branch_id: '',
        roleid: '',
        phone_number: '',
        description: '',
        branch_id: '1',
        roleid: '2',
        
      }
    }
  },
  computed: {
    formFields() {
      return [
        {
          name: 'fullname',
          component: 'v-text-field',
          label: 'Full Name',
          required: true,
          variant: "outlined",
          rules: [
            v => !!v || 'Full Name is required',
            v => !/[!@#$%^&*(),.?":{}|<>]/.test(v) || 'User Name cannot contain special characters',
            v => !/(drop|delete|alter|select|insert|update)/i.test(v) || 'User Name cannot contain forbidden keywords',
          ]
        },
        {
          name: 'username',
          component: 'v-text-field',
          label: 'User Name',
          required: true,
          variant: "outlined",
          rules: [
            v => !!v || 'User Name is required',
            v => !/[!@#$%^&*(),.?":{}|<>]/.test(v) || 'User Name cannot contain special characters',
            v => !/(drop|delete|alter|select|insert|update)/i.test(v) || 'User Name cannot contain forbidden keywords',
          ]
        },
        {
          name: 'email',
          component: 'v-text-field',
          label: 'User Name',
          required: true,
          variant: "outlined",
          rules: [
            v => !!v || 'User Name is required',
            v => /^\s*$/.test(v) || /^[\w.]+$/.test(v) || 'User Name can only contain letters (a-z, A-Z), numbers, and a single period (.)',
            v => (v && v.indexOf('.') === v.lastIndexOf('.')) || 'User Name can only contain a single period (.)',
            v => !/(drop|delete|alter|select|insert|update)/i.test(v) || 'User Name cannot contain forbidden keywords',
          ]
        },
        {
          name: 'branch_name',
          component: 'v-select',
          label: 'Branch name',
          required: true,
          variant: "outlined",
          items: ['Administrator', 'Super Administrator', 'Supervisor', 'Counter','Supervisor HO','Reporter'],
          rules: [
            v => !!v || 'Branch name is required',
          ]
        },
        {
          name: 'phone_number',
          component: 'v-text-field',
          label: 'Phone',
          required: true,
          variant: 'outlined',
          rules: [
            (v) => /^\d{1,11}$/.test(v) || 'Phone number must be 10 or 11 digits',
          ],
        },
        {
          name: 'rolename',
          component: 'v-select',
          label: 'Role Name',
          required: true,
          variant: 'outlined',
          items: ['Administrator', 'Super Administrator', 'Supervisor', 'Counter','Supervisor HO','Reporter'],
          rules: [
            v => !!v || 'Role Name is required',
          ],
        },
        {
          name: 'Counter',
          component: 'v-text-field',
          label: 'Counter Number',
          required: true,
          variant: "outlined",
          rules: [
            v => !!v || 'Counter Number is required',
            v => /^\d{1,10}$/.test(v) || 'Counter Number must be a valid number',
          ]
        },
      ];
    },
  },
  methods:{
    async getUser(){
      const authStore = useAuthStore();
      const baseUrl = `${import.meta.env.VITE_API_URL}/users`
      const token = await authStore.getToken
      try {
        const respone = await axios.get(baseUrl,{
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
        })
        if(respone.data.status === true){
          this.users = respone.data.users
          // console.log(this.users)
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
      }
    },
    openDialog() {
      this.dialogVisible = true;
      console.log(this.dialogVisible)
    },
    closeDialog() {
      this.dialogVisible = false;
      this.formFields = {}
    },
    async addUser() {
      const baseUrl = `${import.meta.env.VITE_API_URL}/users`
      const authStore = useAuthStore()
      const token = authStore.getToken

      try {
        this.newUser.email = this.newUser.email + "@gmail.com"
        const response = await axios.post(baseUrl, this.newUser, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })
        // const modified_by = authStore.getUser.email
        if(response.status == 201){
          // this.users.push({ ...this.newUser })
          // this.users.push({ ...this.newUser })
          this.users.push( response.data )
          this.enteredUserData = response.data
        }
      } catch (error) {
        console.error('Error adding user:', error);
      }
      
    },
  },
  mounted(){
    this.getUser()
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