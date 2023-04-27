<template>
  <div>
    <div class="flex flex-row w-full h-full">
      <div class="flex flex-col items-center flex-shrink-0 w-32 h-full txt-neutral">
        <div v-if="subviews.isVisible('Files')" :class="subviews.isActive('Files') ? '' : 'txt-light'"
          class="flex flex-col items-center mt-8" @click="activateView('Files')">
          <div class="mr-2 text-5xl">
            <i-ph:files></i-ph:files>
          </div>
          <div class="mt-2 text-lg">Files</div>
        </div>
        <div v-if="subviews.isVisible('Formating')" class="flex flex-col items-center mt-8"
          :class="subviews.isActive('Formating') ? '' : 'txt-light'" @click="activateView('Formating')">
          <div>
            <i-ic:sharp-format-indent-decrease class="mr-2 text-4xl"></i-ic:sharp-format-indent-decrease>
          </div>
          <div class="mt-2 text-lg">Formatting</div>
        </div>
        <div v-if="subviews.isVisible('Codestyle')" class="flex flex-col items-center mt-8"
          :class="subviews.isActive('Codestyle') ? '' : 'txt-light'" @click="activateView('Codestyle')">
          <div>
            <i-fluent:clipboard-code-24-regular class="mr-2 text-5xl"></i-fluent:clipboard-code-24-regular>
          </div>
          <div class="mt-2 text-lg">Codestyle</div>
        </div>
        <div v-if="subviews.isVisible('Typing')" class="flex flex-col items-center mt-8"
          :class="subviews.isActive('Typing') ? '' : 'txt-light'" @click="activateView('Typing')">
          <div>
            <i-simple-icons:adguard class="mr-2 text-4xl"></i-simple-icons:adguard>
          </div>
          <div class="mt-2 text-lg">Typing</div>
        </div>
      </div>
      <div class="flex-grow mt-8">
        <component :is="subviews.component"></component>
      </div>
    </div>
    <div v-if="is100" class="flex justify-around w-full h-full mt-8 p8 text-gray-50" style="font-size:18rem">
      <i-icon-park-outline:folder-success></i-icon-park-outline:folder-success>
    </div>
  </div>
</template>

<script setup lang="ts">
import CodestyleSubview from './subviews/CodestyleSubview.vue';
import FormatingSubview from './subviews/FormatingSubview.vue';
import TypingSubview from './subviews/TypingSubview.vue';
import SubViews from '@/packages/tabs/models/subviews';
import FilesSubview from './subviews/FilesSubview.vue';
import { computed, onBeforeMount } from 'vue';
import { state } from '@/state';
import { AnalysisViewsType } from '@/interfaces';

const views = {
  "Files": FilesSubview,
  "Formating": FormatingSubview,
  "Codestyle": CodestyleSubview,
  "Typing": TypingSubview,
};
const subviews = new SubViews<AnalysisViewsType>({
  views: views,
  onViewChange: (v: AnalysisViewsType) => { },
});

function activateView(view: AnalysisViewsType) {
  if (!subviews.isActive(view)) {
    subviews.activate(view)
  }
}

const is100 = computed<boolean>(() => (state.report.typingScore + state.report.formattingScore + state.report.codestyleScore) == 100);

onBeforeMount(() => {
  if (state.report.formattingScore == 10) {
    subviews.hide("Formating")
  }
  if (state.report.codestyleScore == 60) {
    subviews.hide("Codestyle")
  }
  if (state.report.typingScore == 30) {
    subviews.hide("Typing")
  }
  if (is100.value) {
    subviews.hide("Files")
  }
})
</script>