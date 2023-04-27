<template>
  <div class="flex flex-row">
    <sw-tab v-for="view in subviews.visibleViews.value" :subviews="subviews" :is-active="subviews.active.value == view"
      class="px-4 py-2 border border-l-0 cursor-pointer bord-lighter" :class="subviews.active.value == view ?
          ['border-b-0 bord-lighter cursor-auto text-foreground dark:text-foreground-dark']
          : ['txt-neutral']" @click="activate(view)">
      <template v-if="view == 'Analysis'">
        <div class="flex flex-row items-center">
          <div>
            <i-icon-park-outline:analysis class="mr-2"
              :class="subviews.isActive('Analysis') ? '' : 'txt-lighter'"></i-icon-park-outline:analysis>
          </div>
          <div :class="subviews.isActive('Analysis') ? '' : 'txt-light'">{{ view }}</div>
        </div>
      </template>
      <template v-else-if="view == 'History'">
        <div class="flex flex-row items-center">
          <div>
            <i-clarity:dashboard-outline-badged class="mt-1 mr-2 text-lg"
              :class="subviews.isActive('History') ? 'txt-light' : 'txt-lighter'"></i-clarity:dashboard-outline-badged>
          </div>
          <div :class="subviews.isActive('History') ? '' : 'txt-light'">{{ view }}</div>
        </div>
      </template>
      <template v-else-if="view == 'Infos'">
        <div class="flex flex-row items-center">
          <div>
            <i-icomoon-free:info class="mt-1 mr-2 text-lg"
              :class="subviews.isActive('Infos') ? 'txt-light' : 'txt-lighter'"></i-icomoon-free:info>
          </div>
          <div :class="subviews.isActive('Infos') ? '' : 'txt-light'">{{ view }}</div>
        </div>
      </template>
      <template v-else>{{ view }}</template>
    </sw-tab>
    <div class="flex flex-row items-center justify-end flex-grow h-full border-b bord-lighter txt-light ">
      <div>
        <button class="text-sm btn hover:lighter" @click="_runAnalysis()" :disabled="analyze.state.isAnalyzing">
          <i-material-symbols:play-arrow-outline class="text-2xl"
            v-if="!analyze.state.isAnalyzing"></i-material-symbols:play-arrow-outline><i-eos-icons:loading
            class="text-lg " v-else></i-eos-icons:loading>&nbsp;Run
          analysis
        </button>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import SubViews from '../packages/tabs//models/subviews';
import SwTab from '../packages/tabs/SwTab.vue';
import { subviews, analyze } from "@/state";
import { ViewsType } from "@/interfaces";
import { runAnalysis } from '@/api';

const props = defineProps({
  subviews: {
    type: SubViews as unknown as () => SubViews<ViewsType>,
    required: true,
  }
});

function activate(v: ViewsType) {
  if (v !== props.subviews.active.value) {
    props.subviews.activate(v);
  }
}

function _runAnalysis() {
  runAnalysis();
  subviews.activate("Analysis")
}

function openProjectInEditor() {
  //api.openInEditor(project.path.value, editorPath.value, (msg) => console.log("CBmsg", msg))
}
</script>