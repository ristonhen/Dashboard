<template>
  <v-dialog v-model="dialogVisible" persistent max-width="600px">

    <div
      @dragenter.prevent="toggleActive"
      @dragleave.prevent="toggleActive"
      @dragover.prevent
      @drop.prevent="toggleActive"
      :class="{ 'active-dropzone': active }"
      class="dropzone"
    >
      <span>Drag or Drop File</span>
      <span>OR</span>
      <label for="dropzoneFile">Select File</label>
      <input type="file" id="dropzoneFile" class="dropzoneFile" />
    </div>

    <v-card
      @drop.prevent="onDrop($event)"
      @dragover.prevent="dragover = true"
      @dragenter.prevent="dragover = true"
      @dragleave.prevent="dragover = false"
      :class="{ 'grey lighten-2': dragover }"
      
    >
      <v-card-text >
        <v-row class="d-flex flex-column" dense align="center" justify="center" >
          <v-icon :class="[dragover ? 'mt-2, mb-6' : 'mt-5']" size="60">
            mdi-cloud-upload
          </v-icon>
          <p>
            Drop your file(s) here, or click to select them.
          </p>
        </v-row>
        <v-virtual-scroll
          v-if="uploadedFiles.length > 0"
          :items="uploadedFiles"
          height="150"
          item-height="50"
        >
          <!-- <template v-slot:default="{ item }">
            <v-list-item :key="item.name">
              <v-list-item-content>
                <v-list-item-title>
                  {{ item.name }}
                  <span class="ml-3 text--secondary">
                    {{ item.size }} bytes</span
                  >
                </v-list-item-title>
              </v-list-item-content>

              <v-list-item-action>
                <v-btn @click.stop="removeFile(item.name)" icon>
                  <v-icon> mdi-close-circle </v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>

            <v-divider></v-divider>
          </template> -->
        </v-virtual-scroll>
      </v-card-text>
      <v-card-actions> 
        <v-spacer></v-spacer>
        <v-btn
          variant="flat"
          color="indigo"
          @click="closeUploadDialog"
        ><v-icon id="close-button">mdi-close</v-icon></v-btn>
        <v-btn
          variant="flat"
          color="indigo"
          @click="submitForm"
        ><v-icon id="upload-button">mdi-upload</v-icon></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { ref } from "vue";
export default {
  name: "Upload",
  props: {
    toggleUploadVisible: {
      type: Boolean,
      required: true
    },
    multiple: {
      type: Boolean,
      default: false
    }
  },
  data(){
    return{
      dialogVisible: false,
      dragover: false,
      uploadedFiles: []
    }
  },
  setup() {
    const active = ref(false);

    const toggleActive = () => {
      active.value = !active.value;
    };

    return { active, toggleActive };
  },
  methods:{
    closeUploadDialog(){
      this.uploadedFiles = [];
      const closeUploadDialog = !this.toggleUploadVisible
      this.$emit('closeUploadDialog', closeUploadDialog)
    },

    removeFile(fileName) {
      const index = this.uploadedFiles.findIndex(
        file => file.name === fileName
      );
      // If file is in uploaded files remove it
      if (index > -1) this.uploadedFiles.splice(index, 1);
    },
    
    onDrop(e){
      this.dragover = false

      // Check if there are already uploaded files
      if (this.uploadedFiles.length > 0) this.uploadedFiles = [];

      if(!this.multiple && e.dataTransfer.files.length > 1){
        this.$store.dispatch("addNotification", {
          message: "Only one file can be uploaded at a time..",
          colour: "error"
        });
      }else{
        e.dataTransfer.files.forEach(element =>
          this.uploadedFiles.push(element)
        );
      }
    },

    submitForm() {
      if (this.validate() && this.validateRequiredFields()) {
        this.$emit('submit-form')
        this.closeUploadDialog()
      } else {
        // console.log("There are validation errors. Display a button or perform an action.");
      }
    },
  },
  
  
};
</script>

<style scoped lang="scss">
.dropzone {
  width: 400px;
  height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  row-gap: 16px;
  border: 2px dashed #41b883;
  background-color: #fff;
  transition: 0.3s ease all;

  label {
    padding: 8px 12px;
    color: #fff;
    background-color: #41b883;
    transition: 0.3s ease all;
  }

  input {
    display: none;
  }
}

.active-dropzone {
  color: #fff;
  border-color: #fff;
  background-color: #41b883;

  label {
    background-color: #fff;
    color: #41b883;
  }
}
</style>