import { defineStore } from 'pinia'
import axios from 'axios';
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
            const { user, access_token } = response.data;
            this.setUser(user);
            this.setTokenAndUser(user,access_token);
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
        this.user = JSON.parse(localStorage.getItem('user'))
        return this.user;
      },
      getToken() {
        this.token = localStorage.getItem('token')
        return this.token;
      },
      
    }
  }
)