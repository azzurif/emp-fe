<script setup lang="ts">
import CreateEmployee from "@/components/create-employee.vue";
import Navbar from "@/components/navbar.vue";
import Pagination from "@/components/pagination.vue";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Fetch from "@/lib/fetch";
import router from "@/router";
import { useAuthStore } from "@/store/auth";
import type {
  EmployeeResource,
  DivisionResource,
  PositionResource,
} from "@/types";
import { onMounted, ref, watch, watchEffect } from "vue";

const auth= useAuthStore()
const employees = ref<EmployeeResource | null>(null);
const divisions = ref<DivisionResource | null>(null);
const positions = ref<PositionResource | null>(null);
const currentPage = ref(1);
const totalPage = ref(1);
const selectDivision = ref("");

const loadEmployees = async () => {
  const response = await Fetch({
    url: `employees?page=${currentPage.value}`,
    method: "GET",
    auth: true,
  });

  employees.value = response;
  totalPage.value = response?.meta?.last_page;
};

onMounted(async () => {
  if (!auth.isValid) {
    router.push("/login");
  }

  [employees.value, divisions.value, positions.value] = await Promise.all([
    Fetch({ url: "employees", method: "GET", auth: true }).then((val) => val),
    Fetch({ url: "divisions", method: "GET", auth: true }).then((val) => val),
    Fetch({ url: "positions", method: "GET", auth: true }).then((val) => val),
  ]);
});

watch(selectDivision, async (newVal) => {
  employees.value = await Fetch({
    url: `employees?division=${newVal}`,
    method: "GET",
    auth: true,
  });
});

watchEffect(() => {
  loadEmployees();
});
</script>

<template>
  <main>
    <Navbar />

    <div class="p-4 space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
        <div class="bg-white rounded-xl shadow p-4">
          <h2 class="text-lg font-semibold mb-2">Employees</h2>
          <p class="text-3xl font-bold">{{ employees?.agg?.count }}</p>
        </div>
        <div class="bg-white rounded-xl shadow p-4">
          <h2 class="text-lg font-semibold mb-2">Active Employee</h2>
          <p class="text-3xl font-bold">{{ employees?.agg?.status?.active }}</p>
        </div>
        <div class="bg-white rounded-xl shadow p-4">
          <h2 class="text-lg font-semibold mb-2">Non-Active Employee</h2>
          <p class="text-3xl font-bold">
            {{ employees?.agg?.status?.noactive }}
          </p>
        </div>
      </div>

      <h1 class="text-2xl font-semibold">Employees</h1>

      <div class="flex items-center justify-between gap-2">
        <div class="flex items-center gap-2">
          <p>Filter</p>
          <Select v-model="selectDivision">
            <SelectTrigger class="w-[180px]">
              <SelectValue placeholder="Select a division" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem :value="0" selected>All</SelectItem>
                <SelectItem
                  v-for="div in divisions?.data"
                  :key="div.id"
                  :value="div.id"
                >
                  {{ div.name }}
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <CreateEmployee :divisions="divisions" :positions="positions" />
      </div>

      <table class="w-full border-collapse border">
        <thead>
          <tr class="bg-gray-100">
            <th class="border p-2 text-left">Name</th>
            <th class="border p-2 text-left">Position</th>
            <th class="border p-2 text-left">Division</th>
            <th class="border p-2 text-left">Email</th>
            <th class="border p-2 text-left">Gender</th>
            <th class="border p-2 text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="employee in employees?.data"
            :key="employee.id"
            class="hover:bg-gray-50"
          >
            <td class="border p-2">{{ employee?.name }}</td>
            <td class="border p-2">{{ employee?.position?.name }}</td>
            <td class="border p-2">{{ employee?.division?.name }}</td>
            <td class="border p-2">{{ employee?.email }}</td>
            <td class="border p-2">
              {{ employee?.gender ? "Male" : "Female" }}
            </td>
            <td class="border p-2">
              {{ employee?.status ? "Active" : "Non-active" }}
            </td>
          </tr>
        </tbody>
      </table>

      <Pagination :total-page="totalPage" v-model="currentPage" />
    </div>
  </main>
</template>
