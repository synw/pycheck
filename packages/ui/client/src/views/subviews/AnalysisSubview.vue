<template>
  <div class="w-full">
    <template v-if="state.isReady">
      <!-- div class="mb-3 text-2xl txt-neutral">
        <i-icon-park-outline:analysis class="mr-2"></i-icon-park-outline:analysis>Analysis
      </div -->
      <div class="flex flex-row space-x-3">
        <div class="flex flex-col">
          <score-card label="Formating" :total="10" :score="analyze.formattingScore.score"
            :color="analyze.formattingColorCode.value">
            <div id="formatLine" v-show="analyze.formattingScore.score > 0"></div>
          </score-card>
        </div>
        <score-card label="Codestyle" :total="60" :score="analyze.codestyleScore.score"
          :color="analyze.codestyleColorCode.value">
          <div id="codestyleLine" v-show="analyze.codestyleScore.score > 0"></div>
        </score-card>
        <score-card label="Typing" :total="30" :score="analyze.typingScore.score" :color="analyze.typingColorCode.value">
          <div id="typingLine" v-show="analyze.typingScore.score > 0"></div>
        </score-card>
      </div>
      <div v-if="analyze.state.analysisStep.step == 0"></div>
      <div v-else-if="analyze.state.analysisStep.step == 3">
        <analysis-results></analysis-results>
      </div>
      <div v-else class="mt-8">
        <analysis-progress :step="analyze.state.analysisStep.step"></analysis-progress>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { watch, onMounted } from 'vue';
import Sparkline from 'sparklines';
import AnalysisProgress from "@/components/analysis/AnalysisProgress.vue";
import ScoreCard from '@/widgets/ScoreCard.vue';
import AnalysisResults from '@/components/analysis/AnalysisResults.vue';
import { state, analyze } from '@/state';

function initLines() {
  const spScore = new Sparkline(document.getElementById("formatLine"), {
    width: 100,
    height: 20,
    lineColor: state.history.formatting.length > 1 ? analyze.formattingColorCode.value : "transparent",
    endColor: state.history.formatting.length > 1 ? analyze.formattingColorCode.value : "transparent",
  });
  spScore.draw(state.history.formatting);
  const spScore2 = new Sparkline(document.getElementById("codestyleLine"), {
    width: 100,
    height: 20,
    lineColor: state.history.codestyle.length > 1 ? analyze.codestyleColorCode.value : "transparent",
    endColor: state.history.codestyle.length > 1 ? analyze.codestyleColorCode.value : "transparent",
  });
  spScore2.draw(state.history.codestyle);
  const spScore3 = new Sparkline(document.getElementById("typingLine"), {
    width: 100,
    height: 20,
    lineColor: state.history.typing.length > 1 ? analyze.typingColorCode.value : "transparent",
    endColor: state.history.typing.length > 1 ? analyze.typingColorCode.value : "transparent",
  });
  spScore3.draw(state.history.typing);
}

onMounted(() => initLines());

/*watch(() => analyze.state.isAnalyzing,
  () => {
    if (analyze.state.analysisStep.step == 1) {
      analyze.processFormatingResults(analyze.state.analysisStep.formattingScore);
    } else if (analyze.state.analysisStep.step == 2) {
      analyze.processCodestyleResults(analyze.state.analysisStep.codestyleScore);
    }
  });*/

watch(() => state.history,
  () => {
    console.log("Init lines");
    initLines()
  },
  { deep: true }
);
</script>