<template>
  <div class="flex flex-col min-h-screen background">
    <div class="absolute md:w-[calc(100%_-_20rem)] md:left-80">
      <the-tabsbar :subviews="subviews" class="fixed md:w-[calc(100%_-_20rem)] z-20 w-full h-10 background"></the-tabsbar>
      <div id="router" class="w-full h-full p-5 mt-12 mb-10 overflow-y-auto max-w-[82rem]">
        <router-view></router-view>
      </div>
    </div>
    <the-sidebar class="fixed left-0 hidden h-full overflow-y-auto border-r bord-lighter w-80 md:block"></the-sidebar>
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount } from 'vue';
import { subviews, initState } from "@/state";
import TheSidebar from './components/TheSidebar.vue';
import TheTabsbar from './components/TheTabsbar.vue';

onBeforeMount(() => initState())
</script>

<style lang="sass">
.p-accordion .p-accordion-header .p-accordion-header-link
  font-weight: 400 !important
.p-accordion-toggle-icon
  @apply txt-light
</style>
