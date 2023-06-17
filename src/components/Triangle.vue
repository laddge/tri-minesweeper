<script setup lang="ts">
  import { useStateStore } from '@/stores/state'
  import { storeToRefs } from 'pinia'

  const { n } = defineProps<{ n: number }>()
  const k = Math.ceil(n ** .5)
  const store = useStateStore()
  const { mines, open, flagged, failed } = storeToRefs(store)
  const { getAdjacent, click } = store
  const adjacent = getAdjacent(n)

  const action = () => {
    if (failed.value) return
    click(n)
  }
</script>

<template>
  <div class="w-6 h-[2.598rem]">
    <div class="w-12 h-full relative">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0, 0, 200, 173.2" v-if="failed && mines.includes(n)" class="w-full h-full absolute top-0 left-0 fill-error stroke-[5px] stroke-base-content">
        <polygon points="100 0, 0 173.2, 200 173.2" v-if="(k ** 2 - n) % 2 == 0" />
        <polygon points="0 0, 100 173.2, 200 0" v-else />
      </svg>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0, 0, 200, 173.2" v-else-if="open.includes(n)" class="w-full h-full absolute top-0 left-0 fill-base-200 stroke-[5px] stroke-base-content">
        <polygon points="100 0, 0 173.2, 200 173.2" v-if="(k ** 2 - n) % 2 == 0" />
        <polygon points="0 0, 100 173.2, 200 0" v-else />
      </svg>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0, 0, 200, 173.2" v-else-if="flagged.includes(n)" class="w-full h-full absolute top-0 left-0 fill-warning stroke-[5px] stroke-base-content">
        <polygon points="100 0, 0 173.2, 200 173.2" v-if="(k ** 2 - n) % 2 == 0" @click="action" />
        <polygon points="0 0, 100 173.2, 200 0" v-else @click="action" />
      </svg>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0, 0, 200, 173.2" v-else class="w-full h-full absolute top-0 left-0 fill-primary/50 stroke-[5px] stroke-base-content">
        <polygon points="100 0, 0 173.2, 200 173.2" v-if="(k ** 2 - n) % 2 == 0" @click="action" />
        <polygon points="0 0, 100 173.2, 200 0" v-else @click="action" />
      </svg>
      <div class="w-full h-q/2 absolute top-[0.8rem] left-0 text-center" v-if="(k ** 2 - n) % 2 == 0">
        <span v-if="failed && mines.includes(n)" class="text-error-content">
          x
        </span>
        <span v-else-if="open.includes(n)">
          {{ Array.from(new Set([...mines, ...adjacent].filter(item => mines.includes(item) && adjacent.includes(item)))).length || '' }}
        </span>
        <span v-else-if="flagged.includes(n)" class="text-warning-content">
          F
        </span>
      </div>
      <div class="w-full h-q/2 absolute bottom-[0.8rem] left-0 text-center" v-else>
        <span v-if="failed && mines.includes(n)" class="text-error-content">
          x
        </span>
        <span v-else-if="open.includes(n)">
          {{ Array.from(new Set([...mines, ...adjacent].filter(item => mines.includes(item) && adjacent.includes(item)))).length || '' }}
        </span>
        <span v-else-if="flagged.includes(n)" class="text-warning-content">
          F
        </span>
      </div>
    </div>
  </div>
  <template v-if="Number.isInteger(n ** .5)">
    <div class="w-6" />
    <div class="w-full" />
  </template>
</template>
