<template>
  <v-card>
    <v-card-title class="d-flex justify-end align-center">
      <v-btn color="blue-grey-darken-3" @click="openDialog" icon>
        <v-icon>mdi-email-plus</v-icon>
      </v-btn>
      <v-sheet class="ps-1" v-if="selected.length > 0">
        <v-btn color="red-darken-4" icon @click="deleteItem()">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </v-sheet >
      <v-btn  class="px-1"  color="blue-grey-darken-3" @click="editItem()" icon v-if="selected.length ===1">
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
      <v-btn color="blue-grey-darken-3" @click="sentMailRiewUser()" icon v-if="selected.length > 0">
        <v-icon>mdi-email-arrow-right</v-icon>
      </v-btn>
      <v-spacer></v-spacer>


      <v-btn color="blue-grey-darken-3" @click="openUploadDialog " icon>
        <v-icon>mdi-import</v-icon>
      </v-btn>
      <Upload 
        v-model="uploadDialog"
        @submitFiles="handleSubmittedFiles"
        :toggleUploadVisible="dialogVisible"
        @closeUploadDialog="closeUploadDialog"
      />
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
          Delete Mail
        </v-card-title>
        <v-card-text>Are you sure you want to delete this item?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green-darken-1" variant="text" @click="dialogDelete = false" > Close </v-btn>
          <v-btn color="green-darken-1" variant="text" @click="deleteItemConfirm" >Ok</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="dialog"
      max-width="320"
      persistent
    >
      <v-list
        class="py-2"
        color="primary"
        elevation="12"
        rounded="lg"
      >
        <v-list-item
          prepend-icon="$vuetify-outline"
          title="Processing Application..."
        >
          <template v-slot:prepend>
            <div class="pe-4">
              <v-icon color="primary" size="x-large"></v-icon>
            </div>
          </template>

          <template v-slot:append>
            <v-progress-circular
              color="primary"
              indeterminate="disable-shrink"
              size="16"
              width="2"
            ></v-progress-circular>
          </template>
        </v-list-item>
      </v-list>
    </v-dialog>
    <v-snackbar v-model="successMessageVisible" :timeout="1500" color="success" class="snackbar-bottom-right">
      Form {{messageText}} successfully.
    </v-snackbar>
  </v-card>
</template>
<script>

import { ref } from "vue";
import * as XLSX from "xlsx";

