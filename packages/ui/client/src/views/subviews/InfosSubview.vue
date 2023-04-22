<template>
  <div class="flex flex-row w-full h-full">
    <div class="flex flex-col items-center h-full space-y-8 w-36 txt-neutral">
      <div class="flex flex-col items-center" :class="subviews.isActive('Env') ? 'txt-primary' : ''"
        @click="activateView('Env')">
        <div class="mr-2 text-4xl">
          <i-logos:python v-if="subviews.isActive('Env')"></i-logos:python>
          <i-teenyicons:python-outline v-else></i-teenyicons:python-outline>
        </div>
        <div class="mt-2 text-lg">Python env</div>
      </div>
      <div class="flex flex-col items-center" :class="subviews.isActive('Pip') ? 'txt-primary' : ''"
        @click="activateView('Pip')" v-if="Object.keys(state.project.pipPackages).length > 0">
        <div>
          <i-cib:pypi class="mr-2 text-5xl"></i-cib:pypi>
        </div>
        <div class="mt-2 text-lg">Pip</div>
      </div>
    </div>
    <div class="h-full pl-3">
      <component :is="subviews.component"></component>
    </div>
  </div>
</template>

<script setup lang="ts">
import EnvTabSubview from './infos/EnvTabSubview.vue';
import PipTabSubview from './infos/PipTabSubview.vue';
import SubViews from '@/packages/tabs/models/subviews';
import { state } from '@/state';

type ViewsType = "Env" | "Pip";
const views = {
  "Env": EnvTabSubview,
  "Pip": PipTabSubview,
};
const subviews = new SubViews<ViewsType>({
  views: views,
  activeView: "Env",
  onViewChange: (v: ViewsType) => { },
});

function activateView(view: ViewsType) {
  if (!subviews.isActive(view)) {
    subviews.activate(view)
  }
}
</script>