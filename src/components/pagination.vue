<script setup lang="ts">
import { Button } from './ui/button';

const currentPage = defineModel({ default: 1 });
const { totalPage } = defineProps<{
  totalPage: number;
}>();

const changePage = (page: number) => {
  if (page >= 1 && page <= totalPage) {
    currentPage.value = page;
  }
};
</script>

<template>
  <div class="flex justify-center items-center gap-2 mt-4">
    <Button @click="changePage(currentPage - 1)" :disabled="currentPage === 1">
      Prev
    </Button>

    <Button v-if="currentPage > 1" @click="changePage(currentPage - 1)">
      {{ currentPage - 1 }}
    </Button>

    <Button>
      {{ currentPage }}
    </Button>

    <Button v-if="currentPage < totalPage" @click="changePage(currentPage + 1)">
      {{ currentPage + 1 }}
    </Button>

    <Button
      @click="changePage(currentPage + 1)"
      :disabled="currentPage === totalPage"
    >
      Next
    </Button>
  </div>
</template>
