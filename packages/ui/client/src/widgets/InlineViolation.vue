<template>
  <div>
    <div v-if="hasMajorViolations" class="mb-2">
      <button class="flex flex-row items-center py-0 tracking-normal btn w-max" @click="collapse = !collapse">
        <div>{{ name.replace(state.project.path + '/', '') }}</div>
        <div v-if="hasPyrightViolations" class="inline-block ml-2">
          <div class="flex items-center justify-center w-6 h-6 rounded-full typing">{{ file.pyrightErrors.length }}
          </div>
        </div>
        <div v-if="hasFlakeViolations" class="inline-block ml-2">
          <div class="flex items-center justify-center w-6 h-6 rounded-full codestyle">{{ file.flake8Violations.length }}
          </div>
        </div>
        <div v-if="hasBlackViolations" class="inline-block ml-2">
          <div class="flex items-center justify-center w-6 h-6 rounded-full format">B</div>
        </div>
      </button>
      <div :class="{
        'slide-y': true,
        'slideup': collapse === true,
        'slidedown': collapse === false
      }" class="ml-8">
        <template v-if="hasPyrightViolations">
          <div v-for="vio in file.pyrightErrors" class="flex flex-row pt-2 cursor-pointer">
            <div class="mr-1 text-sm txt-typing">
              <i-material-symbols:circle></i-material-symbols:circle>
            </div>
            <div @click="openFile(file.filepath, vio.endLine)">
              Line <span class="font-bold">{{ vio.startLine }}</span>: {{ vio.message }}
              <span v-if="vio.rule != 'unknown'" class="txt-light">({{ vio.rule }})</span>
              <span v-if="vio.severity != 'error'"> - {{ vio.severity }}</span>
            </div>
          </div>
        </template>
        <template v-if="hasFlakeViolations">
          <div v-for="vio in file.flake8Violations" class="flex flex-row pt-2 cursor-pointer">
            <div class="mr-1 text-sm txt-codestyle">
              <i-material-symbols:circle></i-material-symbols:circle>
            </div>
            <div @click="openFile(file.filepath, vio.line)">
              Line <span class="font-bold">{{ vio.line }}</span>: <span
                class="font-semibold txt-light">{{ vio.code }}</span>
              {{ vio.message }}
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { PyCheckFileReport } from '@/interfaces';
import { state } from '@/state';
import { openFile } from "@/api"

const props = defineProps({
  file: {
    type: Object as () => PyCheckFileReport,
    required: true
  },
  name: {
    type: String,
    required: true
  }
});

const collapse = ref(true);
const hasFlakeViolations = props.file.flake8Violations.length > 0;
const hasBlackViolations = props.file.blackViolations;
const hasPyrightViolations = props.file.pyrightErrors.length > 0;
const hasMajorViolations = hasFlakeViolations || hasBlackViolations || hasPyrightViolations;
</script>