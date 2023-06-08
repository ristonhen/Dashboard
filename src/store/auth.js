import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
    state: () => ({
      user: null,
      token: null,
    }),
    actions: {
      login(token) {
        this.token = token; // set the token in the store
      },
      logout() {
        this.token = null; // clear the token from the store
      },
      setUser(user) {
        this.user = user;
      },

      setToken(token) {
        this.token = token;
      },
    },
    getters: {

    }
  })