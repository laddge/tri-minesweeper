<script setup lang="ts">
  import { ref, watch } from 'vue'
  import Triangle from '@/components/Triangle.vue'
  import { useStateStore } from '@/stores/state'
  import { storeToRefs } from 'pinia'

  const { level, size, mineCount, flagged, flagMode, started, cleared, failed } = storeToRefs(useStateStore())
  const { reset } = useStateStore()
</script>

<template>
  <div class="form-control w-fit mx-auto mt-4">
    <div class="flex flex-wrap">
      <label class="cursor-pointer label">
        <input type="radio" name="level" :disabled="started || cleared || failed" v-model="level" value="0" class="radio radio-info" />
        <span class="label-text ml-4">Easy</span>
      </label>
      <label class="cursor-pointer label">
        <input type="radio" name="level" :disabled="started || cleared || failed" v-model="level" value="1" class="radio radio-info" />
        <span class="label-text ml-4">Normal</span>
      </label>
      <label class="cursor-pointer label">
        <input type="radio" name="level" :disabled="started || cleared || failed" v-model="level" value="2" class="radio radio-info" />
        <span class="label-text ml-4">Hard</span>
      </label>
    </div>
  </div>
  <div class="form-control w-fit mx-auto mb-4">
    <label class="cursor-pointer label">
      <input type="checkbox" :disabled="!started || cleared || failed" v-model="flagMode" class="checkbox checkbox-warning" />
      <span class="label-text ml-4">flag ({{ flagged.length }} / {{ mineCount }})</span>
    </label>
    <button @click="reset" class="btn btn-ghost">reset</button>
  </div>
  <div v-if="cleared" class="my-4 text-center text-success text-xl">
    Clear!!
  </div>
  <div class="overflow-auto">
    <div class="mx-auto my-6 px-6" :style="`width: calc(${size} * 3rem + 3rem);`">
      <div class="flex flex-wrap justify-center">
        <Triangle v-for="_, i in Array(size ** 2)" :n="i + 1" />
      </div>
    </div>
  </div>
</template>
