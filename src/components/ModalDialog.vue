<template>
  <v-dialog v-model="dialogVisible" max-width="600px" >
    <v-card>
      <v-card-title class="bg-blue-grey-darken-2">{{ dialogTitle }}</v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-row>
            <v-col v-for="(field, index) in formFields" :key="index" cols="6" sm="6">
              <template v-if="field.component === 'v-radio-group'">
                <v-radio-group v-model="formData[field.name]" :label="field.label || field.name" :required="field.required" inline>
                  <v-radio
                    v-for="(option, optionIndex) in field.options"
                    :key="optionIndex"
                    :label="option.label"
                    :value="option.value"
                    color="info"
                    :error-messages="validationErrors[field.name]"
                    @input="clearValidationError(field.name)"
                  ></v-radio>
                </v-radio-group>
              </template>
              <template v-else-if="field.component === 'v-select'">
                <v-select
                  v-model="formData[field.name]"
                  :label="field.label"
                  :items="field.items"
                  :item-title="field.items.title"
                  :item-value="field.items.value"
                  :required="field.required"
                  :variant="field.variant"
                  :rules="field.rules"
                  density="comfortable"
                ></v-select>
              </template>
              <template v-else-if="field.component === 'v-combobox'">
                <v-combobox
                  v-model="formData[field.name]"
                  :label="field.label"
                  :items="field.items"
                  :required="field.required"
                  :variant="field.variant"
                  :rules="field.rules"
                  :error-messages="validationErrors[field.name]"
                  density="comfortable"
                  @input="clearValidationError(field.name)"
                ></v-combobox>
              </template>
              <template v-else-if="field.component === 'v-checkbox'">
                <v-checkbox
                  v-model="formData[field.name]"
                  :label="field.label"
                  :required="field.required"
                  :rules="field.rules"
                  density="comfortable"
                  :error-messages="validationErrors[field.name]"
                  @input="clearValidationError(field.name)"
                ></v-checkbox>
              </template>
              <template v-else-if="field.component === 'v-autocomplete'">
                <v-autocomplete
                  v-model="formData[field.name]"
                  :label="field.label"
                  :items="field.items"
                  :required="field.required"
                  :variant="field.variant"
                  :rules="field.rules"
                  density="comfortable"
                  :error-messages="validationErrors[field.name]"
                  @input="clearValidationError(field.name)"
                ></v-autocomplete>
              </template>
              <template v-else-if="field.component === 'v-text-field'">
                <component
                  :is="field.component"
                  v-model="formData[field.name]"
                  :label="field.label"
                  :required="field.required"
                  :variant="field.variant"
                  :rules="field.rules"
                  density="comfortable"
                  :error-messages="validationErrors[field.name]"
                  @input="clearValidationError(field.name)"
                ></component>
              </template>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          size="large"
          class="cancel-button"
          color="grey-lighten-5" 
          @click="closeDialog"
        >X</v-btn>
        <v-btn
          variant="outlined"
          color="blue-grey-darken-3"  
          @click="submitForm"
        >{{ dialogAction }}</v-btn>
      </v-card-actions>
    </v-card>
    <v-snackbar v-model="successMessageVisible" :timeout="1000" color="success">Form submitted successfully.</v-snackbar>
  </v-dialog>
  
</template>
<script>
export default {
  name: 'Modaldialog',
  props: {
    toggleVisible: {
      type: String,
      required: true
    },
    value: {
      type: Boolean,
      required: true
    },
    dialogTitle: {
      type: String,
      required: true
    },
    dialogAction: {
      type: String,
      required: true
    },
    formFields: {
      type: Array,
      required: true
    },
    formData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      dialogVisible: false,
      validationErrors: {},
      successMessageVisible: false,
      selectedBranch: null,
      branchData: [
        {
          value: 1,
          text: "TNM KP"
        },
        {
          value: 2,
          text: "TNM KPS"
        },
        // Add the remaining objects as per your data
      ]
    }
  },
  watch: {
    value(newValue) {
      this.dialogVisible = newValue
      if (newValue) {
      // Set radio values when the dialog opens
      this.setRadioValues();
    }
    },
    dialogVisible(newValue) {
      this.$emit('input', newValue)
    },
    successMessageVisible(newValue) {
      if (newValue) {
        setTimeout(() => {
          this.successMessageVisible = false;
        }, 5000); 
      }
    }
  },
  methods: {
    async validate() {
      const { valid } = await this.$refs.form.validate()
      // if (valid) alert('Form is valid')
    },
    reset() {
      this.$refs.form.reset()
    },
    resetValidation() {
      this.$refs.form.resetValidation()
    },
    closeDialog() {
      this.resetValidation()
      this.reset()
      const closeDialog = !this.toggleVisible
      this.$emit('closeDialog', closeDialog)
      this.validationErrors  =  {}
      
    },
    submitForm() {
      if (this.validate() && this.validateRequiredFields()) {
        
        // this.clearWhitespaceForm()
        this.$emit('submit-form')
        this.closeDialog()
        this.successMessageVisible = true;
      } else {
        // console.log("There are validation errors. Display a button or perform an action.");
      }
    },
    validateRequiredFields() {
      for (const field of this.formFields) {
        if (field.required && !this.formData[field.name]) {
          this.validationErrors[field.name] = `${field.label} field is required.`
        }else if (field.component === "v-select" && this.formData[field.name]) {
          delete this.validationErrors[field.name]
        }else {
          delete this.validationErrors[field.name]
        }
      }
      return Object.keys(this.validationErrors).length === 0;
    },
    setRadioValues() {
      for (const field of this.formFields) {
        if (field.component === 'v-radio-group') {
          // Check if the radio value exists in options
          if (field.options.some(option => option.value === this.formData[field.name])) {
            return; // Value already exists, no need to update
          }
          // Set the first option as active/checked if none is selected
          const firstOption = field.options[0];
          if (!this.formData[field.name] && firstOption) {
            this.formData[field.name] = firstOption.value;
          }
        }
      }
    },
    clearValidationError(fieldName) {
      delete this.validationErrors[fieldName];
      
    },
    clearWhitespaceForm(){
      for (const field of this.formFields) {
        if (field.component) {
          if (typeof this.formData[field.name] === 'string') {
            this.formData[field.name] = this.formData[field.name].trim(); // Trim whitespace
          }
        }
      }
    },
  },
  computed: {
    hasValidationErrors() {
      return Object.keys(this.validationErrors).length > 0;
    },
  },
}
</script>
<style>
.cancel-button {
  position: absolute;
  top: 0px;
  right: 0px;
}
</style>
