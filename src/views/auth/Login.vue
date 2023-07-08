<template>
  <v-app>
    <div class="backgruond"></div>
    <v-main class="d-flex justify-center align-center">
      <v-col cols="10" lg="4" class="mx-auto">
        <v-card class="pa-4">
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
  
</template>

<script>
import axios from 'axios'
export default {
  name: 'Login',
  data: () => ({
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
    password: '123',
    passwordRules: [
      v => !!v || 'Password is required',
      v => (v && v.length >= 6) || 'Password must be 6  characters or more!',
      // v => /[A-Z]/.test(v) || 'Password must contain at least one uppercase letter'
    ],
  }),
  methods:{
    submitHandler(){
      // const authStore = useAuthStore()
      const baseurl = this.$router.push('/')
      const url = 'http://127.0.0.1:8000/login'
      const formData = new FormData()
      formData.append('username', this.username)
      formData.append('password', this.password)
      axios
        .post(url,formData, {headers: { 'Content-Type': 'multipart/form-data'}})
        .then(function (response) {
          console.log("Log in Successfully")
          // save the token to localStorage
          localStorage.setItem('token', response.data.access_token)
          // baseurl
        })
        .catch((error) => {
          console.log(error.response)
        })
      // console.log(this.$router.push('/'))
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