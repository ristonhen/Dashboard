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
      setTokenAndUser(user,token) {
        this.token = token;
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', token);
      },
      clearCredentials() {
        this.username = ''
        this.password = ''
        this.token = ''
      },
      logout() {
        localStorage.removeItem('token')
        window.location.reload()
      },
      async submitHandler(username , password) {
        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);
        try {
          const response = await axios.post(baseUrl, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          })
          if (response.status === 200 ) {
            console.log("Log in Successfully");
            this.isAuthenticated = true;
            this.setTokenAndUser(response.data.user,
                                      response.data.access_token);
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