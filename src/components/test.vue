<template>
   <div>
    <h1>Socket.io app</h1>
    <Chat />
   </div>
</template>

<script>
import  Chat  from './Chat.vue';
export default {
  name: "MyForm",
  components: {
    Chat,
  },
  data() {
    return {
      isLoading: false,
      value: ""
    }
  },
}
</script>