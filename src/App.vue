<template>
  <div class="canvas">
    <canvas ref="cc" width="600" height="400"></canvas>
  </div>
  <div class="list">
    <img src="images/style-1.svg" @click="changeName('style-1')" />
    <img src="images/style-2.svg" @click="changeName('style-2')" />
  </div>
  <label class="pl-5">
    <span>width: </span>
    <input type="number" v-model="data.width" />
  </label>

  <button @click="download" class="pl-5">download</button>
  <div hidden ref="hiddenDiv"></div>
</template>

<script lang="ts" setup>
import { reactive, ref } from '@vue/reactivity'
import { onMounted, watch } from '@vue/runtime-core'
import { saveAs } from 'file-saver'

const data = reactive({
  width: 470,
  name: 'style-1'
})

const hiddenDiv = ref<HTMLDivElement | null>(null)
const cc = ref<HTMLCanvasElement | null>(null)

onMounted(async () => {
  const url = new URL(location.href)
  const size = url.searchParams.get('size')
  const name = url.searchParams.get('name')

  if (name) {
    data.name = name
  }

  if (size) {
    data.width = parseInt(size) || data.width
  }

  await generateImg()

  if (url.searchParams.get('download')) {
    download()
  }
})

watch(
  () => [data.width, data.name],
  () => generateImg()
)

function changeName(n: string) {
  data.name = n
}

async function generateImg() {
  const canvas = cc.value
  if (!canvas) {
    return
  }

  const svgFile = `./images/${data.name}.svg`

  const img = new Image()

  return new Promise<void>(async (resolve, reject) => {
    const res = await fetch(svgFile)
    const svg = await res.text()
    hiddenDiv.value!.innerHTML = svg
    const svgEl = hiddenDiv.value!.querySelector('svg')
    svgEl?.setAttribute('width', data.width.toString())
    svgEl?.setAttribute('height', data.width.toString())

    const svgData = new XMLSerializer().serializeToString(svgEl!)
    const blob = new Blob([svgData], { type: 'image/svg+xml' })

    img.onload = () => {
      canvas.width = data.width
      canvas.height = data.width
      canvas.getContext('2d')!.drawImage(img, 0, 0)
      resolve()
    }

    img.onerror = (e) => {
      reject(new Error('Render failed!: ' + e))
    }

    img.src = window.URL.createObjectURL(blob)
  })
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
  height: 500px;
  overflow: auto;
  border-bottom: 1px solid gray;
}

canvas {
  border: 1px solid gray;
}

.list {
  height: 100px;
  margin: 10px 0;
}

.list img {
  width: 100px;
  height: 100px;
  margin-right: 10px;
  cursor: pointer;
}

.pl-5 {
  margin-left: 5px;
}
</style>
