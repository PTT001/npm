<script setup>
import scanFrame from '../assets/Rectangle.png'
import { onMounted, onUnmounted } from 'vue'
import router from '../router'

//safari 100vh
const setViewportHeight = () => {
  const vh = window.innerHeight
  document.documentElement.style.setProperty('--adjusted-vh', `${vh}px`)
}

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

const GoToInfoList = () => {
  router.push(`/InfoList`)
}

onMounted(() => {
  setViewportHeight()
  init()
})

onUnmounted(() => {
  clearInterval(classifyInterval)
})
</script>

<template>
  <div class="relative w-screen h-screen text-white overflow-hidden section0">
    <!-- Webcam -->
    <div class="video-container">
      <video id="webcam-video" autoplay muted playsinline></video>
    </div>

    <div id="label-container"></div>

    <!-- 掃描框圖層 -->
    <img
      :src="scanFrame"
      alt="scanner-frame"
      class="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-57 h-57 z-10 pointer-events-none"
    />

    <!-- 提示文字 -->
    <!-- <div class="absolute w-full text-center text-lg z-20">請將鏡頭對準展品</div> -->

    <!-- 關閉按鈕 -->
    <button class="absolute top-5 left-5 text-3xl z-20" @click="GoToInfoList">
      ×
    </button>
  </div>
</template>

<style scoped>
:root {
  --adjusted-vh: 100vh;
}

.section0 {
  height: var(--adjusted-vh);
  width: 100vw;
  overflow: hidden;
}

.video-container {
  width: 100vw;
  height: var(--adjusted-vh);
  position: relative;
}

#webcam-video {
  width: 100vw;
  height: var(--adjusted-vh);
  object-fit: cover; /* 確保影片填滿容器，裁剪多餘部分 */
  position: absolute;
  top: 0;
  left: 0;
}

/* Label container */
#label-container {
  position: absolute;
  top: 10px;
  left: 10px;
  font-size: 10px;
  color: white;
  background-color: #00000091;
}
</style>
