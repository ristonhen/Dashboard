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
      :items="branchData"
      :search="search"
      show-select
      return-object
      items-per-page="15"
      class="elevation-1 custom-datatable"
      hover
    >
      <template v-slot:[`item.branch_code`]="{ item }">
        <span>{{ item.branch_code }}</span>
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
      :form-data="newbranch"
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
          Delete branch
        </v-card-title>
        <v-card-text>Are you sure you want to delete this item?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green-darken-1" variant="text" @click="dialogDelete = false" > Close </v-btn>
          <v-btn color="green-darken-1" variant="text" @click="deleteItemConfirm" >Ok</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
  <!-- <v-spacer></v-spacer> -->
  <v-snackbar v-model="successMessageVisible" :timeout="1000" color="success" class="snackbar-bottom-right">
    Form {{messageText}} successfully.
  </v-snackbar>
</template>
<script>
import axios from 'axios'
import { useAuthStore } from '@/store/authStore'
import ModalDialog from '@/components/ModalDialog.vue'
const baseUrl = `${import.meta.env.VITE_API_URL}/branch`
const authStore = useAuthStore()
export default {
  name: 'branch',
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
        { branch_code: 'branch_code', title: 'branch_code',key: 'branch_code' },
        { branchcode: 'branch_name', title: 'branch_name',key: 'branch_name' },
        { range_ip: 'range_ip', title: 'range_ip' ,key: 'range_ip'},
        { created_by: 'created_by', title: 'created_by' ,key: 'created_by'},
        { created_date: 'created_date', title: 'created_date',key: 'created_date' },
        { modified_by: 'iron', title: 'modified_by',key: 'modified_by' },
        { modified_date: 'iron', title: 'modified_date',key: 'modified_date' },
        { company_id: 'company_id', title: 'company_id',key: 'company_id' },
        { opening_date: 'opening_date', title: 'opening_date',key: 'opening_date' },
        { tvticketip: 'tvticketip', title: 'tvticketip',key: 'tvticketip' },
      ],
      branchData: [],
      newbranch: {
        branchname: '',
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
          name: 'branch_code',
          component: 'v-text-field',
          label: 'Branch Code',
          required: true,
          variant: "outlined",
          rules: [
            v => !!v || 'Value is required',
           ]
        },
        {
          name: 'branch_name',
          component: 'v-text-field',
          label: 'Branch Name',
          required: true,
          variant: "outlined",
          rules: [
            v => !!v || 'Branch Name is required',
           ]
        },
        
        {
          name: 'range_ip',
          component: 'v-text-field',
          label: 'Range ip',
          required: true,
          variant: "outlined",
          rules: [
            v => !!v || 'Parameter Name is required',
           ]
        },
        {
          name: 'company_id',
          component: 'v-text-field',
          label: 'Company Name',
          required: true,
          variant: "outlined",
          rules: [
            v => !!v || 'Company Name is required',
           ]
        },
        {
          name: 'opening_date',
          component: 'v-text-field',
          label: 'Opening Date',
          required: true,
          variant: "outlined",
          rules: [
            v => !!v || 'Parameter Name is required',
           ]
        },
       
      ]
    },
    dialogTitle(){
      return this.editedIndex === -1 ? 'Add branch' : 'Edit branch'
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
    async getbranch(){
      const authStore = useAuthStore();
      const baseUrl = `${import.meta.env.VITE_API_URL}/branch`
      const token = await authStore.getToken
      try {
        const respone = await axios.get(baseUrl,{
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
        })
        if(respone.data.status === true){
          this.branchData = respone.data.data
        }
      } catch (error) {
        console.error('Error fetching branch data:', error)
      }
    },
    async addbranch() {
      const baseUrl = `${import.meta.env.VITE_API_URL}/branch`
      const authStore = useAuthStore()
      const token = authStore.getToken
      try {
        const response = await axios.post(baseUrl, this.newbranch, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })
        if(response.data.status === true){
          this.branchData.push( response.data.data )
          this.successMessageVisible = true
          this.messageText = 'Add'
        }
      } catch (error) {
        console.error('Error adding branch :', error);
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
            this.branchData.splice(this.editedIndex, 1)
            this.successMessageVisible = true
            this.messageText = 'Delete'
          }
          // delete more then row
          if (this.selected.length > 0) {
            for (const selectedItem of this.selected) {
              const index = this.branchData.indexOf(selectedItem);
              if (index !== -1) {
                this.branchData.splice(index, 1);
                this.successMessageVisible = true
                this.messageText = 'Delete'
              }
            }
            this.selected = [];
          }
        }
      } catch (error) {
        console.error('Error delete branch:', error);
      }
      this.dialogDelete = false
    },
    editItem(item) {
      if( item ){
        this.selected = [item]
        this.newbranch = {...item}
        this.dialogAction = 'Edit';
        this.dialogVisible = true;
      }else if (this.selected.length === 1){
        this.editedIndex = this.branchData.indexOf(this.selected[0])
        this.newbranch = { ...this.selected[0] };
        this.dialogAction = 'Edit';
        this.dialogVisible = true;
      }
    },
    async updatebranch() {
      const baseUrl = `${import.meta.env.VITE_API_URL}/branch`;
      const authStore = useAuthStore();
      const token = authStore.getToken;
      
      try {
        const response = await axios.put(
          `${baseUrl}/${this.newbranch.id}`,
          this.newbranch,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data.status === true) {
          //Find the updated branch in the branchData array
          
          const updatedbranch = response.data.data;
          if (updatedbranch) {
            const branchIndex = this.branchData.findIndex(
              (branch) => branch.id === updatedbranch.id
            );
            if (branchIndex !== -1) {
              // Replace the branch at the corresponding index with the response data
              this.branchData.splice(branchIndex, 1, updatedbranch);
            }
          }
          this.selected = []
          this.closeDialog();
          this.successMessageVisible = true
          this.messageText = 'Update'
        }
      } catch (error) {
        console.error('Error updating branch:', error);
      }
    },
    submitForm() {
      if (this.dialogAction === 'Add') {
        this.addbranch()
      } else {
        this.updatebranch()
      }
    },
  },
  mounted(){
    this.getbranch()
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