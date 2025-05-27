<script setup>
import scanFrame from '../assets/Rectangle.png'
import { onMounted, onUnmounted, ref } from 'vue'
import router from '../router'
import store from '../../store'

const isLoading = ref(true) // 新增一個加載狀態

//safari 100vh
const setViewportHeight = () => {
  const vh = window.innerHeight
  document.documentElement.style.setProperty('--adjusted-vh', `${vh}px`)
}

const init = async () => {
  await TensorFlowInit(store.config)
}

const GoToInfoList = () => {
  router.push(`/InfoList`)
}

onMounted(async () => {
  setViewportHeight()
  try {
    await init()
  } catch (error) {
    console.log(error)
  } finally {
    isLoading.value = false
  }
})

onUnmounted(() => {
  clearInterval(classifyInterval)
})
</script>

<template>
  <div>
    <div
      v-show="isLoading"
      class="flex justify-center items-center min-h-screen bg-custom-bg"
    >
      <div
        class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"
      ></div>
    </div>

    <div
      v-show="!isLoading"
      class="relative w-screen h-screen text-white overflow-hidden section0"
    >
      <!-- Webcam -->
      <div class="video-container">
        <video id="webcam-video" autoplay muted playsinline></video>
      </div>

      <div id="label-container"></div>

      <!-- 掃描框圖層 -->
      <img
        :src="scanFrame"
        alt="scanner-frame"
        id="scan-frame"
        class="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[270px] h-[270px] z-10 pointer-events-none"
      />

      <!-- 提示文字 -->
      <!-- <div class="absolute w-full text-center text-lg z-20">請將鏡頭對準展品</div> -->

      <!-- 關閉按鈕 -->
      <button class="absolute top-5 left-5 text-3xl z-20" @click="GoToInfoList">
        ×
      </button>
    </div>
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
  height: 100vh;
  position: relative;
  overflow: hidden;
}

#webcam-video {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  min-width: 100%;
  min-height: 100%;
  object-fit: cover;
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
