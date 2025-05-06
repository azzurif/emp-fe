<script setup lang="ts">
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Fetch from "@/lib/fetch";
import router from "@/router";
import { useAuthStore } from "@/store/auth";
import { onMounted, reactive } from "vue";

const auth = useAuthStore();
const credentials = reactive({
  email: "",
  password: "",
});
const handleLogin = async () => {
  const response = await Fetch({
    url: "auth/login",
    method: "POST",
    body: JSON.stringify(credentials),
  });

  if (response.token) {
    auth.setToken(response.token, 3600);
    console.log("success login");
    router.push("/");
  } else {
    alert(response.message);
  }
};

onMounted(() => {
  if (auth.isValid) {
    router.push("/");
  }
});
</script>

<template>
  <div
    class="min-h-screen flex flex-col items-center justify-center bg-background"
  >
    <img src="/assets/logo.svg" alt="Logo" class="h-16 mb-8" />
    <Card class="w-[400px]">
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription
          >Enter your credentials to access your account</CardDescription
        >
      </CardHeader>
      <CardContent>
        <div class="space-y-4">
          <div class="space-y-2">
            <Label for="email"> Email </Label>
            <Input
              id="email"
              v-model="credentials.email"
              type="email"
              placeholder="eg. mail@mail.com"
            />
          </div>
          <div class="space-y-2">
            <Label for="password"> Password </Label>
            <Input
              id="password"
              v-model="credentials.password"
              type="password"
              placeholder="Enter your password"
            />
          </div>
        </div>
      </CardContent>
      <CardFooter class="flex flex-col">
        <Button class="w-full" @click="handleLogin"> Sign In </Button>

        <Button :variant="'link'">
          <RouterLink to="/register" class="">to: Register</RouterLink>
        </Button>
      </CardFooter>
    </Card>
  </div>
</template>
