<template>
  <div>{{ user }}</div>
</template>

<script>
import axios from 'axios'
import { useAuthStore } from '@/store/authStore'
export default {
  data(){
    return {
      user: ''
    }
  },
  methods:{
    async getUser(){
      const authStore = useAuthStore();
      const baseUrl = `${import.meta.env.VITE_API_URL}/users`;
      const { getToken } = authStore;
      try {
        const respone = await axios.get(baseUrl,{
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken}` }
        })
        this.user = respone.data
        console.log(respone.data)
      } catch (error) {
        
      }
      console.log("user")
    }
  },
  mounted(){
    this.getUser()
    console.log(this.user)
  }
}
</script>

