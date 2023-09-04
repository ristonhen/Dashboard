import { defineStore } from 'pinia'
import axios from 'axios';
import CryptoJS from 'crypto-js';
const baseUrl = `${import.meta.env.VITE_API_URL}/login`;
export const useAuthStore = defineStore(
  'auth', 
  {
    state: () => ({
      isAuthenticated: false,
      token: null,
      user: null,
      name: 'risto',
    }),
    actions: {
      setUser(user) {
        this.user = user;
      },
      setTokenAndUser(user,token) {
        this.token = token;
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', token);
      },
      checkTokenValidity() {
        const token = this.getToken
        const tokenIsValid = token !== null && token !== undefined;
        if (!tokenIsValid) {
          // Token is not available or expired, redirect to login page
          // You can use Vue Router to perform the redirection
          // router.push('/login');
          // window.location.reload()
        }
      },
      logout() {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        window.location.reload()
      },
      async submitHandler(username, password) {
        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);
        try {
          const response = await axios.post(baseUrl, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          })
          if (response.status === 200 ) {
            const { user, access_token } = response.data
            const encryptedUser = CryptoJS.AES.encrypt(JSON.stringify(user), '123').toString();
            const encryptedToken = CryptoJS.AES.encrypt(access_token, '123').toString();
            this.setUser(user);
            this.setTokenAndUser(user,encryptedToken)
            // this.setTokenAndUser(user,access_token);
            window.location.reload();
          } else {
            // Failed login
            this.isAuthenticated = false;
          }
        } catch (error) {
          console.log(error.response);
        }
      }
    },
    getters: {
      getUser() {
        const data = JSON.parse(localStorage.getItem('user'))
        const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), 'secret key 123').toString();
        const bytes  = CryptoJS.AES.decrypt(ciphertext, 'secret key 123');
        const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        console.log(decryptedData); // [{id: 1}, {id: 2}]
        return decryptedData
      },
      getToken() {
        const encryptedToken = localStorage.getItem('token')
        if(encryptedToken){
          const decryptedToken = CryptoJS.AES.decrypt(encryptedToken, '123').toString(CryptoJS.enc.Utf8)
          return decryptedToken
        }
        return null
      },
      
    }
  }
)