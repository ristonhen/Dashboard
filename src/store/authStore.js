import { defineStore } from 'pinia'
import axios from 'axios';
const baseUrl = `${import.meta.env.VITE_API_URL}/login`;

export const useAuthStore = defineStore(
  'auth', 
  {
    state: () => ({
      message: 'Hello, Pinia!',
      isAuthenticated: false,
      username: '',
      password: '',
      token: '',
    }),
    actions: {
      setCredentials(username, password) {
        this.username = username;
        this.password = password;
      },
      setToken(token) {
        this.token = token;
        localStorage.setItem('token', token);
      },
      clearCredentials() {
        this.username = ''
        this.password = ''
        this.token = ''
      },
      logout() {
        localStorage.removeItem('token')
        window.location.href='/'
      },
      async submitHandler() {
        const formData = new FormData();
        formData.append('username', this.username);
        formData.append('password', this.password);
        try {
          const response = await axios.post(baseUrl, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          })
          if (response.status === 200 ) {
            console.log("Log in Successfully");
            this.isAuthenticated = true;
            this.setToken(response.data.access_token);
            window.location.href='/';
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
      getUsername() {
        return this.username;
      },
      getToken() {
        return this.token;
      },
    }
  }
)