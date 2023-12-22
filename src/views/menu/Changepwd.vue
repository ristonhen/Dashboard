<template>
  <div>
    <v-btn color="primary" @click="openDialog">Change Password</v-btn>
    <v-dialog v-model="dialogVisible" persistent max-width="450px" class="custom-dialog">
      <v-card>
        <v-card-title class="headline">Change Password</v-card-title>
        <v-card-text>
          <v-form @submit.prevent="changePassword" ref="changeForm">
            <v-text-field
              v-model="passwordData.currentassword"
              label="Password"
              placeholder="Password"
              prepend-inner-icon="mdi-key"
              :rules="currentasswordRules"
              variant="outlined"
              density="comfortable"
              :type="getFieldType('currentassword')"
              :append-inner-icon="getFieldIcon('currentassword')"
              @click:append-inner="togglePasswordVisibility('currentassword')"
              class="custom-text-field"
            ></v-text-field>
            <v-text-field
              v-model="passwordData.newpassword"
              label="New Password"
              placeholder="New Password"
              :rules="newpasswordRules"
              variant="outlined"
              density="comfortable"
              :type="getFieldType('newpassword')"
              :append-inner-icon="getFieldIcon('newpassword')"
              @click:append-inner="togglePasswordVisibility('newpassword')"
              class="custom-text-field"
            ></v-text-field>
            <v-text-field
              v-model="passwordData.confirmpassword"
              label="Confirm Password"
              placeholder="Confirm Password"
              :rules="confirmpasswordRules"
              variant="outlined"
              density="comfortable"
              :type="getFieldType('confirmpassword')"
              :append-inner-icon="getFieldIcon('confirmpassword')"
              @click:append-inner="togglePasswordVisibility('confirmpassword')"
              class="custom-text-field"
            ></v-text-field>
            <div v-if="passwordsNotMatch" class="error-message">
              Passwords do not match.
            </div>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="dialogVisible = false">Cancel</v-btn>
          <v-btn color="primary" @click="validatePasswordsAndChange">Change Password</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<style>
.v-dialog > .v-overlay__content > .v-card {

    border-radius: 8px;

    box-shadow: 0px 11px 15px -7px var(--v-shadow-key-umbra-opacity, rgba(0, 0, 0, 0.2)), 0px 24px 38px 3px var(--v-shadow-key-penumbra-opacity, rgba(0, 0, 0, 0.14)), 0px 9px 46px 8px var(--v-shadow-key-penumbra-opacity, rgba(0, 0, 0, 0.12));
}
</style>

<script>
import axios from 'axios'
import { useAuthStore } from '@/stores/authStore'
export default {
  data() {
    return {
      dialogVisible: false,
      passwordData: {
        username: '',
        currentassword: '',
        newpassword: '',
        confirmpassword: ''
      },
      passwordShow: {
        currentassword: false,
        newpassword: false,
        confirmpassword: false
      },
      currentasswordRules: [
        (value) => !!value || 'Current password is required',
      ],
      newpasswordRules: [
        (value) => !!value || 'New password is required',
        (value) => value && value.length >= 6 || 'New password must be at least 6 characters long',
      ],
      confirmpasswordRules: [
        (value) => !!value || 'Confirm password is required',
        (value) => value === this.passwordData.newpassword || 'Passwords do not match',
      ],
    };
  },
  methods: {
    openDialog() {
      this.dialogVisible = true;
    },
    togglePasswordVisibility(field) {
      this.passwordShow[field] = !this.passwordShow[field];
    },
    
    getFieldType(field) {
      return this.passwordShow[field] ? 'text' : 'password';
    },
    getFieldIcon(field) {
      return this.passwordShow[field] ? 'mdi-eye' : 'mdi-eye-off';
    },
    resetForm() {
      this.passwordData.currentassword = '';
      this.passwordData.newpassword = '';
      this.passwordData.confirmpassword = '';
    },
    validatePasswordsAndChange() {
      if (this.$refs.changeForm.validate()) {
        if (this.passwordData.newpassword !== this.passwordData.confirmpassword) {
          this.showPasswordsNotMatchError();
        } else {
          this.changePassword();
        }
      }
    },
    showPasswordsNotMatchError() {
      // Show an error alert or perform any other action to indicate the password mismatch
      alert('Passwords do not match. Please try again.');
    },
    async changePassword(){
      const baseUrl = `${import.meta.env.VITE_API_URL}/changepwd`
      const authStore = useAuthStore()
      const token = authStore.getToken
      try {
        const username = authStore.getUser
        this.passwordData.username = username.email
        const response = await axios.put(
          baseUrl,
          this.passwordData,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data.status === true) {
          this.$refs.changeForm.reset();
          this.dialogVisible = false;
        }
      } catch (error) {
        // console.error('Error updating password error:', error);
        if (error.response) {
          const errorMessage = error.response.data.detail;
          // console.error('Error updating password:', errorMessage);
          alert('Error updating password:', error.response.data.detail)
        }else if (error.request) {
          // The request was made but no response was received
          // console.error('No response received:', error.request);
          alert('No response received:', error.request)
          
        } else {
          // Something happened in setting up the request that triggered an error
          // console.error('Error:', error.message)
          alert('Error:', error.message)
        }
      }
    },
  },
  
};
</script>

