<template>
  <div>
    <div v-for="line in output">
      <server-log-line-display :line="line"></server-log-line-display>
    </div>
    <div id="endpage" ref="bottom"></div>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, watch } from 'vue';
import { ServerLogLine } from '@/interfaces';
import ServerLogLineDisplay from "@/widgets/ServerLogLineDisplay.vue";

const props = defineProps({
  output: {
    type: Array as () => Array<ServerLogLine>,
    required: true,
  }
});

function scrollDown() {
  nextTick(() => {
    const output = document.getElementById("router");
    const endpage = document.getElementById("endpage");
    if (output && endpage) {
      window.scrollTo(0, endpage.offsetTop)
    } else {
      throw new Error("No bottom or output")
    }
  })
}

onMounted(() => {
  scrollDown()
});

watch(props.output, (newValue, oldValue) => {
  //console.log("WE", newValue);
  scrollDown()
})
</script>