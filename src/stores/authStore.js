import { defineStore } from 'pinia'
import axios from 'axios';
import CryptoJS from 'crypto-js'
const baseUrl = `${import.meta.env.VITE_API_URL}/login`;
const depass = `${import.meta.env.VITE_DEPASS}`;
export const useAuthStore = defineStore(
  'auth', 
  {
    state: () => ({
      isAuthenticated: false,
      token: null,
      user: null,
    }),
    actions: {
      setRoute(route){
        const encryptedToken = CryptoJS.AES.encrypt(JSON.stringify(route), depass).toString()
        sessionStorage.setItem('route', encryptedToken);
      },
      setTokenAndUser(user,token) {
        this.user = user
        this.token = token;
        localStorage.setItem('user', JSON.stringify(user))
        localStorage.setItem('token', JSON.stringify(token))
      },
      
      logout() {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        localStorage.removeItem('route')
      },
      async submitHandler(username, password) {
        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);
        try {
          const response = await axios.post(baseUrl, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          })
          
          const { message, status } = response.data
          if (status === 200 ) {
            const { user, access_token } = response.data.data
            const encryptedUser = CryptoJS.AES.encrypt(JSON.stringify(user), depass).toString();
            const encryptedToken = CryptoJS.AES.encrypt(JSON.stringify(access_token), depass).toString()
            this.setTokenAndUser(encryptedUser,encryptedToken)
            // window.location.reload()
            // this.$router.push('/Dashboard')
            return { message, status }
          } else {
            // Failed login
            this.isAuthenticated = false;
            return { message, status }
          }
        } catch (error) {
          // console.log(error.response)          
        }
      }
    },
    getters: {
      getUser() {
        const data = JSON.parse(localStorage.getItem('user'))
        if(data){
          const bytes  = CryptoJS.AES.decrypt(data, depass);
          const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
          return decryptedData
        }
        return null
      },
      getToken() {
        const data = JSON.parse(localStorage.getItem('token'))
        if(data){
          const bytes = CryptoJS.AES.decrypt(data, depass)
          const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
          return decryptedData.token
        }
        return null
      },
      getRoute(){
        const data = localStorage.getItem('route')
        if(data){
          const bytes  = CryptoJS.AES.decrypt(data, depass);
          const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
          return JSON.parse(decryptedData)
        }
        return null
      },
    }
  }
)