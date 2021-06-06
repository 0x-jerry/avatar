<template>
  <div class="canvas">
    <canvas ref="cc" width="600" height="400"></canvas>
  </div>
  <br />
  <label class="pl-5">
    <span>width: </span>
    <input type="number" v-model="data.width" />
  </label>
  <label class="pl-5">
    <span>height: </span>
    <input type="number" v-model="data.height" />
  </label>

  <button @click="generateImg" class="pl-5">generate</button>
  <button @click="download" class="pl-5">download</button>
</template>

<script lang="ts" setup>
import { Canvg } from 'canvg'
import { reactive, ref } from '@vue/reactivity'
import { onMounted } from '@vue/runtime-core'
import { saveAs } from 'file-saver'

const data = reactive({
  width: 350,
  height: 350,
  src: ''
})

const cc = ref<HTMLCanvasElement | null>(null)

onMounted(async () => {
  const url = new URL(location.href)
  const size = url.searchParams.get('size')

  if (size) {
    const [w, h] = size.split('x')

    data.width = parseInt(w) || data.width
    data.height = parseInt(h) || data.width || data.height
  }

  await generateImg()

  if (url.searchParams.get('d')) {
    download()
  }
})

async function generateImg() {
  const canvas = cc.value
  if (!canvas) {
    return
  }

  const n = new URL(location.href).searchParams.get('n') || 'style-1'
  const svgFile = `./images/${n}.svg`

  const ctx = canvas.getContext('2d')!
  const v = await Canvg.from(ctx, svgFile)

  v.resize(data.width, data.height, 'xMidYMid meet')

  // Render only first frame, ignoring animations and mouse.
  await v.render()
}

function download() {
  cc.value?.toBlob(function (blob) {
    saveAs(blob!, 'avatar.png')
  })
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.canvas {
  height: 600px;
  overflow: auto;
}

canvas {
  border: 1px solid gray;
}

.pl-5 {
  margin-left: 5px;
}
</style>
