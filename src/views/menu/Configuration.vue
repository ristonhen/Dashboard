<template>
  <v-card>
    <v-card-title class="d-flex justify-end align-center">
      <v-btn color="blue-grey-darken-3" @click="openDialog" icon>
        <v-icon>mdi-plus</v-icon>
      </v-btn>
      <v-sheet class="ps-1" v-if="selected.length > 1">
        <v-btn color="red-darken-4" icon @click="deleteItem">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </v-sheet>
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
          density="comfortable"
          class="custom-text-field pr-4"
        ></v-text-field>
    </v-card-title>
    <v-data-table
      v-model="selected"
      :headers="headers"
      :items="desserts"
      :search="search"
      show-select
      return-object
      items-per-page="15"
      class="elevation-1 custom-datatable"
    >
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon size="small" class="me-2" @click="editItem()">
          mdi-pencil
        </v-icon>
        <v-icon size="small" color="error" @click="deleteItem(item)"> mdi-delete </v-icon>
      </template>
    </v-data-table>
    <ModalDialog
      v-model="dialogVisible"
      :toggleVisible="dialogVisible"
      :dialog-title="dialogTitle"
      :dialog-action="dialogAction"
      :form-data="newConfig"
      :form-fields="formFields"
      @closeDialog="closeDialog"
      @submit-form="addConfig"
    ></ModalDialog>
     <v-dialog 
        v-model="dialogDelete" 
        width="500"
        persistent
     >
      <v-card>
        <v-card-title class="text-h5">
          Delete Configuration
        </v-card-title>
        <v-card-text>Are you sure you want to delete this item?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green-darken-1" variant="text" @click="dialogDelete = false" > Cancel </v-btn>
          <v-btn color="green-darken-1" variant="text" @click="deleteItemConfirm" >Ok</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
  <v-spacer></v-spacer>
  <v-snackbar v-model="successMessageVisible" :timeout="100000" color="success" class="snackbar-bottom-right">Form submitted successfully.</v-snackbar>
  
</template>
<script>
import axios from 'axios'
import { useAuthStore } from '@/store/authStore'
import ModalDialog from '@/components/ModalDialog.vue'
const baseUrl = `${import.meta.env.VITE_API_URL}/configuration`
const authStore = useAuthStore()
export default {
  name: 'Configuration',
  components:{ ModalDialog },
  data(){
    return {
      selected: [],
      dialogDelete: false,
      editedIndex: -1,
      dialogVisible: false,
      // dialogTitle: 'ADD USER',
      dialogAction: 'Add',
      messsage: null,
      search: '',
      headers: [
        { align: 'start', key: 'id', sortable: false, title: 'NO'},
        { paramname: 'paramname', title: 'paramname',key: 'paramname' },
        { value: 'value', title: 'value',key: 'value' },
        { created_by: 'created_by', title: 'created_by' ,key: 'created_by'},
        { created_date: 'created_date', title: 'created_date',key: 'created_date' },
        { modified_by: 'iron', title: 'modified_by',key: 'modified_by' },
        { modified_date: 'iron', title: 'modified_date',key: 'modified_date' },
        { title: 'Actions', key: 'actions', sortable: false },

      ],
      desserts: [],
      newConfig: {
        paramname: '',
        value: '',
      },
      successMessageVisible: true,
    }
  },
  computed: {
    formFields() {
      return [
        {
          name: 'paramname',
          component: 'v-text-field',
          label: 'Parameter Name',
          required: true,
          variant: "outlined",
          rules: [
            v => !!v || 'Parameter Name is required',
           ]
        },
       {
          name: 'value',
          component: 'v-text-field',
          label: 'Value',
          required: true,
          variant: "outlined",
          rules: [
            v => !!v || 'Value is required',
           ]
        },
      ]
    },
    dialogTitle(){
      return this.editedIndex === -1 ? 'Add Configuration' : 'Edit Configuration'
    },
    loading: function() {
      return false; // Assuming loading state is not used in the code provided
    },
  },
  methods:{
    async getConfiguration(){
      const authStore = useAuthStore();
      const baseUrl = `${import.meta.env.VITE_API_URL}/configuration`
      const token = await authStore.getToken
      try {
        const respone = await axios.get(baseUrl,{
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
        })
        if(respone.data.status === true){
          this.desserts = respone.data.data
        }
      } catch (error) {
        console.error('Error fetching Configuration data:', error)
      }
    },
    async addConfig() {
      const baseUrl = `${import.meta.env.VITE_API_URL}/configuration`
      const authStore = useAuthStore()
      const token = authStore.getToken
      try {
        const response = await axios.post(baseUrl, this.newConfig, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })
        if(response.status == 201){
          this.desserts.push( response.data.data )
        }
      } catch (error) {
        console.error('Error adding Configuration :', error);
      }
    },
    openDialog() {
      this.dialogVisible = true;
    },
    closeDialog() {
      this.dialogVisible = false;
      this.formFields = {}
    },
    deleteItem(item) {
      this.editedIndex = this.desserts.indexOf(item)  //Get Index from ID json data from table
      this.dialogDelete = true
    },
    async deleteItemConfirm() {
      let deleteIds = []
      if(this.editedIndex !== -1){
        const deletedRow = this.desserts[this.editedIndex]
        deleteIds.push(deletedRow.id)
        this.selected = []
      }else {
        if (this.selected.length > 0) {
          for (const selectedItem of this.selected) {
            deleteIds.push(selectedItem.id)
          }
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
          console.log(response.data.messsage)
          // delete 1 row
          if(this.editedIndex !== -1){
            this.desserts.splice(this.editedIndex, 1)
          }
          // delete more then row
          if (this.selected.length > 0) {
            for (const selectedItem of this.selected) {
              const index = this.desserts.indexOf(selectedItem);
              if (index !== -1) {
                this.desserts.splice(index, 1);
              }
            }
            this.selected = [];
          }
        }
      } catch (error) {
        console.error('Error delete config:', error);
      }
      this.dialogDelete = false
    },
  },
  mounted(){
    this.getConfiguration()
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
  .snackbar-bottom-right {
  position: absolute;
  bottom: 16px;
  right: 16px;
}
</style>