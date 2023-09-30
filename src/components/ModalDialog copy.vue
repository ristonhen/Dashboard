<template>
  <v-dialog v-model="dialogVisible" max-width="600px">
    <v-card>
      <v-card-title class="custom-card-title">{{ dialogTitle }}</v-card-title>
      <v-card-text>
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
          :disabled="hasValidationErrors"
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
      successMessageVisible: false
    }
  },
  watch: {
    formData: {
      handler() {
        this.clearValidationErrorOnValueChange();
      },
      deep: true
    },
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
    clearValidationErrorOnValueChange() {
      for (const fieldName in this.formData) {
        this.clearValidationError(fieldName);
      }
    },
    closeDialog() {
      const closeDialog = !this.toggleVisible
      this.$emit('closeDialog', closeDialog);

    
    },
    submitForm() {
      
      if (this.validateRequiredFields() && this.validateFields()) {
        this.clearWhitespaceForm()
        this.$emit('submit-form')
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
        } else {
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
    Simple_fieldData(){
    // formFields() {
    //   return [
    //     {
    //       name: 'fullname',
    //       component: 'v-text-field',
    //       label: 'Full Name',
    //       required: true,
    //       variant: "outlined",
    //       rules: [
    //         v => !!v || 'Full Name is required',
    //       ]
    //     },
    //     {
    //       name: 'email',
    //       component: 'v-text-field',
    //       label: 'User Name',
    //       required: true,
    //       variant: "outlined",
    //       rules: [
    //         v => !!v || 'User Name is required',
    //         v => /.+@.+\..+/.test(v) || 'User Name must be valid',
    //       ]
    //     },
    //     {
    //       name: 'branch_name',
    //       component: 'v-text-field',
    //       label: 'Branch name',
    //       required: true,
    //       variant: "outlined",
    //       rules: [
    //         v => !!v || 'Branch name is required',
    //       ]
    //     },
    //     {
    //       name: 'phone_number',
    //       component: 'v-text-field',
    //       label: 'Phone',
    //       required: true,
    //       variant: 'outlined',
    //       rules: [
    //         (v) => /^\d{10,11}$/.test(v) || 'Phone number must be 10 or 11 digits',
    //       ],
    //     },
    //     {
    //       name: 'rolename',
    //       component: 'v-text-field',
    //       label: 'Role Name',
    //       required: true,
    //       variant: "outlined",
    //       rules: [
    //         v => !!v || 'Role Name is required',
    //       ]
    //     },
    //     {
    //       name: 'Counter',
    //       component: 'v-text-field',
    //       label: 'Counter Number',
    //       required: true,
    //       variant: "outlined",
    //       rules: [
    //         v => !!v || 'Counter Number is required',
    //       ]
    //     },
    //     {
    //       name: 'country',
    //       component: 'v-select',
    //       label: 'Country',
    //       required: true,
    //       variant: 'outlined',
    //       items: ['USA', 'Canada', 'UK', 'Australia'], // Example list of countries
    //       rules: [
    //         v => !!v || 'Country is required',
    //       ],
    //     },
    //     {
    //       name: 'Status',
    //       component: 'v-radio-group',
    //       label: 'Status',
    //       required: true,
    //       variant: 'outlined',
    //       options: [
    //         { label: 'Active', value: 'true', defaultValue: true },
    //         { label: 'Inactive', value: 'false' },
    //       ],
    //       rules: [(value) => !!value || 'Role is required',],
    //     },
    //     {
    //       name: 'agree',
    //       component: 'v-checkbox',
    //       label: 'I agree to the terms and conditions',
    //       required: true,
    //       rules: [
    //         v => !!v || 'You must agree to the terms and conditions',
    //       ],
    //     },
    //     {
    //       name: 'country',
    //       component: 'v-combobox',
    //       label: 'Country',
    //       required: true,
    //       variant: 'outlined',
    //       items: ['USA', 'Canada', 'UK', 'Australia'], // Example list of countries
    //       rules: [
    //         v => !!v || 'Country is required',
    //       ],
    //     },
    //     {
    //       name: 'country',
    //       component: 'v-autocomplete',
    //       label: 'Country',
    //       required: true,
    //       variant: 'outlined',
    //       items: ['USA', 'Canada', 'UK', 'Australia'], // Example list of countries
    //       rules: [
    //         v => !!v || 'Country is required',
    //       ],
    //     },
        
    //   ];
    // },
    }
    
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
