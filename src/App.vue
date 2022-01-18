<script lang="ts" setup>
import { reactive, ref, computed } from 'vue'
import { saveAs } from 'file-saver'
import html2canvas from 'html2canvas'

const data = reactive({
  size: 400,
})

const colors = reactive({
  d: '#e72c83',
  r: '#f52a48',
  e: '#edc13e',
  a: '#a7da49',
  m: '#0f93ff',
  bg: '#d7e4ee',
})

const keys: (keyof typeof colors)[] = Object.keys(colors) as any

const avatarStyle = computed(() => {
  return {
    width: `${data.size}px`,
    height: `${data.size}px`,
  }
})

const rootEl = ref<HTMLDivElement>()

async function download() {
  if (!rootEl.value) return

  const canvas = await html2canvas(rootEl.value)

  // document.body.appendChild(canvas)
  canvas.toBlob((blob) => {
    if (!blob) return

    saveAs(blob, 'avatar.png')
  })
}
</script>

<template>
  <div id="avatar" :style="avatarStyle" ref="rootEl">
    <p class="text-dream">
      <span class="D">D</span>
      <span class="R">R</span>
      <span class="E">E</span>
      <span class="A">A</span>
      <span class="M">M</span>
    </p>
  </div>
  <div flex="~" justify="center" align="items-center">
    <template v-for="o in keys">
      <input type="color" v-model="colors[o]" />
      <span m="x-2">{{ colors[o] }}</span>
    </template>

    <button @click="download">Download</button>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Reenie+Beanie&display=swap');
/* @import url('https://fonts.googleapis.com/css2?family=Shadows+Into+Light&display=swap'); */
</style>

<style lang="less">
.text-dream {
  font-family: 'Reenie Beanie', cursive;
  // font-family: 'Shadows Into Light', cursive;

  font-size: 180px;
  letter-spacing: -0.1em;

  .D {
    color: v-bind('colors.d');
  }
  .R {
    color: v-bind('colors.r');
  }
  .E {
    color: v-bind('colors.e');
  }
  .A {
    color: v-bind('colors.a');
  }
  .M {
    color: v-bind('colors.m');
  }
}

#avatar {

  overflow: hidden;
  margin: 50px auto;

  display: flex;
  justify-content: center;
  align-items: center;

  border: 1px solid rgb(221, 221, 221);
  background: v-bind('colors.bg');
}

html,
body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
</style>
