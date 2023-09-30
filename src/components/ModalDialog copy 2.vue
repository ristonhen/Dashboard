<template>
  <v-dialog v-model="dialogVisible" max-width="600px">
    
    <v-card>
      <v-card-title class="custom-card-title">{{ dialogTitle }}</v-card-title>
      <v-card-text>
        <!-- start test -->
        <v-sheet width="300" class="mx-auto">
          <v-form ref="form">
            <v-text-field
              v-model="name"
              :counter="10"
              :rules="nameRules"
              label="Name"
              required
            ></v-text-field>

            <v-select
              v-model="select"
              :items="items"
              :rules="[v => !!v || 'Item is required']"
              label="Item"
              required
            ></v-select>

            <v-checkbox
              v-model="checkbox"
              :rules="[v => !!v || 'You must agree to continue!']"
              label="Do you agree?"
              required
            ></v-checkbox>

            <div class="d-flex flex-column">
              <v-btn color="success" class="mt-4" block @click="validate">
                Validate
              </v-btn>

              <v-btn color="error" class="mt-4" block @click="reset">
                Reset Form
              </v-btn>

              <v-btn color="warning" class="mt-4" block @click="resetValidation">
                Reset Validation
              </v-btn>
            </div>
          </v-form>
        </v-sheet>
        <!-- test End -->
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
                :required="field.required"
                :variant="field.variant"
                :rules="field.rules"
                :error-messages="validationErrors[field.name]"
                @change="clearValidationError(field.name)"
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
                @input="clearValidationError(field.name)"
              ></v-combobox>
            </template>
            <template v-else-if="field.component === 'v-checkbox'">
              <v-checkbox
                v-model="formData[field.name]"
                :label="field.label"
                :required="field.required"
                :rules="field.rules"
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
                :error-messages="validationErrors[field.name]"
                @input="clearValidationError(field.name)"
              ></component>
            </template>
          </v-col>
        </v-row>
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
    <v-snackbar v-model="successMessageVisible" :timeout="10000" color="success">Form submitted successfully.</v-snackbar>
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
      ex7: 'red',
      ex8: 'primary',
      dialogVisible: false,
      validationErrors: {},
      successMessageVisible: false,
      name: '',
      nameRules: [
        v => !!v || 'Name is required',
        v => (v && v.length <= 10) || 'Name must be less than 10 characters',
      ],
      select: null,
      items: ['Item 1', 'Item 2', 'Item 3', 'Item 4'],
      checkbox: false,
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

        if (valid) alert('Form is valid')
      },
      reset() {
        this.$refs.form.reset()
      },
      resetValidation() {
        this.$refs.form.resetValidation()
      },

    
    closeDialog() {
      const closeDialog = !this.toggleVisible
      this.$emit('closeDialog', closeDialog);

      this.resetForm()
      // for (const field of this.formFields) {
      //   this.formData[field.name] = null // Reset each form field individually
      // }
    },
    submitForm() {
      
      if (this.validateRequiredFields() && this.validateFields()) {
        this.clearWhitespaceForm()
        this.$emit('submit-form')
        this.resetForm()
        this.closeDialog()
        this.successMessageVisible = true;
      } else {
        console.log("There are validation errors. Display a button or perform an action.");
      }
    },
    validateRequiredFields() {
      for (const field of this.formFields) {
        if (field.required && !this.formData[field.name]) {
          this.validationErrors[field.name] = "This field is required."
        }else if (field.component === "v-select" && this.formData[field.name]) {
          delete this.validationErrors[field.name]
        }else {
          delete this.validationErrors[field.name]
        }
      }
      return Object.keys(this.validationErrors).length === 0;
    },
    validateFields() {
      for (const field of this.formFields) {
        for (const rule of field.rules) {
          const validation = rule(this.formData[field.name]);
          if (typeof validation === 'string') {
            this.validationErrors[field.name] = validation;
            return false; // Return false if any rule fails
          }
          
        }
      }
      return true; // Return true if all rules pass
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
    resetForm() {
      this.validationErrors = {}
    },
    clearWhitespaceForm(){
      for (const field of this.formFields) {
        if (field.component === 'v-text-field') {
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
.custom-card-title {
  background-color: rgb(7, 10, 171);
  color: white;
}
</style>
