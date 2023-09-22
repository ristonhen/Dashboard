<template>
  <v-card>
    <v-card-title class="d-flex justify-end align-center">
      <!-- <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
      ></v-text-field> -->
      <v-text-field
          :loading="loading"
          variant="solo"
          v-model="search"
          append-inner-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
          @click:append-inner="onClick"
          class="custom-text-field "
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
      :dialog-title="dialogTitle"
      :dialog-action="dialogAction"
      :form-data="newUser"
      :form-fields="formFields"
      @submit-form="addUser"
    ></ModalDialog>
  </v-card>
</template>

<script>
import axios from 'axios'
import { useAuthStore } from '@/store/authStore'
import ModalDialog from '@/components/ModalDialog.vue'
export default {
  components:{ ModalDialog },
  data(){
    return {
      dialogVisible: false,
      dialogTitle: 'Add User',
      dialogAction: 'Add',
       search: '',
        headers: [
          { align: 'start', key: 'user_id', sortable: false, title: 'ID'},
          { fullname: 'calories', title: 'fullname',key: 'fullname' },
          { email: 'fat', title: 'Email' ,key: 'email'},
          { branch_name: 'carbs', title: 'Branch Name',key: 'branch_name' },
          { rolename: 'protein', title: 'Role Name',key: 'rolename' },
          { created_by: 'iron', title: 'created_by',key: 'created_by' },
          { created_date: 'iron', title: 'created_date',key: 'created_date' },
          { modified_by: 'iron', title: 'modified_by',key: 'modified_by' },
          { last_pwd_modified_date: 'iron', title: 'last_pwd_modified_date',key: 'last_pwd_modified_date' },
          { deviceid: 'iron', title: 'deviceid',key: 'deviceid' },
          { phone_number: 'iron', title: 'phone_number',key: 'phone_number' },
        ],
      users: [],
      newUser: {
        fullname: '',
        email: '',
        branch_name: '',
        rolename: '',
        created_by: '',
        created_date: '',
        modified_by: '',
        last_pwd_modified_date: '',
        deviceid: '',
        phone_number: ''
      }
    }
  },
  computed: {
    formFields() {
      // Define your dynamic form fields here
      return [
        { name: 'fullname', component: 'v-text-field', label: 'Full Name', required: true,variant:"outlined" ,rules:[
      v => !!v || 'E-mail is required',
      v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
    ]},
        { name: 'email', component: 'v-text-field', label: 'User Name', required: true, variant:"outlined" },
        { name: 'branch_name', component: 'v-text-field', label: 'Branch name', required: true,variant:"outlined" },
        { name: 'phone_number', component: 'v-text-field', label: 'Phone', required: true, variant:"outlined" },
        { name: 'rolename', component: 'v-text-field', label: 'Role Name', required: true,variant:"outlined" },
        { name: 'Counter', component: 'v-text-field', label: 'Counter Number', required: true,variant:"outlined" },
        // Add more dynamic form fields as needed
      ]
    }
  },
  methods:{
    async getUser(){
      const authStore = useAuthStore();
      const baseUrl = `${import.meta.env.VITE_API_URL}/users`;
      const token = await authStore.getToken
      try {
        const respone = await axios.get(baseUrl,{
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
        })
        if(respone.data.status === true){
          this.users = respone.data.users
          console.log(this.users)
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
    },

    addUser() {

      // Concatenate the email field with "@gmail.com"
      this.newUser.email = this.newUser.email + "@gmail.com"

      // Add logic to handle adding a new user
      // Access the values entered in the form using this.newUser
      // Perform necessary operations (e.g., API request, database update) to add the new user
      // After successful addition, update the users list and close the dialog
      this.users.push(this.newUser); // Example: Adding the new user to the users list
      this.dialogVisible = false; // Closing the dialog
      // Reset the newUser object for the next addition
      this.newUser = {
        fullname: '',
        email: '',
        branch_name: '',
        rolename: '',
        created_by: '',
        created_date: '',
        modified_by: '',
        last_pwd_modified_date: '',
        deviceid: '',
        phone_number: ''
      }
    },
    openEditDialog(user) {
      // Set the dialog title and action for editing
      this.dialogTitle = 'Edit User'
      this.dialogAction = 'Update'

      // Set the form data to the selected user
      this.newUser = { ...user }

      // Show the dialog
      this.dialogVisible = true
    },







    initialize() {
        this.desserts = [
          {
            username: 'admin',
            fullname: 'Administrator',
            role: 'Administrator',
            counters: 24,
            branch: 'Head Office',
            glutenfree: false,
          },
          {
            username: 'k.seyha',
            fullname: 'Kim Seyha',
            role: 'Administrator',
            counters: 37,
            branch: 'Head Office',
            glutenfree: false,
          },
          {
            username: 'm.theret',
            fullname: 'Muon Tharet',
            role: 'Administrator',
            counters: 37,
            branch: 'Head Office',
            glutenfree: false,
          },
          {
            username: 's.bunseang',
            fullname: 'San Bunseang',
            role: 'Administrator',
            counters: 37,
            branch: 'Head Office',
            glutenfree: false,
          },
          {
            username: 's.sihado',
            fullname: 'Som Sihado',
            role: 'Administrator',
            counters: 37,
            branch: 'Head Office',
            glutenfree: false,
          },
          {
            username: 'n.risto',
            fullname: 'Nhen Risto',
            role: 'Administrator',
            counters: 37,
            branch: 'Head Office',
            glutenfree: false,
          },
          {
            username: 'o.sokun',
            fullname: 'Ouk Sokun',
            role: 'Administrator',
            counters: 37,
            branch: 'Head Office',
            glutenfree: false,
          },
          {
            username: 's.sengty',
            fullname: 'Seang Sengty',
            role: 'Administrator',
            counters: 37,
            branch: 'Head Office',
            glutenfree: false,
          },

        ]
      },

      editItem(item) {
        this.editedIndex = this.desserts.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },

      deleteItem(item) {
        this.editedIndex = this.desserts.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialogDelete = true
      },

      deleteItemConfirm() {
        this.desserts.splice(this.editedIndex, 1)
        this.closeDelete()
      },

      close() {
        this.dialog = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },

      closeDelete() {
        this.dialogDelete = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },

      save() {
        if (this.editedIndex > -1) {
          Object.assign(this.desserts[this.editedIndex], this.editedItem)
        } else {
          this.desserts.push(this.editedItem)
        }
        this.close()
      },
      getColor (calories) {
        if (calories > 400) return 'red'
        else if (calories > 200) return 'orange'
        else return 'green'
      },

  },
  mounted(){
    this.getUser()
  }
  
}
</script>

<style>
  .v-enter-active,
  .v-leave-active {
    transition: transform 0.3s;
  }

  .v-enter,
  .v-leave-to {
    transform: translateY(-1%);
  }

  .v-enter-to,
  .v-leave {
    transform: translateY(-100%);
  }

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