<template>
  <div :class="line.isStatic ? 'txt-light' : ''">
    <div v-if="line.text.length > 0" v-html="line.text"></div>
    <div v-else>
      <span :class="statusClass(line.status)">{{ line.status }}</span>
      <span class="ml-1 font-semibold txt-light">{{ line.method }}</span>
      {{ line.url }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ServerLogLine } from '@/interfaces';

defineProps({
  line: {
    type: Object as () => ServerLogLine,
    required: true,
  }
});

function statusClass(s: number): Array<string> {
  const cls = new Array<string>("font-semibold");
  if (s == 200) {
    cls.push("txt-success");
  } else if ([404].includes(s)) {
    cls.push("txt-warning");
  } else if ([401, 403, 500].includes(s)) {
    cls.push("txt-danger");
  }
  return cls;
}
</script>