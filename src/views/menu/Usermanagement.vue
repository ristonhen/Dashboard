<template>
  <v-card>
    <v-card-title class="d-flex justify-end align-center">
      <v-btn color="blue-grey-darken-3" @click="openDialog" icon>
        <v-icon>mdi-plus</v-icon>
      </v-btn>
      <v-sheet class="ps-1" v-if="selected.length > 0">
        <v-btn color="red-darken-4" icon @click="deleteItem()">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
        
      </v-sheet >
      <v-btn color="blue-grey-darken-3" @click="editItem()" icon v-if="selected.length ===1">
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
      <v-spacer></v-spacer>
      <v-text-field
          variant="solo"
          v-model="search"
          append-inner-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
          @click:append-inner="onClick"
          density="comfortable"
          class="custom-text-field pr-4"
        ></v-text-field>
    </v-card-title>
    <v-data-table
      v-model="selected"
      :headers="headers"
      :items="usersData"
      :search="search"
      show-select
      return-object
      items-per-page="15"
      class="elevation-1 custom-datatable"
      hover
    >
      <template v-slot:[`item.username`]="{ item }">
        <span>{{ item.username }}</span>
        <v-spacer></v-spacer>
        <v-icon size="small" class="me-2" @click="editItem(item)">
          mdi-pencil
        </v-icon>
        <v-icon size="small" color="error" @click="deleteItem(item)"> mdi-delete </v-icon>
      </template>

      <!-- <template v-slot:item="{ item }">
        <tr :class="{ 'row-hovered': hoveredRow === item }" @mouseover="hoveredRow = item" @mouseleave="hoveredRow = null">
          <template v-for="header in headers" :key="header.key">
            <td>
              {{ item[header.key] }}
            </td>
          </template>
          <td>
            <template v-if="hoveredRow === item">
              <v-btn icon small class="mr-2" @click="editItem(item)">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn icon small color="error" @click="deleteItem(item)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </template>
          </td>
        </tr>
      </template> -->
    </v-data-table>
    <ModalDialog
      v-model="dialogVisible"
      :toggleVisible="dialogVisible"
      :dialog-title="dialogTitle"
      :dialog-action="dialogAction"
      :form-data="newUsers"
      :form-fields="formFields"
      @closeDialog="closeDialog"
      @submit-form="submitForm"
    ></ModalDialog>
     <v-dialog 
        v-model="dialogDelete" 
        width="500"
        persistent
     >
      <v-card>
        <v-card-title class="text-h5">
          Delete users
        </v-card-title>
        <v-card-text>Are you sure you want to delete this item?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green-darken-1" variant="text" @click="dialogDelete = false" > Close </v-btn>
          <v-btn color="green-darken-1" variant="text" @click="deleteItemConfirm" >Ok</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>  
    <v-snackbar v-model="successMessageVisible" :timeout="1000" color="success" class="snackbar-bottom-right">
      Form {{messageText}} successfully.
    </v-snackbar>
  </v-card>
  <!-- <v-spacer></v-spacer> -->

