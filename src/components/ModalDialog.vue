<template>
  <v-dialog v-model="dialogVisible" max-width="600px">
    <v-card>
      <v-card-title>{{ dialogTitle }}</v-card-title>
      <v-card-text>
        <v-row>
          <v-col v-for="(field, index) in formFields" :key="index" cols="6" sm="6">
            <component 
              :is="field.component" 
              v-model="formData[field.name]" 
              :label="field.label" 
              :required="field.required"
              :variant="field.variant"
              :rules="field.rules"
            ></component>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
      <v-btn color="primary" text @click="closeDialog">Cancel</v-btn>
        <v-btn color="primary" @click="submitForm" :disabled="hasValidationErrors">{{ dialogAction }}</v-btn> </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
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
      validationErrors: {}
    }
  },
  watch: {
    value(newValue) {
      this.dialogVisible = newValue
    },
    dialogVisible(newValue) {
      this.$emit('input', newValue)
    }
  },
  
  methods: {
    closeDialog() {
      this.dialogVisible = false
    },
    submitForm() {
      // Perform any form validation or processing here
      // Emit the form data to the parent component
      this.$emit('submit-form')
    },
    validateFields() {
      this.validationErrors = {};

      for (const field of this.formFields) {
        if (field.required && !this.formData[field.name]) {
          this.validationErrors[field.name] = 'This field is required.';
        } else if (
          field.rules &&
          field.rules.constructor === Array &&
          field.rules.length > 0
        ) {
          for (const rule of field.rules) {
            if (!rule.rule.test(this.formData[field.name])) {
              this.validationErrors[field.name] = rule.message;
              break;
            }
          }
        }
      }

      return Object.keys(this.validationErrors).length === 0;
    }
  },
  computed: {
    hasValidationErrors() {
      return Object.keys(this.validationErrors).length > 0;
    }
  }
}
</script>
<style>
/* .v-text-field .v-field {
    cursor: text;
    background-color: #efe9e9;
    border-radius: 50px !important;
    
} */

.v-input__details {
    min-height: 0px;
    padding-top: 0px;
}
</style>