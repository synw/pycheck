<template>
  <div class="">
    <div class="flex flex-col p-3 h-[calc(100%_-_2.5rem)]">
      <div class="flex flex-row items-center space-x-2 items">
        <div class="mr-2 truncate max-w-[14rem] text-xl font-semibold capitalize">
          {{ state.project.title }}&nbsp;</div>
        <div class="text-2xl font-extrabold">
          <span v-if="!analyze.state.isAnalyzing" :class="analyze.scoreCss.value">{{ analyze.score }}</span>
          <span class="txt-lighter" v-else>-</span>
        </div>
      </div>
      <div class="flex flex-col pt-3 mt-1">
        <template v-if="state.isReady">
          <!-- div><span class="txt-light">Score</span>: <span class="font-extrabold"
            :class="analyze.scoreCss.value">{{ analyze.score }}</span></div -->
          <div class="flex flex-col p-3 space-y-2 border rounded-sm shadow">
            <div class="flex flex-row items-center space-x-2">
              <div class="text-sm txt-format" v-if="analyze.formattingScore.score != 10">
                <i-material-symbols:circle></i-material-symbols:circle>
              </div>
              <div v-else>
                <i-material-symbols:check></i-material-symbols:check>
              </div>
              <div class="txt-light">Formatting:</div>
              <div class="font-bold" :class="'txt-' + analyze.formattingScore.color">{{ analyze.formattingScore.score }}
              </div>
              <div>/ 10</div>
            </div>
            <div class="flex flex-row items-center space-x-2">
              <!-- div class="w-3 h-3 rounded-full codestyle"></div -->
              <div class="text-sm txt-codestyle" v-if="analyze.codestyleScore.score != 60">
                <i-material-symbols:circle></i-material-symbols:circle>
              </div>
              <div v-else>
                <i-material-symbols:check></i-material-symbols:check>
              </div>
              <div class="txt-light">Code style:</div>
              <div class="font-bold" :class="'txt-' + analyze.codestyleScore.color">{{ analyze.codestyleScore.score }}
              </div>
              <div>/ 60</div>
            </div>
            <div class="flex flex-row items-center space-x-2">
              <div class="text-sm txt-typing" v-if="analyze.typingScore.score != 30">
                <i-material-symbols:circle></i-material-symbols:circle>
              </div>
              <div v-else>
                <i-material-symbols:check></i-material-symbols:check>
              </div>
              <div class="txt-light">Typing:</div>
              <div class="font-bold" :class="'txt-' + analyze.typingScore.color">{{ analyze.typingScore.score }}</div>
              <div>/ 30</div>
            </div>
          </div>
          <div class="mt-5 text-sm txt-light">Last run: {{ analyze.lastRunStr }}</div>
          <div class="mt-2 text-sm txt-light">Last change: {{ analyze.lastChangeStr }}</div>
        </template>
        <template v-else>
          <div>Score: -</div>
          <div>Last run: -</div>
          <div>Last change: -</div>
        </template>
      </div>
    </div>
    <div
      class="flex flex-row items-center justify-center h-10 text-xl border-t cursor-pointer txt-lighter hover:txt-light"
      @click="toggle($event)">
      <i-material-symbols:settings-outline-rounded></i-material-symbols:settings-outline-rounded>&nbsp;<span
        class="text-lg">Settings</span>
    </div>
    <overlay-panel ref="op">
      <div class="p-3 w-[32rem] flex flex-col">
        <div class="text-xl">Editor command</div>
        <div class="flex flex-col mt-2 space-x-2">
          <InputText id="path" v-model="editorPath" aria-describedby="path-help" />
          <small id="path-help">The command to open files to a line in the code editor. Use the {filepath} and {line}
            masks. Examples:
            <ul class="list-disc list-inside">
              <li>Default: xdg-open {filepath}&nbsp;&nbsp;<span>
                  <button class="px-2 py-0 text-xs rounded-md btn lighter" @click="useX('xdg-open {filepath}')">Use
                    xdg-open</button>
                </span></li>
              <li>Vscode: code --goto {filepath}:{line}:0&nbsp;&nbsp;<span>
                  <button class="px-2 py-0 text-xs rounded-md btn lighter"
                    @click="useX('code --goto {filepath}:{line}:0')">Use
                    Vscode</button>
                </span></li>
            </ul>
          </small>
        </div>
        <!--div class="h-[0.10rem] lighter my-3"></div>
        <div class="pr-5 text-lg cursor-pointer" @click="user.toggleDarkMode()">
          <template v-if="!user.isDarkMode.value">
            <i-fa-solid:moon></i-fa-solid:moon>&nbsp;Toggle dark mode
          </template>
          <template v-else>
            <i-fa-solid:sun></i-fa-solid:sun>&nbsp;Toggle light mode
          </template>
        </div -->
      </div>
    </overlay-panel>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import OverlayPanel from 'primevue/overlaypanel';
import InputText from 'primevue/inputtext';
import { state, analyze, editorPath } from '@/state';

const op = ref();
//const editorPath = ref(null);

const toggle = (event) => {
  op.value.toggle(event);
}

function useX(cmd: string) {
  editorPath.value = cmd;
}
</script>