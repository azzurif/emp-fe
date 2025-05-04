<script setup lang="ts">
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
import type { DivisionResource, PositionResource } from "@/types";
import { reactive } from "vue";
import { toast } from "vue-sonner";
import { Button } from "./ui/button";

const { divisions, positions } = defineProps<{
  divisions: DivisionResource | null;
  positions: PositionResource | null;
}>();

const employee = reactive({
  division_id: "",
  position_id: "",
  name: "",
  email: "",
  gender: "",
  status: "",
});

const handleCreateEmployee = async (e: Event) => {
  e.preventDefault();

  const payload = {
    division_id: employee.division_id,
    position_id: employee.position_id,
    name: employee.name,
    email: employee.email,
    gender: employee.gender,
    status: employee.status,
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
</script>

<template>
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
            <Select v-model="employee.division_id" id="division_id">
              <SelectTrigger class="w-full">
                <SelectValue placeholder="Select a division" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Division</SelectLabel>
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

          <div class="space-y-2">
            <Label for="position_id">Division</Label>
            <Select v-model="employee.position_id" id="position_id">
              <SelectTrigger class="w-full">
                <SelectValue placeholder="Select a position" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Position</SelectLabel>
                  <SelectItem
                    v-for="pos in positions?.data"
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
            <Input v-model="employee.name" type="text" placeholder="Name" />
          </div>

          <div class="space-y-2">
            <Label for="email" class="text-right"> Email </Label>
            <Input v-model="employee.email" type="email" placeholder="Email" />
          </div>

          <div class="flex items-center justify-between">
            <div class="space-y-2">
              <Label>Status</Label>
              <RadioGroup
                default-value="1"
                :orientation="'horizontal'"
                v-model="employee.status"
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
                v-model="employee.gender"
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
</template>
