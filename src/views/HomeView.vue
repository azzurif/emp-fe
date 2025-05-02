<script setup lang="ts">
import Navbar from "@/components/Navbar.vue";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
import { toast } from "vue-sonner";

const employees = ref([]);
const divisions = ref([]);
const positions = ref([]);
const currentPage = ref(1);
const totalPages = ref(1);
const selectDivision = ref("");

const selectCreateDivision = ref("");
const selectCreatePosition = ref("");
const name = ref("");
const email = ref("");
const gender = ref("1");
const status = ref("1");
const handleCreateEmployee = async (e: Event) => {
  e.preventDefault();

  const payload = {
    division_id: selectCreateDivision.value,
    position_id: selectCreatePosition.value,
    name: name.value,
    email: email.value,
    gender: gender.value,
    status: status.value,
  };
  const response = await Fetch({
    url: "employees",
    method: "POST",
    body: JSON.stringify(payload),
    auth: true,
  });
  router.push("/");
  if (response.errors || response.message) {
    toast("Error create employee", {
      description: response.message,
      action: {
        label: "Close",
      },
    });
  }
};

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
            <DialogContent class="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Employee</DialogTitle>
                <DialogDescription>
                  Fill in the employee details below
                </DialogDescription>
              </DialogHeader>
              <form class="grid gap-4 py-4" @submit="handleCreateEmployee">
                <div class="space-y-2">
                  <Label for="division_id">Division</Label>
                  <Select v-model="selectCreateDivision" id="division_id">
                    <SelectTrigger class="w-full">
                      <SelectValue placeholder="Select a division" />
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
                </div>

                <div class="space-y-2">
                  <Label for="position_id">Division</Label>
                  <Select v-model="selectCreatePosition" id="position_id">
                    <SelectTrigger class="w-full">
                      <SelectValue placeholder="Select a position" />
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
                </div>

                <div class="space-y-2">
                  <Label for="name" class="text-right"> Name </Label>
                  <Input v-model="name" type="text" placeholder="Name" />
                </div>

                <div class="space-y-2">
                  <Label for="email" class="text-right"> Email </Label>
                  <Input v-model="email" type="email" placeholder="Email" />
                </div>

                <div class="flex items-center justify-between">
                  <div class="space-y-2">
                    <Label>Status</Label>
                    <RadioGroup
                      default-value="1"
                      :orientation="'horizontal'"
                      v-model="status"
                    >
                      <div class="flex items-center space-x-2">
                        <RadioGroupItem id="active" :value="1" />
                        <Label for="active">Active</Label>
                      </div>
                      <div class="flex items-center space-x-2">
                        <RadioGroupItem id="nonactice" :value="0" />
                        <Label for="nonactice">Non-active</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div class="space-y-2">
                    <Label>Gender</Label>
                    <RadioGroup
                      default-value="1"
                      :orientation="'horizontal'"
                      v-model="gender"
                    >
                      <div class="flex items-center space-x-2">
                        <RadioGroupItem id="male" :value="1" />
                        <Label for="male">Male</Label>
                      </div>
                      <div class="flex items-center space-x-2">
                        <RadioGroupItem id="female" :value="0" />
                        <Label for="female">Female</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>

                <DialogFooter>
                  <Button type="submit"> Save changes </Button>
                </DialogFooter>
              </form>
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
