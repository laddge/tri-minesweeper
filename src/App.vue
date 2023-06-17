<script setup lang="ts">
  import Triangle from '@/components/Triangle.vue'
  import { useStateStore } from '@/stores/state'
  import { storeToRefs } from 'pinia'

  const { size, mineCount, flagged, flagMode, started, cleared, failed } = storeToRefs(useStateStore())
</script>

<template>
  <div class="form-control w-fit mx-auto my-4">
    <label class="cursor-pointer label">
      <input type="checkbox" :disabled="!started || cleared || failed" v-model="flagMode" class="checkbox checkbox-warning" />
      <span class="label-text ml-4">flag ({{ flagged.length }} / {{ mineCount }})</span>
    </label>
  </div>
  <div v-if="cleared" class="my-4 text-center text-success text-xl">
    Clear!!
  </div>
  <div class="overflow-auto">
    <div class="mx-auto my-6" :style="`width: calc(${size} * 3rem);`">
    <div class="flex flex-wrap justify-center">
      <Triangle v-for="_, i in Array(size ** 2)" :n="i + 1" />
    </div>
    </div>
  </div>
</template>
