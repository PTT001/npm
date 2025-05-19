<script setup>
import { RouterView } from 'vue-router'
import { ref, onMounted } from 'vue'
import store from '../store'
import axios from 'axios'

onMounted(async () => {
  store.data = (await axios.get('./Home.json')).data
  store.info = (await axios.get('./Info.json')).data

  try {
    const model = await tf.loadLayersModel(
      'https://arplanets.s3.ap-southeast-1.amazonaws.com/frontend-test/CY_JSON/20250411/model.json'
    )
    globalThis.myTfModel = model
    console.log('模型已預載完成')
  } catch (error) {
    console.error('模型載入失敗', error)
  }
  // const images = import.meta.glob('@/assets/**/*.{png,svg}', { eager: false })
  // const preloadImages = async () => {
  //   const loadPromises = Object.values(images).map(loadImage =>
  //     loadImage().then(module => {
  //       const img = new Image()
  //       img.src = module.default
  //       return new Promise(resolve => (img.onload = resolve))
  //     })
  //   )
  //   await Promise.all(loadPromises)
  //   console.log('所有圖片預載完成')
  // }
})
</script>

<template>
  <div class="section0">
    <RouterView />
  </div>
</template>

<style>
html,
body {
  /* touch-action: none; */
  font-family: 'Noto Serif TC', serif;
  font-optical-sizing: auto; /* 保持光學尺寸調整 */
  font-weight: 400; /* 設定一個預設字重，例如 Regular 400 */
  font-style: normal;
  -webkit-font-smoothing: antialiased; /* 改善字體渲染 (macOS/iOS) */
  -moz-osx-font-smoothing: grayscale; /* 改善字體渲染 (Firefox on macOS) */
}
</style>
