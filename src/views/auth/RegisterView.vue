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
import Fetch from "@/lib/fetch";
import router from "@/router";
import { onMounted, reactive } from "vue";

const credentials = reactive({
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
});

const handleRegister = async () => {
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
    window.localStorage.setItem("token", response.token);
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
    <img src="../../assets/logo.svg" alt="Logo" class="h-16 mb-8" />
    <Card class="w-[400px]">
      <CardHeader>
        <CardTitle>Register</CardTitle>
        <CardDescription>Create a new account</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="space-y-4">
          <div class="space-y-2">
            <label
              class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              for="name"
            >
              Name
            </label>
            <Input
              id="name"
              v-model="credentials.name"
              type="text"
              placeholder="Enter your name"
            />
          </div>
          <div class="space-y-2">
            <label
              class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              for="email"
            >
              Email
            </label>
            <Input
              id="email"
              v-model="credentials.email"
              type="email"
              placeholder="eg. mail@mail.com"
            />
          </div>
          <div class="space-y-2">
            <label
              class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              for="password"
            >
              Password
            </label>
            <Input
              id="password"
              v-model="credentials.password"
              type="password"
              placeholder="Enter your password"
            />
          </div>
          <div class="space-y-2">
            <label
              class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              for="confirmPassword"
            >
              Confirm Password
            </label>
            <Input
              id="confirmPassword"
              v-model="credentials.confirmPassword"
              type="password"
              placeholder="Confirm your password"
            />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button class="w-full" @click="handleRegister">Sign Up</Button>
      </CardFooter>
    </Card>
  </div>
</template>
