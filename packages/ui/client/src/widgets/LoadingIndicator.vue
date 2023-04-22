<template>
  <div class="flex flex-col items-center justify-center w-full h-full">
    <div class="flex flex-col items-center">
      <div>
        <i-eos-icons:bubble-loading></i-eos-icons:bubble-loading>
      </div>
      <div v-if="text" class="mt-5 txt-neutral">{{ text }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  text: {
    type: String
  }
})
</script>