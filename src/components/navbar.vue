<script setup lang="ts">
import Fetch from "@/lib/fetch";
import router from "@/router";
import { useAuthStore } from "@/store/auth";
import type { User } from "@/types";
import { onMounted, ref } from "vue";
import { Button } from "./ui/button";

const user = ref<User | null>(null);

const auth = useAuthStore();
const logout = async () => {
  const response = await Fetch({
    url: "auth/logout",
    method: "POST",
    auth: true,
  });
  if (response) {
    auth.clearToken();
    router.push("/login");
  }
};

onMounted(async () => {
  user.value = (
    await Fetch({
      url: "auth/user/active",
      method: "GET",
      auth: true,
    })
  ).data;
});
</script>

<template>
  <nav class="flex gap-4 p-4 bg-gray-100">
    <div class="flex justify-between items-center w-full">
      <img src="/assets/logo.svg" alt="Logo" class="h-14 w-auto" />
      <div class="flex items-center gap-4">
        <span class="border p-2 rounded-md">{{ user?.name }}</span>
        <Button class="hover:underline" @click="logout">Logout</Button>
      </div>
    </div>
  </nav>
</template>
