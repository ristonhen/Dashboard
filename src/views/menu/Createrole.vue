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
      :items="roleData"
      :search="search"
      show-select
      return-object
      items-per-page="15"
      class="elevation-1 custom-datatable"
      hover
      @mouseover:row="handleMouseOver"
    >
      <template v-slot:[`item.rolename`]="{ item }">
        <span>{{ item.rolename }}</span>
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
      :form-data="newrole"
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
          Delete role
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
</template>
<script>
import axios from 'axios'
import { useAuthStore } from '@/stores/authStore'
import ModalDialog from '@/components/ModalDialog.vue'
const baseUrl = `${import.meta.env.VITE_API_URL}/role`
const authStore = useAuthStore()
export default {
  name: 'role',
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
        // { align: 'start', key: 'id', sortable: false, title: 'NO'},
        { rolename: 'rolename', title: 'rolename',key: 'rolename' },
        { rolecode: 'rolecode', title: 'rolecode',key: 'rolecode' },
        { created_by: 'created_by', title: 'created_by' ,key: 'created_by'},
        { created_date: 'created_date', title: 'created_date',key: 'created_date' },
        { modified_by: 'iron', title: 'modified_by',key: 'modified_by' },
        { modified_date: 'iron', title: 'modified_date',key: 'modified_date' },
      ],
      roleData: [],
      newrole: {
        rolename: '',
        value: '',
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
          name: 'rolecode',
          component: 'v-text-field',
          label: 'Role Code',
          required: true,
          variant: "outlined",
          rules: [
            v => !!v || 'Value is required',
           ]
        },
        {
          name: 'rolename',
          component: 'v-text-field',
          label: 'Role Name',
          required: true,
          variant: "outlined",
          rules: [
            v => !!v || 'Parameter Name is required',
           ]
        },
       
      ]
    },
    dialogTitle(){
      return this.editedIndex === -1 ? 'Add role' : 'Edit role'
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
    async getrole(){
      const authStore = useAuthStore();
      const baseUrl = `${import.meta.env.VITE_API_URL}/role`
      const token = await authStore.getToken
      try {
        const respone = await axios.get(baseUrl,{
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
        })
        if(respone.data.status === true){
          this.roleData = respone.data.data
        }
      } catch (error) {
        console.error('Error fetching role data:', error)
      }
    },
    async addrole() {
      const baseUrl = `${import.meta.env.VITE_API_URL}/role`
      const authStore = useAuthStore()
      const token = authStore.getToken
      try {
        const response = await axios.post(baseUrl, this.newrole, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })
        if(response.status == 201){
          this.roleData.push( response.data.data )
          this.successMessageVisible = true
          this.messageText = 'Add'
        }
      } catch (error) {
        console.error('Error adding role :', error);
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
          console.log(selectedItem)
        }
      }
      console.log(deleteIds)
      // delete in database
      try {
        const response = await axios.delete(baseUrl, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authStore.getToken}`,
          },
          data: { roleid: deleteIds },
        })
        if(response.data.status == true){
          // delete 1 row
          if(this.editedIndex !== -1){
            this.roleData.splice(this.editedIndex, 1)
            this.successMessageVisible = true
            this.messageText = 'Delete'
          }
          // delete more then row
          if (this.selected.length > 0) {
            for (const selectedItem of this.selected) {
              const index = this.roleData.indexOf(selectedItem);
              if (index !== -1) {
                this.roleData.splice(index, 1);
                this.successMessageVisible = true
                this.messageText = 'Delete'
              }
            }
            this.selected = [];
          }
        }
      } catch (error) {
        console.error('Error delete role:', error);
      }
      this.dialogDelete = false
    },
    editItem(item) {
      if( item ){
        this.selected = [item]
        this.newrole = {...item}
        this.dialogAction = 'Edit';
        this.dialogVisible = true;
      }else if (this.selected.length === 1){
        this.editedIndex = this.roleData.indexOf(this.selected[0])
        this.newrole = { ...this.selected[0] };
        this.dialogAction = 'Edit';
        this.dialogVisible = true;
      }
    },
    async updaterole() {
      const baseUrl = `${import.meta.env.VITE_API_URL}/role`;
      const authStore = useAuthStore();
      const token = authStore.getToken;
      try {
        const response = await axios.put(
          `${baseUrl}/${this.newrole.id}`,
          this.newrole,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data.status === 'success') {
          //Find the updated role in the roleData array
          
          const updatedrole = response.data.data;
          if (updatedrole) {
            const roleIndex = this.roleData.findIndex(
              (role) => role.id === updatedrole.id
            );
            if (roleIndex !== -1) {
              // Replace the role at the corresponding index with the response data
              this.roleData.splice(roleIndex, 1, updatedrole);
            }
          }
          this.selected = []
          this.closeDialog();
          this.successMessageVisible = true
          this.messageText = 'Update'
        }
      } catch (error) {
        console.error('Error updating role:', error);
      }
    },
    submitForm() {
      if (this.dialogAction === 'Add') {
        this.addrole()
      } else {
        this.updaterole()
      }
    },
  },
  mounted(){
    this.getrole()
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