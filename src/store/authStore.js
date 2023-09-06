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
      setTokenAndUser(user,token) {
        this.user = user
        this.token = token;
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', JSON.stringify(token));
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
            const encryptedUser = CryptoJS.AES.encrypt(JSON.stringify(user), 'Cana!@#123').toString();
            const encryptedToken = CryptoJS.AES.encrypt(JSON.stringify(access_token), 'Cana!@#123').toString();
            this.setTokenAndUser(encryptedUser,encryptedToken);
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
        const bytes  = CryptoJS.AES.decrypt(data, 'Cana!@#123');
        const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        return decryptedData
      },
      getToken() {
        const data = JSON.parse(localStorage.getItem('token'))
        if(data){
          const bytes = CryptoJS.AES.decrypt(data, "Cana!@#123")
          const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
          return decryptedData.token
        }
        return null
      },
    }
  }
)