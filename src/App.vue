<script setup>
import { RouterView } from 'vue-router'
import { ref, onMounted } from 'vue'
import store from '../store'
import axios from 'axios'

const isLoading = ref(true) // 新增一個加載狀態

async function loadConfigFromS3() {
  const params = new URLSearchParams(window.location.search)
  const project = params.get('project')

  if (!project) {
    console.error('缺少 project 參數')
    return null
  }

  const s3Url = `https://arplanets.s3.ap-southeast-1.amazonaws.com/frontend-test/CY_JSON/20250411/${project}.json`

  try {
    const response = await fetch(s3Url)
    if (!response.ok) {
      throw new Error(`無法獲取 JSON: ${response.statusText}`)
    }
    return await response.json()
  } catch (error) {
    console.error('抓取 JSON 失敗:', error)
    return null
  }
}

onMounted(async () => {
  //初始化辨識buffer
  predictionBuffer = []

  try {
    store.config = await loadConfigFromS3()
    store.data = (await axios.get('./Home.json')).data
    store.info = (await axios.get('./Info.json')).data

    loadRules(store.config.rules)

    try {
      const model = await tf.loadLayersModel(
        'https://arplanets.s3.ap-southeast-1.amazonaws.com/frontend-test/CY_JSON/20250411/model.json'
      )
      globalThis.myTfModel = model
      console.log('模型已預載完成')
    } catch (error) {
      console.error('模型載入失敗', error)
    }
  } catch (error) {
    console.error('初始化 App.vue 數據失敗:', error)
    // 這裡可以處理加載失敗的情況，例如顯示錯誤訊息
  } finally {
    isLoading.value = false // 所有數據加載完成後，設置 isLoading 為 false
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
    <div
      v-if="isLoading"
      class="flex justify-center items-center min-h-screen bg-custom-bg"
    >
      <div
        class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"
      ></div>
    </div>
    <RouterView v-else />
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
