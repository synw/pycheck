<template>
  <div>
    <div class="mb-3 text-2xl">Pip packages</div>
    <ul class="border rounded-lg w-96 border-light dark:border-light-dark">
      <li v-for="(pythonPackage, i) in state.project.pythonPackages"
        class="flex flex-row w-full px-4 py-2 border-light dark:border-light-dark"
        :class="i == (state.project.pythonPackages.length - 1) ? '' : 'border-b'">
        <div class="flex-grow">{{ pythonPackage.pipName }}</div>
        <div>{{ pythonPackage.version }}</div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { state } from '@/state';
</script>