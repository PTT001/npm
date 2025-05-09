<script setup>
import { RouterView } from 'vue-router'
import { ref, onMounted } from 'vue'

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

const init = async () => {
  const config = await loadConfigFromS3()
  await TensorFlowInit(config)
  loadRules(config.rules)
}

onMounted(async () => {
  init()

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
  <RouterView />
</template>

<style>
html,
body {
  touch-action: none;

  font-family: 'Noto Serif TC', serif;
  font-optical-sizing: auto; /* 保持光學尺寸調整 */
  font-weight: 400; /* 設定一個預設字重，例如 Regular 400 */
  font-style: normal;
  -webkit-font-smoothing: antialiased; /* 改善字體渲染 (macOS/iOS) */
  -moz-osx-font-smoothing: grayscale; /* 改善字體渲染 (Firefox on macOS) */
}
</style>
