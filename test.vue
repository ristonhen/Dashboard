<template>
    <form @submit.prevent="login">
      <label>
        Email:
        <input type="email" v-model="email" required>
      </label>
      <label>
        Password:
        <input type="password" v-model="password" required>
      </label>
      <button type="submit">Log in</button>
    </form>
  </template>
  
  <script>
  import { defineComponent, ref } from 'vue';
  import axios from 'axios';
  import { useAuthStore } from '@/stores/auth'; // assuming you have a Pinia store set up for your application
  
  export default defineComponent({
    name: 'LoginPage',
    setup() {
      const authStore = useAuthStore(); // use the auth store in the component
  
      // define the form fields as refs
      const email = ref('');
      const password = ref('');
  
      // define the login function
      const login = async () => {
        try {
          const response = await axios.post('/api/login', { email: email.value, password: password.value });
          authStore.login(response.data.token); // dispatch a login action to the store
        } catch (error) {
          console.error(error);
        }
      };
  
      return {
        email,
        password,
        login,
      };
    },
  });
  </script>