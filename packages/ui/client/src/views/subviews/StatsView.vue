<template>
  <div class="flex flex-col space-y-3">
    <div class="text-2xl">Score</div>
    <div id="score"></div>
    <div class="text-lg">Codestyle</div>
    <div id="codestyle"></div>
    <div class="text-lg">Typing</div>
    <div id="typing"></div>
    <div class="text-lg">Formatting</div>
    <div id="format"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import embed from "vega-embed";
import scoreChart from "@/assets/charts/score.json";
import formatChart from "@/assets/charts/format.json";
import codestyleChart from "@/assets/charts/codestyle.json";
import typingChart from "@/assets/charts/typing.json";
import { state } from "@/state";

async function init() {
  scoreChart.datasets["data-f0667bcdba1e8aa38318ba8467536695"] = state.rawHistory;
  // @ts-ignore
  await embed("#score", scoreChart, { actions: false });
  formatChart.datasets["data-f0667bcdba1e8aa38318ba8467536697"] = state.rawHistory;
  // @ts-ignore
  await embed("#format", formatChart, { actions: false });
  codestyleChart.datasets["data-f0667bcdba1e8aa38318ba8467536696"] = state.rawHistory;
  // @ts-ignore
  await embed("#codestyle", codestyleChart, { actions: false });
  typingChart.datasets["data-f0667bcdba1e8aa38318ba8467536698"] = state.rawHistory;
  // @ts-ignore
  await embed("#typing", typingChart, { actions: false });
}

onMounted(() => init())

</script>