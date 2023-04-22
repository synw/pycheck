<template>
  <div>
    <div class="mb-3 text-2xl">Python env</div>
    <div class="mt-5 text-5xl">{{ state.project.pythonVersion }}</div>
    <div class="mt-5">{{ pythonPath() }}</div>
  </div>
</template>

<script setup lang="ts">
import { state } from '@/state';

function pythonPath() {
  if (state.project.pythonPath == "python3") {
    return "No virtualenv found, using system python3"
  }
  //return state.project.relativePythonPath;

}
</script>