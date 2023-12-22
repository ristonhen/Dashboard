<template>
   <div>
    <h1>Socket.io app</h1>
    <Chat />
   </div>
</template>

<script>
import { socket } from "@/socket";
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

  methods: {
    onSubmit() {
      this.isLoading = true;

      socket.timeout(5000).emit("create-something", this.value, () => {
        this.isLoading = false;
      });
    },
  }
}
</script>