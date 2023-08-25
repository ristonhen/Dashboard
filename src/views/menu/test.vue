<template>
  <div>testing: {{}}</div>
</template>

<script>
import { ref, watch, computed,onMounted } from "vue";
import { useAuthStore } from '@/store/authStore'
import { storeToRefs } from "pinia";
export default {
  setup(){
    const useStore = useAuthStore()
    // const { user } = storeToRefs(useAuthStore)
    const user = useStore.getUser

    onMounted(()=>{
      console.log(user)
    })
    return { user }
  }
}
</script>
