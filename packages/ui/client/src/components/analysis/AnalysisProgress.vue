<template>
  <div class="flex flex-col mx-auto space-y-5 text-lg w-max">
    <div class="mt-3 text-xl txt-light" v-if="step < 3">Analyzing project...</div>
    <div class="flex flex-col space-y-1">
      <div class="flex flex-row items-center pt-3 space-x-2 text-xl">
        <div class="text-sm txt-format">
          <i-material-symbols:circle></i-material-symbols:circle>
        </div>
        <div>Formatting</div>
        <div v-if="step >= 1" class="text-2xl font-bold txt-success">
          <i-material-symbols:check></i-material-symbols:check>
        </div>
      </div>
      <div class="py-8" v-if="step < 1">
        <loading-indicator class="text-8xl txt-lighter"></loading-indicator>
      </div>
    </div>
    <div class="flex flex-col space-y-1">
      <div class="flex flex-row items-center space-x-1">
        <div class="text-sm txt-codestyle">
          <i-material-symbols:circle></i-material-symbols:circle>
        </div>
        <div>Codestype</div>
        <div v-if="step > 1" class="text-2xl font-bold txt-success">
          <i-material-symbols:check></i-material-symbols:check>
        </div>
      </div>
      <div class="py-8" v-if="step == 1">
        <loading-indicator class="text-8xl txt-lighter"></loading-indicator>
      </div>
    </div>
    <div class="flex flex-col space-y-1">
      <div class="flex flex-row items-center space-x-1">
        <div class="text-sm txt-typing">
          <i-material-symbols:circle></i-material-symbols:circle>
        </div>
        <div>Typing</div>
      </div>
      <div class="flex flex-col pt-3 pb-8 ml-5 space-y-3" v-if="step == 2">
        <div v-for="(loc, i) of analyze.state.typingProgress">
          <span v-if="(i + 1) == analyze.state.typingProgress.length" class="txt-warning">
            <i-teenyicons:folder-outline></i-teenyicons:folder-outline>
          </span>
          <span v-else class="txt-success">
            <i-teenyicons:folder-tick-outline></i-teenyicons:folder-tick-outline>
          </span>
          <span class="ml-3">{{ loc }}</span>
        </div>
        <loading-indicator class="pt-5 text-8xl txt-lighter"></loading-indicator>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import LoadingIndicator from '@/widgets/LoadingIndicator.vue';
import { analyze } from '@/state';

defineProps({
  step: {
    type: Number,
    required: true,
  }
})
</script>