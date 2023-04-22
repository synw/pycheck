<template>
  <div class="flex flex-col">
    <template v-for="[name, file] in Object.entries(files)">
      <inline-violation :file="file" :name="name"></inline-violation>
    </template>
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import { PyCheckFileReport, AnalysisViewsType } from '@/interfaces';
import { state } from '@/state';
import InlineViolation from '@/widgets/InlineViolation.vue';

const props = defineProps({
  view: {
    type: String as () => AnalysisViewsType,
    default: "Files"
  }
})

const files = ref<Record<string, PyCheckFileReport>>({});

function filter(view: AnalysisViewsType) {
  const res: Record<string, PyCheckFileReport> = {};
  for (const [name, report] of Object.entries(state.report.files)) {
    switch (view) {
      case "Formating":
        //console.log(name, report, report.blackViolations.length)
        if (report.blackViolations) {
          res[name] = report
        }
        break;
      case "Codestyle":
        if (report.flake8Violations.length > 0) {
          res[name] = report
        }
        break;
      case "Typing":
        if (report.pyrightErrors.length > 0) {
          res[name] = report
        }
    }
  }
  files.value = res
}

function init() {
  files.value = state.report.files;
  if (props.view != "Files") {
    filter(props.view)
  }
}

onBeforeMount(() => init())
</script>