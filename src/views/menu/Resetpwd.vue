<template>
  <v-app>
    <div class="backgruond"></div>
    <div v-if="changeNewPassword">
      <v-dialog v-model="openDialog" persistent max-width="450px" class="custom-dialog">
        <v-card>
          <v-card-title class="headline">Reset Password</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="" ref="changeForm">
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
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="validatePasswordsAndChange">Reset Password</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
    <div v-else-if="success">
      <v-dialog v-model="openDialog" persistent max-width="450px" class="custom-dialog" >
      <v-card>
          <v-card-title class="headline">Reset Password</v-card-title>
          <v-card-text>
            <p>Reset password verification successful</p>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="resetPassword()">
              <router-link to="/" class="text-decoration-none">Back to Home</router-link>
            </v-btn>
          </v-card-actions>
        </v-card>
    </v-dialog>
    </div>
    <div v-else>
      <v-dialog v-model="openDialog" persistent max-width="450px" class="custom-dialog" >
      <v-card>
          <v-card-title class="headline">Token Expire</v-card-title>
          <v-card-text>
            <p>Invalided Token expire</p>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="resetPassword()">
              <router-link to="/" class="text-decoration-none">Back to Home</router-link>
            </v-btn>
          </v-card-actions>
        </v-card>
    </v-dialog>
    </div>
  </v-app>
</template>
<style>
.v-dialog > .v-overlay__content > .v-card {
  border-radius: 8px;
  box-shadow: 0px 11px 15px -7px var(--v-shadow-key-umbra-opacity, rgba(0, 0, 0, 0.2)), 0px 24px 38px 3px var(--v-shadow-key-penumbra-opacity, rgba(0, 0, 0, 0.14)), 0px 9px 46px 8px var(--v-shadow-key-penumbra-opacity, rgba(0, 0, 0, 0.12));
}
.backgruond{
  background-image: url(../../assets/img/Order-Banner.jpg) !important;
  height: 300px;
  width: 100%;
  display: block;
  position: absolute;
  top: 0;
  background-size: cover;
}
</style>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      changeNewPassword: false,
      success: false,
      token:'',
      dialogVisible: false,
      passwordData: {
        newpassword: '',
        confirmpassword: ''
      },
      passwordShow: {
        newpassword: false,
        confirmpassword: false
      },
      newpasswordRules: [
        (value) => !!value || 'New password is required',
        (value) => value && value.length >= 3 || 'New password must be at least 6 characters long',
      ],
      confirmpasswordRules: [
        (value) => !!value || 'Confirm password is required',
        (value) => value === this.passwordData.newpassword || 'Passwords do not match',
      ],
    };
  },
  mounted() {
    const param = this.$route.params.param;
    this.token = param
    // Use the param as needed in your component logic
    this.requestConfirmToken()
  },
  methods: {
    openDialog() {
      this.dialogVisible != this.dialogVisible;
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
      this.passwordData.newpassword = '';
      this.passwordData.confirmpassword = '';
    },
    validatePasswordsAndChange() {
      if (this.$refs.changeForm.validate()) {
        if (this.passwordData.newpassword !== this.passwordData.confirmpassword) {
          this.showPasswordsNotMatchError();
        } else {
          this.resetPassword();
        }
      }
    },
    showPasswordsNotMatchError() {
      // Show an error alert or perform any other action to indicate the password mismatch
      alert('Passwords do not match. Please try again.');
    },
    async requestConfirmToken(){
      const baseUrl = `${import.meta.env.VITE_API_URL}/resetpwd`
      this.err = true
      try {
        const response = await axios.get(`${baseUrl}/${this.token}`,)
        if (response.data.status === true) {
          this.changeNewPassword = true
        }else{
          // this.$router.push({name: "NotFound",params:{catchAll: this.token}}) 
        }
      } catch (error) {
        console.error('Error updating password error:', error)
      }
      
    },
    async resetPassword(){
      const baseUrl = `${import.meta.env.VITE_API_URL}/resetpwd`
      try {
        const response = await axios.put( baseUrl, {token: this.token, password: this.passwordData.newpassword})
        if (response.data.status === true) {
          this.changeNewPassword = false
          this.success = true
        }else{
          this.dialogVisible = false
        }
      } catch (error) {
        console.error('Error updating password error:', error)
      }
    }
  },
};
</script>

