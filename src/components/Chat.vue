<template>
  <div>
    <h2>status: {{ isConnected ? 'connected' : 'disconnected' }}</h2>
    <div class="message-container">
      <Message v-for="(message, index) in messages" :message="message" :key="index" />
    </div>
    <input type="text" v-model.trim="message" id="message" />
    <button @click="sendMessage">Send</button>
  </div>
</template>

<script>
import { io } from 'socket.io-client';
import Message from './Message.vue';

export default {
  name: 'Chat',
  components: {
    Message,
  },
  data() {
    return {
      isConnected: false,
      messages: [],
      message: '',
      socket: null,
    };
  },
  mounted() {
    this.socket = io(import.meta.env.VITE_API_URL, {
      path: `/api/${import.meta.env.VITE_API_SOCKET}`,
    });

    this.socket.on('connect', () => {
      this.isConnected = this.socket.connected;
      console.log("connected")
    });

    this.socket.on('disconnect', () => {
      this.isConnected = this.socket.connected;
      console.log("Disconnected")
    });

    this.socket.on('join', (data) => {
      this.messages.push({ ...data, type: 'join' });
    });

    this.socket.on('chat', (data) => {
      this.messages.push({ ...data, type: 'chat' });
    });
  },
  methods: {
    sendMessage() {
      if (this.message && this.message.length) {
        this.socket.emit('chat', this.message);
      }
      const messageBox = document.getElementById('message');
      messageBox.value = '';
      this.message = '';
    },
  },
};
</script>

<style scoped>
.message-container {
  height: 500px;
  overflow-y: scroll;
  border: solid black 1px;
  padding: 10px;
  margin-top: 15px;
  display: flex;
  flex-direction: column;
}
</style>