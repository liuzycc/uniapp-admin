import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => {
    return {
      token: localStorage.getItem("vuems_token") || "",
    };
  },
  getters: {},
  actions: {
    setToken(t: string) {
      this.token = t;
    },
  },
});
