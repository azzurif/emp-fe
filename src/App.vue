<script setup lang="ts">
import { Toaster } from "@/components/ui/sonner";
import { RouterView } from "vue-router";
import router from "./router";
import { onMounted, watchEffect } from "vue";
import { useAuthStore } from "./store/auth";

const auth = useAuthStore();

watchEffect(() => {
  if (!auth.isValid) {
    localStorage.removeItem("token");
    router.push("login");

    console.log("exp");
  }
});
</script>

<template>
  <Toaster />
  <RouterView />
</template>
