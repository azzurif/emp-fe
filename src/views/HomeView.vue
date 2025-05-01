<script setup lang="ts">
import Navbar from "@/components/Navbar.vue";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Fetch from "@/lib/fetch";
import router from "@/router";
import { onMounted, ref, watch, watchEffect } from "vue";

const employees = ref([]);
const divisions = ref([]);
const currentPage = ref(1);
const totalPages = ref(1);
const selectDivision = ref("");
const loadEmployees = async () => {
  const response = await Fetch({
    url: `employees?page=${currentPage.value}`,
    method: "GET",
    auth: true,
  });

  employees.value = response;
  totalPages.value = response?.meta?.last_page;
};

onMounted(async () => {
  if (!window.localStorage.getItem("token")) {
    router.push("/login");
  }

  [employees.value, divisions.value] = await Promise.all([
    Fetch({ url: "employees", method: "GET", auth: true }).then((val) => val),
    Fetch({ url: "divisions", method: "GET", auth: true }).then((val) => val),
  ]);
  console.log({ employees, divisions });
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

const changePage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};
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
        <div>
          <p>Filter</p>
          <Select v-model="selectDivision">
            <SelectTrigger class="w-[180px]">
              <SelectValue placeholder="Select a division" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem :value="0" selected>All</SelectItem>
                <SelectItem
                  v-for="div in divisions.data"
                  :key="div.id"
                  :value="div.id"
                >
                  {{ div.name }}
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Dialog>
            <DialogTrigger as-child>
              <Button>New Employee</Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Employee</DialogTitle>
                <DialogDescription>
                  Fill in the employee details below
                </DialogDescription>
              </DialogHeader>

              <!-- Form -->
              <div class="space-y-4">
                <Input
                  v-model="name"
                  type="text"
                  placeholder="Name"
                  class="w-full"
                />
                <Input
                  v-model="email"
                  type="email"
                  placeholder="Email"
                  class="w-full"
                />

                <Select v-model="positionId" class="w-full">
                  <SelectTrigger>
                    <SelectValue placeholder="Select a Posiition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Position</SelectLabel>
                      <SelectItem
                        v-for="pos in positions.data"
                        :key="pos.id"
                        :value="pos.id"
                      >
                        {{ pos.name }}
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>

                <Select v-model="divisionId" class="w-full">
                  <SelectTrigger>
                    <SelectValue placeholder="Select a Division" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Division</SelectLabel>
                      <SelectItem
                        v-for="div in divisions.data"
                        :key="div.id"
                        :value="div.id"
                      >
                        {{ div.name }}
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>

                <div class="flex gap-4">
                  <label class="flex items-center gap-2">
                    <Input type="radio" :value="1" v-model="gender" />Male
                  </label>
                  <label class="flex items-center gap-2">
                    <Input type="radio" :value="0" v-model="gender" />Female
                  </label>
                </div>

                <div class="flex items-center gap-2">
                  <Input type="checkbox" :value="1" v-model="status" /> Active
                  <Input type="checkbox" :value="0" v-model="status" />
                  Nno-Active
                </div>
              </div>

              <DialogFooter class="mt-4">
                <DialogClose as-child>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button @click="submitForm">Save</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
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
            v-for="employee in employees.data"
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
              {{ employee?.status ? "active" : "nonactive" }}
            </td>
          </tr>
        </tbody>
      </table>

      <div class="flex justify-center items-center gap-2 mt-4">
        <Button
          @click="changePage(currentPage - 1)"
          :disabled="currentPage === 1"
        >
          Prev
        </Button>

        <Button v-if="currentPage > 1" @click="changePage(currentPage - 1)">
          {{ currentPage - 1 }}
        </Button>

        <Button>
          {{ currentPage }}
        </Button>

        <Button
          v-if="currentPage < totalPages"
          @click="changePage(currentPage + 1)"
        >
          {{ currentPage + 1 }}
        </Button>

        <Button
          @click="changePage(currentPage + 1)"
          :disabled="currentPage === totalPages"
        >
          Next
        </Button>
      </div>
    </div>
  </main>
</template>
