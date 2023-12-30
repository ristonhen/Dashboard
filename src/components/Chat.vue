<template>
  <v-container>
    <h2>status: {{ isConnected ? 'connected' : 'disconnected' }}</h2>
    <v-card class="message-container" elevation="2">
      <Message v-for="(message, index) in messages" :message="message" :key="index" />
    </v-card>
    <v-text-field v-model="message" label="Message" outlined></v-text-field>
    <v-btn @click="sendMessage" color="primary">Send</v-btn>
  </v-container>
</template>

<script>
import { io } from 'socket.io-client';
import Message from './Message.vue';
import { useAuthStore } from '@/stores/authStore'

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
      clientId: '', // Client ID (socket connection ID)
      userId: '', // User ID retrieved from localStorage
      connectedUsers: [], // Array to store the connected user IDs
    
    };
  },
  async mounted() {
    await this.getUser()
    this.socket = io(import.meta.env.VITE_API_URL, {
      path: `/api/${import.meta.env.VITE_API_SOCKET}`,
      auth: {
        userId: this.userId,
      },
      query: ""
    });

    this.socket.on('connect', () => {
      this.isConnected = this.socket.connected;
      this.clientId = this.socket.id; // Set client ID from socket connection
    });

    this.socket.on('disconnect', () => {
      this.isConnected = this.socket.connected;
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
        const payload = {
          message: this.message,
          clientId: this.clientId,
          userId: this.userId,
          sender_id: this.userId
        };
        this.socket.emit('chat', payload);
      }
      this.message = '';
    },
    getUser(){
      const authStore = useAuthStore();
      this.userId = authStore.getUser.id
    }
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