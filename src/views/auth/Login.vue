<template>
  <v-app>
    <!-- <div class="backgruond"></div> -->
    <v-main class="d-flex justify-center align-center">
      <v-col cols="10" lg="4" class="mx-auto">
        <v-card class="pa-4" elevation="12">
          <div class="text-center">
            <v-avatar size="100" color="red-accent-4 ">
              <v-icon size="40" color="blue-lighten-5">mdi-account</v-icon>
            </v-avatar>
            <h2 class="indigo--text">login Page</h2>
          </div>
          <v-form @submit.prevent="submitHandler" ref="form">
            <v-card-text>
              <v-text-field
                class="my-3"
                v-model="username"
                :rules="emailRules"
                type="email"
                label="Email"
                placeholder="Email"
                prepend-inner-icon="mdi-account"
                variant="outlined"
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
                type="submit"
                color="red-darken-4"
              >
              <span class="white--text px-8 indigo">Login</span>
              </v-btn>
            </div>
          </v-form>
        </v-card>
      </v-col>
    </v-main>
    <v-snackbar top color="green" v-model="snackbar">
      Login success
    </v-snackbar>
  </v-app>
  <!-- <ResetPassword v-else/> -->
</template>

<script>
import { useAuthStore } from '@/store/authStore'
import ResetPassword from '@/views/menu/Resetpwd.vue'
export default {
  name: 'Login',
  components: { ResetPassword },
  data: () => ({
    error: null,
    success: false,
    loading:false,
    snackbar:false,
    passwordShow:false,
    username: 'risto.nhen@canadiabank.com.kh',
    emailRules: [
      v => !!v || 'E-mail is required',
      v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
    ],
    password: 'Cana#123',
    passwordRules: [
      v => !!v || 'Password is required',
      v => (v && v.length >= 6) || 'Password must be 6  characters or more!',
      // v => /[A-Z]/.test(v) || 'Password must contain at least one uppercase letter'
    ],
  }),
  methods:{
    submitHandler(){
      const useStore = useAuthStore();
      useStore.submitHandler(this.username,this.password)
    }
    
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