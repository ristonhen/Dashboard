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
      <!-- @click:append-inner="onClick" -->
      <v-text-field
          variant="solo"
          v-model="search"
          append-inner-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
          density="comfortable"
          class="custom-text-field pr-4"
        ></v-text-field>
    </v-card-title>
    <!-- @mouseover:row="handleMouseOver" -->
    <v-data-table
      v-model="selected"
      :headers="headers"
      :items="emailData"
      :search="search"
      show-select
      return-object
      items-per-page="15"
      class="elevation-1 custom-datatable"
      hover

    >
      <template v-slot:[`item.paramname`]="{ item }">
        <span>{{ item.paramname }}</span>
        <v-spacer></v-spacer>
        <v-icon size="small" class="me-2" @click="editItem(item)">
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
      :form-data="newMail"
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
          Delete Configuration
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
const baseUrl = `${import.meta.env.VITE_API_URL}/api/emaildata`
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
      dialogAction: 'Add',
      search: '',
      headers: [
        { align: 'start', key: 'id', sortable: false, title: 'NO'},
        { branchname: 'branchname', title: 'branchname',key: 'branchname' },
        { cc_email: 'email_to', title: 'email_to',key: 'email_to' },
        { created_by: 'cc_email', title: 'cc_email' ,key: 'cc_email'},
        { cc_email: 'pdfimage', title: 'pdfimage',key: 'pdfimage' },
        { cc_email: 'queue_number', title: 'queue_number',key: 'queue_number' },
        { created_date: 'created_date', title: 'created_date',key: 'created_date' },
        { modified_by: 'iron', title: 'modified_by',key: 'modified_by' },
        { modified_date: 'iron', title: 'modified_date',key: 'modified_date' },
      ],
      emailData: [],
      newMail: {
        branchname: 'Kampot11 branch',
        email_to: '',
        cc_email: '',
        pdfimage: 'Kamport Branch.pdf',
        queue_number: '3',
        created_date: "2024-02-28T14:02:18.940Z",
        created_by: "rijsjtosd"
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
          name: 'branchname',
          component: 'v-text-field',
          label: 'Branch Name',
          required: true,
          variant: "outlined",
          rules: [
            v => !!v || ' ',
          ]
        },
        {
          name: 'email_to',
          component: 'v-text-field',
          label: 'email_to',
          required: true,
          variant: "outlined",
          rules: [
            v => !!v || ' ',
          ]
        },
        {
          name: 'cc_email',
          component: 'v-text-field',
          label: 'cc_email',
          required: true,
          variant: "outlined",
          rules: [
            v => !!v || ' ',
            ]
        },
        {
          name: 'pdfimage',
          component: 'v-text-field',
          label: 'pdfimage',
          required: true,
          variant: "outlined",
          rules: [
            v => !!v || ' ',
          ]
        },
        {
          name: 'queue_number',
          component: 'v-text-field',
          label: 'queue_number',
          required: true,
          variant: "outlined",
          rules: [
            v => !!v || ' ',
          ]
        }
        
        
        
      ]
    },
    dialogTitle(){
      return this.editedIndex === -1 ? 'Add Configuration' : 'Edit Configuration'
    },
  },
  methods:{
    formatDataForDatabase(data) {
      // Clone the data to avoid modifying the original object
      const formattedData = {...data };

      // Extract email_to and cc_email data and format it
      formattedData.email_to = {
        recipient_list: formattedData.email_to,
      };
      formattedData.cc_email = {
        cc_recipient_list: formattedData.cc_email,
      };

      return [formattedData];
    },
    handlerHover(value){
      // console.log(value)
    },
    openDialog() {
      this.dialogVisible = true
    },
    closeDialog() {
      this.dialogVisible = false
      this.dialogAction = 'Add'
      this.formFields = {}
    },
    async getMaildata(){
      const authStore = useAuthStore();
      const baseUrl = `${import.meta.env.VITE_API_URL}/api/emaildata`
      const token = await authStore.getToken
      try {
        const respone = await axios.get(baseUrl,{
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`}
        })
        if(respone.data.status === 200 ){
          this.emailData = respone.data.data.emaildata
        }
      } catch (error) {
        console.error('Error fetching Configuration data:', error)
      }
    },
    async addMail() {
      const baseUrl = `${import.meta.env.VITE_API_URL}/api/emaildata`
      const authStore = useAuthStore()
      const token = authStore.getToken
      try {
        // Format the data before sending it to the API
        const formattedData = this.formatDataForDatabase(this.newMail);
        console.log(formattedData)
        const response = await axios.post(baseUrl, formattedData, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })
        console.log(response)
        if(response.data.status == 201){
          this.emailData.push( response.data.data )
          this.successMessageVisible = true
          this.messageText = 'Add'
        }
      } catch (error) {
        console.error('Error adding Configuration :', error);
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
            this.emailData.splice(this.editedIndex, 1)
            this.successMessageVisible = true
            this.messageText = 'Delete'
          }
          // delete more then row
          if (this.selected.length > 0) {
            for (const selectedItem of this.selected) {
              const index = this.emailData.indexOf(selectedItem);
              if (index !== -1) {
                this.emailData.splice(index, 1);
                this.successMessageVisible = true
                this.messageText = 'Delete'
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
    editItem(item) {
      if( item ){
        this.selected = [item]
        this.newMail = {...item}
        this.dialogAction = 'Save';
        this.dialogVisible = true;
      }else if (this.selected.length === 1){
        this.editedIndex = this.emailData.indexOf(this.selected[0])
        this.newMail = { ...this.selected[0] };
        this.dialogAction = 'Save';
        this.dialogVisible = true;
      }
    },
    async updateConfig() {
      const baseUrl = `${import.meta.env.VITE_API_URL}/api/emaildata`;
      const authStore = useAuthStore();
      const token = authStore.getToken;
      try {
        const response = await axios.put(
          `${baseUrl}/${this.newMail.id}`,
          this.newMail,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data.status === 'success') {
          //Find the updated configuration in the emailData array
          
          const updatedConfig = response.data.data;
          if (updatedConfig) {
            const configIndex = this.emailData.findIndex(
              (config) => config.id === updatedConfig.id
            );
            if (configIndex !== -1) {
              // Replace the configuration at the corresponding index with the response data
              this.emailData.splice(configIndex, 1, updatedConfig);
            }
          }
          this.selected = []
          this.closeDialog();
          this.successMessageVisible = true
          this.messageText = 'Update'
        }
      } catch (error) {
        console.error('Error updating Configuration:', error);
      }
    },
    submitForm() {
      if (this.dialogAction === 'Add') {
        this.addMail()
      } else {
        this.updateConfig()
      }
    },
  },
  mounted(){
    this.getMaildata()
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