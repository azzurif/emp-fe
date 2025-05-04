import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useAuthStore = defineStore("auth", () => {
  const token = ref(localStorage.getItem("token") || "");
  const exp = ref(+(localStorage.getItem("token_exp") || 0));
  const isValid = computed(() => Date.now() < exp.value);

  const setToken = (newToken: string, newExp: number) => {
    token.value = newToken;
    exp.value = Date.now() + newExp * 1000;
    localStorage.setItem("token", newToken);
    localStorage.setItem("token_exp", exp.value.toString());
  };
  
  const clearToken = () => {
    token.value = "";
    exp.value = 0;
    localStorage.removeItem("token");
    localStorage.removeItem("token_exp");
  };

  return { token, exp, isValid, setToken, clearToken };
});