import axios from 'axios'
import { useAuthStore } from '@/stores/authStore'
import ModalDialog from '@/components/ModalDialog.vue'
import Upload from '@/components/Utilities/Upload.vue'
const baseUrl = `${import.meta.env.VITE_API_URL}/api/emaildata`
const authStore = useAuthStore()
export default {
  name: 'Mail',
  components:{ ModalDialog , Upload },
  data(){
    return {
      dialog: false,
      selected: [],
      dialogDelete: false,
      editedIndex: -1,
      dialogVisible: false,
      dialogAction: 'Add',
      uploadDialog:false,
      search: '',
      headers: [
        { align: 'start', key: 'id', sortable: false, title: 'NO'},
        { branchname: 'branchname', title: 'branchname',key: 'branchname' },
        { email_to: 'email_to', title: 'email_to',key: 'email_to' },
        { cc_email: 'cc_email', title: 'cc_email',key: 'cc_email' },
        { pdfimage: 'pdfimage', title: 'pdfimage',key: 'pdfimage' },
        { queue_number: 'queue_number', title: 'queue_number',key: 'queue_number' },
        { created_date: 'created_date', title: 'created_date',key: 'created_date' },
        { created_by: 'created_by', title: 'created_by' ,key: 'created_by'},
        { modified_date: 'iron', title: 'modified_date',key: 'modified_date' },
        { modified_by: 'iron', title: 'modified_by',key: 'modified_by' },
      ],
      emailData: [],
      newMail: {
        branchname: '',
        email_to: '',
        cc_email: '',
        pdfimage: '',
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
      return this.editedIndex === -1 ? 'Add Mail' : 'Edit Mail'
    },
  },
  methods:{
    formatDataForDatabase(data) {
      const formattedData = {...data };
      formattedData.email_to = {
        recipient_list: formattedData.email_to.split(","),
      };
      formattedData.cc_email = {
        cc_recipient_list: formattedData.cc_email.split(","),
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

    openUploadDialog() {
      this.uploadDialog = true    
    },
    closeUploadDialog() {
      this.uploadDialog = false
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
        console.error('Error fetching Mail data:', error)
      }
    },
    async addMail() {
      const baseUrl = `${import.meta.env.VITE_API_URL}/api/emaildata`
      const authStore = useAuthStore()
      const token = authStore.getToken

      const formatData = (data) => {
        const formattedData = { ...data };
        formattedData.email_to = {
          recipient_list: formattedData.email_to.split(","),
        };
        formattedData.cc_email = {
          cc_recipient_list: formattedData.cc_email.split(","),
        }

        return [formattedData]
      }
      try {
        // Format the data before sending it to the API
        const formattedData = formatData(this.newMail)
        const response = await axios.post(baseUrl, formattedData, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })
        if(response.data.status == 201){
          this.emailData.unshift(response.data.data.emaildata[0])
          this.successMessageVisible = true
          this.messageText = 'Add'
        }else{
          console.log(response.data.message)
        }
      } catch (error) {
        console.error('Error adding Mail :', error);
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

        if(response.data.status === 200 ){
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

        const selectedrow = this.selected[0]
        const email_to = selectedrow.email_to.recipient_list.join(', ')
        const cc_email= selectedrow.cc_email.cc_recipient_list.join(', ')

        this.newMail = { ...this.selected[0] }
        this.newMail.email_to = email_to
        this.newMail.cc_email = cc_email
       
        this.dialogAction = 'Save';
        this.dialogVisible = true;
      }
    },
    async updateConfig() {
      const baseUrl = `${import.meta.env.VITE_API_URL}/api/emaildata`;
      const authStore = useAuthStore();
      const token = authStore.getToken;
      const dataUpdate = { ...this.newMail }
      dataUpdate.email_to = {
        recipient_list: dataUpdate.email_to.split(","),
      }
      dataUpdate.cc_email = {
        cc_recipient_list: dataUpdate.cc_email.split(","),
      }
      try {
        const response = await axios.put(
          `${baseUrl}/${this.newMail.id}`,
          dataUpdate,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data.status === 200) {
          //Find the updated Mail in the emailData array
          
          const updatedMail = response.data.data.emaildata;
          console.log(updatedMail)
          if (updatedMail) {
            const configIndex = this.emailData.findIndex((config) => config.id === updatedMail.id);
            if (configIndex !== -1) {
              // Replace the Mail at the corresponding index with the response data
              this.emailData.splice(configIndex, 1, updatedMail);
            }
          }
          this.selected = []
          this.closeDialog();
          this.successMessageVisible = true
          this.messageText = 'Update'
        }
      } catch (error) {
        console.error('Error updating Mail:', error);
      }
    },
    submitForm() {
      if (this.dialogAction === 'Add') {
        this.addMail()
      } else {
        this.updateConfig()
      }
    },
    async sentMailRiewUser(){ 
      this.dialog = true   
      const selectedrow = this.selected
      const baseUrl = `${import.meta.env.VITE_API_URL}/api/amlreview/`
      const authStore = useAuthStore()
      const token = authStore.getToken

      const sentMail = {
        email_data: selectedrow.map(item => ({
          branchname: item.branchname,
          email_to: item.email_to.recipient_list,
          cc_email: item.cc_email.cc_recipient_list,
          pdfimage: item.pdfimage
        }))
      };
      try {
        const response = await axios.post(baseUrl, sentMail, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })
        if(response.data.status == 200){
          setTimeout(() => {
            this.dialog = false
            this.selected = []
            this.successMessageVisible = true
            this.messageText = 'Sent'
          }, 4000)
          
        }else{
          console.log(response.data.message)
        }
      } catch (error) {
        console.error('Error adding Mail :', error);
      }

    },
    handleSubmittedFiles(files) {
    if (files.length > 0) {
      const file = files[0];
      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        if (jsonData.length > 1) {
          const formattedData = jsonData.slice(1).map((row) => {
            const formattedRow = {
              branchname: row[0],
              email_to: {
                recipient_list: row[1].split(","),
              },
              cc_email: {
                cc_recipient_list: row[2].split(","),
              },
              pdfimage: row[3],
              queue_number: row[4].toString(),
              created_date: new Date(),
              created_by: "ristonhen",
            };
            return formattedRow;
          });
          const authStore = useAuthStore();
          const token = authStore.getToken;
          try {
            const postData = async () => {
              const response = await axios.post(baseUrl, formattedData, {
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`,
                },
              })
              if(response.data.status == 201){
                const importedEmailData = response.data.data.emaildata;
                importedEmailData.forEach((email) => {
                  this.emailData.unshift(email);
                })
                this.successMessageVisible = true
                this.messageText = 'Import'
              }else{
                console.log(response.data.message)
             }
              // console.log('Data import successfully:', response.data.data);
            };
            postData();
          } catch (error) {
            console.error('Error inserting data:', error);
          }
        }
      };
      fileReader.readAsArrayBuffer(file);
    }
  }
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