<template>
  <h3>Lelel 4 page</h3>
</template>

<script>
import VueSocketIO from 'vue-socket.io';
import io from 'socket.io-client';

export default {
  data() {
    return {
      socket: null,
    };
  },
  mounted() {
    this.socket = io('http://localhost:8000');
    this.$socket = new VueSocketIO({
      debug: true,
      connection: this.socket,
    });

    this.$socket.on('event', (data) => {
      console.log('Received event:', data);
      // Process the received data as needed
    });

    this.$socket.emit('customEvent', { key: 'value' });
  },
  beforeDestroy() {
    if (this.socket) {
      this.socket.close();
    }
  },
};
</script>