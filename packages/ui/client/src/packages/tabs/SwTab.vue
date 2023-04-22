<template>
  <div
    class="px-4 py-2 border border-l-0 cursor-pointer border-light dark:border-light-dark"
    :class="isActive ?
    ['border-b-0 border-light dark:border-light-dark cursor-auto text-foreground dark:text-foreground-dark']
    : ['txt-neutral']"
  >
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
defineProps({
  isActive: {
    type: Boolean,
    required: true,
  }
});
</script>