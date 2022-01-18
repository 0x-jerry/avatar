<script lang="ts" setup>
import {
  reactive,
  ref,
  computed,
  resolveComponent,
  onMounted,
  nextTick
} from 'vue'
import { saveAs } from 'file-saver'
import html2canvas from 'html2canvas'

const data = reactive({
  size: 400,
  avatar: ''
})

const tools = reactive({
  showSubLine: true
})

const colors = reactive({
  d: '#e72c83',
  r: '#f52a48',
  e: '#ffc929',
  a: '#9fe123',
  m: '#0f93ff'
})

const keys: (keyof typeof colors)[] = Object.keys(colors) as any

const avatarStyle = computed(() => {
  return {
    width: `${data.size}px`,
    height: `${data.size}px`
  }
})

const rootEl = ref<HTMLDivElement>()

async function download() {
  if (!rootEl.value) return

  const blob = await getAvatarImage(rootEl.value)
  saveAs(blob, 'avatar.png')
}

onMounted(() => updateCanvas())

async function updateCanvas() {
  if (!rootEl.value) return

  const blob = await getAvatarImage(rootEl.value)
  data.avatar = URL.createObjectURL(blob)
}

async function getAvatarImage(el: HTMLElement) {
  const canvas = await html2canvas(el)

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject()
        return
      }

      resolve(blob)
    })
  })
}
</script>

<template>
  <div flex="~" justify="center" align="items-center" m="y-6" grid="gap-x-6">
    <div class="relative">
      <div ref="rootEl">
        <div class="relative" :style="avatarStyle" overflow="hidden">
          <div class="avatar-bg" w="full" h="full"></div>
          <div
            class="text-dream absolute top-0 left-0"
            flex="~"
            w="full"
            h="full"
            justify="center"
            align="items-center"
            z="10"
          >
            <span class="D" :style="{ color: colors.d }">D</span>
            <span
              class="R"
              :style="{ color: colors.r }"
              transform="~ translate-x-1"
              >R</span
            >
            <span
              class="E"
              :style="{ color: colors.e }"
              transform="~ translate-x-1"
              >E</span
            >
            <span
              class="A"
              :style="{ color: colors.a }"
              transform="~ translate-x-2"
              >A</span
            >
            <span class="M" :style="{ color: colors.m }">M</span>
          </div>
        </div>
      </div>

      <div
        v-if="tools.showSubLine"
        class="sub-line absolute top-0 left-0"
        w="full"
        h="full"
        z="100"
        pointer="none"
      >
        <div
          class="absolute top-0 left-0"
          w="9/10"
          h="9/10"
          border="~ solid gray-300"
          m="1/20"
        ></div>
        <div
          class="absolute top-0 left-0"
          w="full"
          h="full"
          border="~ solid gray-300 rounded-full"
        ></div>
      </div>
    </div>

    <img w="200px" h="200px" :src="data.avatar" border="rounded-lg" />
    <img w="100px" h="100px" :src="data.avatar" border="rounded-3xl" />

    <img w="50px" h="50px" :src="data.avatar" border="rounded-full" />
  </div>

  <div flex="~" grid="gap-2" justify="center" align="items-center" m="b-4">
    <button class="btn" @click="tools.showSubLine = !tools.showSubLine">
      Toggle subline
    </button>
    <button class="btn" @click="download">Download</button>

    <button class="btn" @click="updateCanvas">Update</button>
  </div>

  <div flex="~" justify="center" align="items-center">
    <template v-for="o in keys">
      <input type="color" v-model="colors[o]" />
      <span m="x-2">{{ colors[o] }}</span>
    </template>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Reenie+Beanie&display=swap');
</style>

<style lang="less">
.text-dream {
  font-family: 'Reenie Beanie', cursive;

  font-size: 190px;
  letter-spacing: -0.13em;
}

.avatar-bg {
  // border: 1px solid rgb(221, 221, 221);
  @color1: hsl(156, 100%, 90%);
  @color2: hsl(199, 100%, 90%);

  @break-point: 16%;

  background: linear-gradient(
    120deg,
    @color1,
    @color1 @break-point,
    @color2 @break-point,
    @color2 100%
  );
}

html,
body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.btn {
  @apply bg-light-500 hover:bg-light-900;
  @apply px-1;
}
</style>
