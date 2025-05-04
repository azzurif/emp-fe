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
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
});
const register = async () => {
  if (credentials.password !== credentials.confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  const response = await Fetch({
    url: "auth/register",
    method: "POST",
    body: JSON.stringify({
      name: credentials.name,
      email: credentials.email,
      password: credentials.password,
    }),
  });

  if (response.token) {
    auth.setToken(response.token, 3600);
    router.push("/");
  } else {
    alert(response.message);
  }
};

onMounted(() => {
  if (window.localStorage.getItem("token")) {
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
        <CardTitle>Register</CardTitle>
        <CardDescription>Create a new account</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="space-y-4">
          <div class="space-y-2">
            <Label for="name"> Name </Label>
            <Input
              id="name"
              v-model="credentials.name"
              type="text"
              placeholder="Enter your name"
            />
          </div>
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
          <div class="space-y-2">
            <Label for="confirmPassword"> Confirm Password </Label>
            <Input
              id="confirmPassword"
              v-model="credentials.confirmPassword"
              type="password"
              placeholder="Confirm your password"
            />
          </div>
        </div>
      </CardContent>
      <CardFooter class="flex flex-col">
        <Button class="w-full" @click="register">Sign Up</Button>

        <Button :variant="'link'">
          <RouterLink to="/login" class="">to: Login</RouterLink>
        </Button>
      </CardFooter>
    </Card>
  </div>
</template>
