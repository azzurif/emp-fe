<script setup lang="ts">
import { Toaster } from "@/components/ui/sonner";
import { RouterView } from "vue-router";
import router from "./router";
import { onMounted, watchEffect } from "vue";
import { useAuthStore } from "./store/auth";
import { watch } from "vue";

const auth = useAuthStore();

watch(
  () => auth.isValid,
  () => {
    if (!auth.isValid) {
      auth.clearToken();
      router.push("login");
      console.log('token')
    }
  },
  { immediate: true }
);

// watchEffect(() => {
//     if (!auth.isValid) {
//     auth.clearToken();
//     router.push("login");
//   }
// })
</script>

<template>
  <Toaster />
  <RouterView />
</template>
