<template>
  <div>
    <v-btn color="primary" @click="openDialog">Open Password Reset</v-btn>

    <v-dialog v-model="dialogVisible" persistent max-width="500px" class="custom-dialog">
      <v-card>
        <v-card-title class="headline">Password Reset</v-card-title>
        <v-card-text>
          <v-form @submit.prevent="resetPassword" ref="resetForm">
            <v-text-field
              v-model="email"
              label="Email"
              required
              outlined
            ></v-text-field>
            <v-text-field
              v-model="newPassword"
              label="New Password"
              type="password"
              required
              outlined
            ></v-text-field>
            <v-text-field
              v-model="confirmPassword"
              label="Confirm Password"
              type="password"
              required
              outlined
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="dialogVisible = false">Cancel</v-btn>
          <v-btn color="primary" @click="resetPassword">Reset Password</v-btn>
          <v-btn @click="resetForm">Reset Form</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<style>
.custom-dialog .v-dialog {
  border-radius: 10px;
}
</style>

<script>
export default {
  data() {
    return {
      dialogVisible: false,
      email: '',
      newPassword: '',
      confirmPassword: '',
    };
  },
  methods: {
    openDialog() {
      this.dialogVisible = true;
      this.resetForm();
    },
    resetPassword() {
      // Perform password reset logic here
      // Access the form data using this.email, this.newPassword, this.confirmPassword
      // Reset the form after successful password reset
      this.$refs.resetForm.reset();
      this.dialogVisible = false;
    },
    resetForm() {
      // Reset the form fields
      this.email = '';
      this.newPassword = '';
      this.confirmPassword = '';
    },
  },
};
</script>