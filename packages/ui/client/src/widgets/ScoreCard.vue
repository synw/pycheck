<template>
  <div class="flex flex-row w-64 h-24 border shadow">
    <div class="flex items-center justify-center h-full text-3xl border-r basis-1/2 bg-slate-50 bord-lighter">
      <div v-if="total == 10">
        <div class="flex card justify-content-center">
          <Knob v-model="_score" valueTemplate="{value}%" :value-color="color" :size="80" disabled />
        </div>
        <!-- i-ic:sharp-format-indent-decrease class="text-3xl"></i-ic:sharp-format-indent-decrease -->
      </div>
      <div v-else-if="total == 60">
        <div class="flex card justify-content-center">
          <Knob v-model="_score" valueTemplate="{value}%" :value-color="color" :size="80" disabled />
        </div>
        <!-- i-fluent:clipboard-code-24-regular class="text-3xl"></i-fluent:clipboard-code-24-regular -->
      </div>
      <div v-else>
        <div class="flex card justify-content-center">
          <Knob v-model="_score" valueTemplate="{value}%" :value-color="color" :size="80" disabled />
        </div>
        <!-- i-simple-icons:adguard class="text-3xl"></i-simple-icons:adguard -->
      </div>
    </div>
    <div class="flex items-center justify-center h-full text-xl font-light basis-1/2">
      <div>
        <div>{{ label }}</div>
        <div class="font-bold" :class="score == 0 ? 'txt-light' : ''">
          {{ score }}
          /{{ total }}
        </div>
        <div>
          <slot></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import Knob from 'primevue/knob';

const props = defineProps({
  label: {
    type: String,
    required: true
  },
  total: {
    type: Number,
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  color: {
    type: String,
    required: true
  }
});

const _score = ref(0);

watchEffect(() => {
  //console.log("Score change");
  _score.value = Math.round((props.score * 100) / props.total);
})
</script>