</template>
<script>
import axios from 'axios'
import { useAuthStore } from '@/store/authStore'
import ModalDialog from '@/components/ModalDialog.vue'
const baseUrl = `${import.meta.env.VITE_API_URL}/users`
const authStore = useAuthStore()
export default {
  name: 'users',
  components:{ ModalDialog },
  data(){
    return {
      selected: [],
      dialogDelete: false,
      editedIndex: -1,
      dialogVisible: false,
      dialogAction: 'Add',
      search: '',
      headers: [
        { username: 'calories', title: 'username',key: 'username' },
        { fullname: 'calories', title: 'fullname',key: 'fullname' },
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
      branchData: [],
      roleData: [],
      usersData: [],
      newUsers: {
        fullname: '',
        username: '',
        email: '',
        password: '',
        branch_id: '',
        roleid: '',
        phone_number: '',
        description: '',
        branch_id: '',
        roleid: '',
      },
      successMessageVisible: false,
      messageText: '',
      hoveredRow: null,
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
          ]
        },
        {
          name: 'email',
          component: 'v-text-field',
          label: 'Email',
          required: true,
          variant: "outlined",
          rules: [
            v => !!v || 'User Name is required',
          ]
        },
        {
          name: 'branch_id',
          component: 'v-select',
          label: 'Branch name',
          required: true,
          variant: "outlined",
          items: this.branchData.map(branch => 
          (
            {
            value: branch.id,
            title: branch.branch_name
            }
          )
          // branch.branch_id
          ),
          rules: [
            v => !!v || 'Branch name is required',
          ]
        },
        {
          name: 'phone_number',
          component: 'v-text-field',
          label: 'Phone',
          required: false,
          variant: 'outlined',
          rules: [
            (v) => /^\d{1,11}$/.test(v) || 'Phone number must be 10 or 11 digits',
          ],
        },
        {
          name: 'roleid',
          component: 'v-select',
          label: 'Role Name',
          required: true,
          variant: 'outlined',
          items: this.roleData.map(role => 
          (
            {
            value: role.id,
            title: role.rolename
            }
          )
          ),
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
    dialogTitle(){
      return this.editedIndex === -1 ? 'Add users' : 'Edit users'
    },
  },
  methods:{
    handlerHover(value){
      console.log(value)
    },
    openDialog() {
      this.dialogVisible = true
    },
    closeDialog() {
      this.dialogVisible = false
      this.dialogAction = 'Add'
      this.formFields = {}
    },
    async getRole(){
      const authStore = useAuthStore();
      const baseUrl = `${import.meta.env.VITE_API_URL}/role`
      const token = await authStore.getToken
      
      try {
        const respone = await axios.get(baseUrl,{
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
        })
        
        if(respone.data.status == true){
          this.roleData = respone.data.data
          
          // console.log(this.branchData.map(branch => ({
          //   branch_id: branch.branch_id,
          //   branch_name: branch.branch_name
          // })))
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
        return null
      }

    },
    async getBranch(){
      const authStore = useAuthStore();
      const baseUrl = `${import.meta.env.VITE_API_URL}/branch`
      const token = await authStore.getToken
      try {
        const respone = await axios.get(baseUrl,{
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
        })
        if(respone.data.status == true){
          this.branchData = respone.data.data
          // console.log(this.branchData.map(branch => ({
          //   branch_id: branch.branch_id,
          //   branch_name: branch.branch_name
          // })))
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
        return null
      }

    },
    async getUsers(){
      
      const authStore = useAuthStore();
      const baseUrl = `${import.meta.env.VITE_API_URL}/users`
      const token = await authStore.getToken
      try {
        const respone = await axios.get(baseUrl,{
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
        })
        if(respone.data.status === true){
          this.usersData = respone.data.users
        }
      } catch (error) {
        console.error('Error fetching users data:', error)
      }
    },
    async addusers() {
      const baseUrl = `${import.meta.env.VITE_API_URL}/users`
      const authStore = useAuthStore()
      const token = authStore.getToken
      try {
        if (!this.newUsers.email.includes("@")) {
          this.newUsers.email += "@gmail.com";
        }
        // this.newUsers.email = this.newUsers.email + "@gmail.com"
        const response = await axios.post(baseUrl, this.newUsers, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })
        if(response.data.status === true){
          this.usersData.push( response.data.data )
          this.successMessageVisible = true
          this.messageText = 'Add'
        }
      } catch (error) {
        console.error('Error adding users :', error);
      }
    },
    
    deleteItem(item) {
      if(item){ this.selected = [item]}
      this.dialogDelete = true
    },
    async deleteItemConfirm(){
      let deleteIds = []
      if (this.selected.length > 0) {
        for (const selectedItem of this.selected) {
          deleteIds.push(selectedItem.id)
        }
      }
      // delete in database
      try {
        const response = await axios.delete(baseUrl, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authStore.getToken}`,
          },
          data: { ids: deleteIds },
        })
        if(response.data.status == true){
          // delete 1 row
          if(this.editedIndex !== -1){
            this.usersData.splice(this.editedIndex, 1)
            this.successMessageVisible = true
            this.messageText = 'Delete'
          }
          // delete more then row
          if (this.selected.length > 0) {
            for (const selectedItem of this.selected) {
              const index = this.usersData.indexOf(selectedItem);
              if (index !== -1) {
                this.usersData.splice(index, 1);
                this.successMessageVisible = true
                this.messageText = 'Delete'
              }
            }
            this.selected = [];
          }
        }
      } catch (error) {
        console.error('Error delete users:', error);
      }
      this.dialogDelete = false
    },
    editItem(item) {
      if( item ){
        this.selected = [item]
        this.newUsers = {...item}
        this.dialogAction = 'Edit';
        this.dialogVisible = true;
      }else if (this.selected.length === 1){
        this.editedIndex = this.usersData.indexOf(this.selected[0])
        this.newUsers = { ...this.selected[0] };
        this.dialogAction = 'Edit';
        this.dialogVisible = true;
      }
    },
    async updateusers() {
      const baseUrl = `${import.meta.env.VITE_API_URL}/users`;
      const authStore = useAuthStore();
      const token = authStore.getToken;
      try {
        const response = await axios.put(
          `${baseUrl}/${this.newUsers.id}`,
          this.newUsers,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response.data)
        if (response.data.status === true) {
          //Find the updated users in the usersData array
          
          const updatedusers = response.data.data;
          if (updatedusers) {
            const usersIndex = this.usersData.findIndex(
              (users) => users.id === updatedusers.id
            );
            if (usersIndex !== -1) {
              // Replace the users at the corresponding index with the response data
              this.usersData.splice(usersIndex, 1, updatedusers);
            }
          }
          this.selected = []
          this.closeDialog();
          this.successMessageVisible = true
          this.messageText = 'Update'
        }
      } catch (error) {
        console.error('Error updating users:', error);
      }
    },
    submitForm() {
      if (this.dialogAction === 'Add') {
        this.addusers()
      } else {
        this.updateusers()
      }
    },
  },
  mounted(){
    this.getUsers()
    this.getBranch()
    this.getRole()
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
  .custom-datatable tbody tr:hover {
    background-color: #f5f5f5ce; /* Set the desired background color */
    /* cursor: pointer; */
  }
  .selected-row {
    background-color: #e3f2fd !important; /* Set the desired selected background color */
  }

</style>