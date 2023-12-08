<template>
  <v-app>
    <div class="backgruond"></div>
      <v-dialog v-model="dialogVisible" persistent max-width="450px" class="custom-dialog">
        <v-card v-if="success">
          <v-card-title class="headline">Find Your Account</v-card-title>
          <v-card-text>
            <p>Please enter your email address to search for your account</p>
            <v-form @submit.prevent="" ref="changeForm">
              <v-text-field
                v-model="email"
                :rules="emailRules"
                variant="outlined"
                density="comfortable"
                type="email"
                label="Email"
                placeholder="Enter your Email"
                class="custom-text-field"
                required
              ></v-text-field>
              <div v-if="passwordsNotMatch" class="error-message">
                Passwords do not match.
              </div>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn>
                <router-link to="/" class="text-decoration-none">Back to Login</router-link>
              </v-btn>
            <v-btn color="primary" @click="requestResetPassword">Search</v-btn>
          </v-card-actions>
        </v-card>
        <v-card v-else>
          <v-card-title class="headline">Find Your Account</v-card-title>
            <v-card-text>
            <p>Your request reset password successfully. Please check your email </p>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn>
                <router-link to="/" class="text-decoration-none">
                  Go To Home
                </router-link>
              </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
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
      email: 'risto.nhen@canadiabank.com.kh',
      dialogVisible: true,
      success: true,
      emailRules: [
        (value) => !!value || 'Email is required',
      ],
    };
  },
  mounted(){
    // console.log(this.success)
  },
  methods: {
    async requestResetPassword(){
      const baseUrl = `${import.meta.env.VITE_API_URL}/resetpwd`
      try {
        const response = await axios.post(
          baseUrl, {
            email: this.email
          }
        )
        if (response.data.status === true) {
          this.success = false
          console.log(response.data.message)
        }else{
          this.dialogVisible = false
        }
      } catch (error) {
        console.error('Error updating password error:', error)
      }
      
    },
  },
  
};
</script>

