<template>
  <div>
    <div v-if="!state.isReady">
      <div v-for="line in stdout">{{ line }}</div>
    </div>
    <div v-else>
      <component :is="subviews.component"></component>
    </div>
  </div>
</template>

<script setup lang="ts">
import { state, subviews } from "@/state";
import { clearPrint, stdout } from "@/ws";
import { onBeforeMount } from "vue";

onBeforeMount(() => clearPrint())
</script>