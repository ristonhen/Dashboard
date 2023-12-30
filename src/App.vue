<template>
  <router-view/>
</template>
<script setup>
// import { useItemStore } from "@/stores/item";
// import { useConnectionStore } from "@/stores/connection";
// import { socket } from "@/socket";

// const itemStore = useItemStore();
// const connectionStore = useConnectionStore();

// // remove any existing listeners (after a hot module replacement)
// socket.off();

// itemStore.bindEvents();
// connectionStore.bindEvents();
</script>
<style lang="scss">
:root {
	--primary: #4ade80;
	--primary-alt: #22c55e;
	--grey: #64748b;
	--dark: #1e293b;
	--dark-alt: #334155;
	--light: #f1f5f9;
	--sidebar-width: 300px;
}

* {
	margin: 0;
	padding: 0;
	box-sizing: border-box;
	font-size: 15px;
	// font-family: '', sans-serif;
}

.v-text-field .v-field {
    cursor: text;
    border-radius: 10px;
}

</style>