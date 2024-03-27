<template>
  <v-dialog v-model="dialogVisible" persistent max-width="600px">
    <v-card>
      <v-card-text
        @dragenter.prevent="toggleActive"
        @dragleave.prevent="toggleActive"
        @dragover.prevent
        @drop.prevent="handleFileDrop"
        :class="{ 'active-dropzone': active }"
        class="dropzone"
      >
        <v-row class="d-flex flex-column" dense align="center" justify="center">
          <v-icon :class="[dragover ? 'mt-2 mb-6' : 'mt-5']" size="60">
            mdi-cloud-upload
          </v-icon>
          <p>
            Drop & Drop to Upload file
          </p>
          <span>OR</span>
          <label for="dropzoneFile">Select File</label>
          <input ref="test"  type="file" id="dropzoneFile" class="dropzoneFile" accept=".xls, .xlsx, .csv" @change="handleFileSelect" />
          <div v-if="uploadedFiles.length>0" class="file-info-container">
            <v-card class="file-info-card">
              <v-card-text>
                <p>File Name: {{ uploadedFiles[0].name }}</p>
                <p>File Size: {{ uploadedFiles[0].size }} bytes</p>
              </v-card-text>
              <v-card-actions>
                <v-btn icon @click="removeFile">
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </div>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn variant="flat" color="indigo" @click="closeUploadDialog">CANCEL</v-btn>
        <v-btn variant="flat" color="indigo" @click="submitForm">Save</v-btn>
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
    },
    dropzoneFile: {
      type: String,
      required: false
    },
  },
  data() {
    return {
      dialogVisible: false,
      dragover: false,
      uploadedFiles: [],
    };
  },
  setup(){
    const active = ref(false);

    const toggleActive = () => {
      active.value = !active.value;
    };

    return { active, toggleActive };
  },
  methods: {
    handleFileSelect(event) {
      const file = event.target.files[0];
      if (file) {
        this.uploadedFiles.push(file)

      } else {
        this.uploadedFiles = [];
      }
    },
    handleFileDrop(event) {
      this.toggleActive();
      const file = event.dataTransfer.files[0];
      if (file) {
        this.uploadedFiles.push(file)
      } else {
        this.uploadedFiles = [];
      }
    },
    removeFile() {
      this.uploadedFiles = [];
    },
    closeUploadDialog() {
      this.uploadedFiles = [];
      const closeUploadDialog = !this.toggleUploadVisible;
      this.$emit("closeUploadDialog", closeUploadDialog);
    },
    submitForm() {
      if(this.uploadedFiles){
        this.$emit('submitFiles', this.uploadedFiles)
        this.closeUploadDialog()
      }
    },
  },
};
</script>

<style scoped lang="scss">
.dropzone {
  margin: 25px;
  border-radius: 7px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  row-gap: 16px;
  border: 2px dashed #3c4642;
  transition: 0.3s ease all;

  label {
    border-radius: 7px;
    padding: 8px 12px;
    margin: 10px;
    cursor: pointer;
    color: #fff;
    background-color: #404e48;
    transition: 0.3s ease all;
  }

  input {
    display: none;
  }
}

.active-dropzone {
  color: #fff;
  border-color: #fff;
  background-color: #686d6a;

  label {
    background-color: #fff;
    color: #41b883;
  }
}

.file-info-container {
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  margin-top: 10px;
  padding: 10px;
}

.file-info-card {
  display: flex;
}

.file-info-card .v-card-actions {
  margin-left: auto;
}
</style>