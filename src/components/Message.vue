<template>
  <p v-if="message.type === 'join'">
    {{ message.sid }} just joined
  </p>
  <p v-else-if="message.type === 'chat'">
    {{ message.sid }}: {{ message.message }}
  </p>
</template>

<script>
export default {
  props: {
    message: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style scoped>
/* Add your component-specific styles here */
</style>