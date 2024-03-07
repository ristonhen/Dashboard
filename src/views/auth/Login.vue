<template>
  <v-app>
    <div class="backgruond"></div>
    <v-main class="d-flex justify-center align-center">
      <v-col cols="10" lg="4" class="mx-auto">
        <v-card class="pa-2" elevation="12" max-width="400">
          <div class="text-center">
            <v-avatar size="100" color="red-accent-4 ">
              <v-icon size="40" color="blue-lighten-5">mdi-account</v-icon>
            </v-avatar>
            <h2 class="indigo--text">login Page</h2>
          </div>
          <v-form ref="form">
            <v-card-text>
              <v-text-field
                class="my-2"
                v-model="username"
                :rules="emailRules"
                type="email"
                label="Email"
                placeholder="Email"
                prepend-inner-icon="mdi-account"
                variant="outlined"
                density="comfortable"
                required
              />
              <v-text-field
                 v-model="password"
                 :rules="passwordRules"
                 :type="passwordShow?'text':'password'"
                 label="Password"
                 placeholder="Password"
                 prepend-inner-icon="mdi-key"
                 variant="outlined"
                 density="comfortable"
                 :append-inner-icon="passwordShow ? 'mdi-eye':'mdi-eye-off'"
                 @click:append-inner="passwordShow = !passwordShow"
              />
              <div class="text-right">
                <router-link to="/forgot-password" class="text-decoration-none">
                  Forgot Password?
                </router-link>
              </div>
              <!-- :append-icon="passwordShow ? 'mdi-eye':'mdi-eye-off'"
                 @click:append="passwordShow = !passwordShow"
                 required -->
              <v-switch label="Remember me" color="indigo"></v-switch>
            </v-card-text>
            <div class="d-flex justify-space-around align-center flex-column flex-md-row fill-height">
              <v-btn
                size="large"
                rounded="lg"
                :loading="loading"
                @click="submitHandler"
                color="blue-darken-3"
              >
              <span class="white--text px-8 indigo">Login</span>
              </v-btn>
            </div>
          </v-form>
        </v-card>
      </v-col>
    </v-main>
    <v-snackbar v-model="success" timeout="7000" color="success" class="snackbar-bottom-right">
      {{ messageText }}
    </v-snackbar>
  </v-app>
</template>

<script>
import { useAuthStore } from '@/stores/authStore'
export default {
  name: 'Login',
  data: () => ({
    messageText: "",
    error: null,
    success: false,
    loading:false,
    snackbar:false,
    passwordShow:false,
    username: 'ristonhen@gmail.com',
    emailRules: [
      v => !!v || 'E-mail is required',
      v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
    ],
    password: 'Cana#123',
    passwordRules: [
      v => !!v || 'Password is required'
    ],
  }),
  methods:{
    navigateToDashboard() {
      this.$router.push('/search');
    },
    async submitHandler(){
      const { valid } = await this.$refs.form.validate()
      if (valid){
        this.loading = true
        const useStore = useAuthStore();
        const response_login  = await useStore.submitHandler(this.username,this.password)
        if(response_login.status != 200){
          this.success = true
          this.messageText = response_login.message
          this.loading = false
          
        }else{
          this.loading = false
          this.$router.push('/');
        }
      }
      
    },
    
  },
}
</script>
<style>
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