import { reactive } from "vue"
import { io } from "socket.io-client"

export const state = reactive({
  connected: false,
  fooEvents: [],
  barEvents: []
})

const URL = process.env.NODE_ENV === "production" ? undefined : import.meta.env.VITE_API_URL
export const socket = io(URL,{ path: `/api/${import.meta.env.VITE_API_SOCKET}`})

socket.on("connect", () => {
  state.connected = true;
})

socket.on("disconnect", () => {
  state.connected = false;
})

socket.on("foo", (...args) => {
  state.fooEvents.push(args);
})

socket.on("bar", (...args) => {
  state.barEvents.push(args);
})