<script setup>
import scanBg from '../assets/scan_bg.png'
import scanFrame from '../assets/Rectangle.png'
import { onMounted } from 'vue'

onMounted(() => {})
</script>

<template>
  <div class="relative w-screen h-screen overflow-hidden text-white">
    <div
      class="absolute inset-0 bg-cover bg-center blur-sm brightness-50 -z-10"
      :style="{ backgroundImage: `url(${scanBg})` }"
    ></div>

    <div
      class="absolute w-52 h-52 top-[35%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-0"
    >
      <div
        id="webcam-container"
        class="absolute inset-0 flex items-center justify-center"
      >
        <video
          id="webcam-video"
          autoplay
          muted
          playsinline
          class="w-full h-full object-cover"
        ></video>
      </div>

      <img
        :src="scanFrame"
        alt="scanner-frame"
        class="absolute inset-0 w-full h-full z-[1] pointer-events-none"
      />
    </div>

    <div
      class="absolute top-[calc(35%+7.5rem)] w-full text-center text-lg z-20"
    >
      請將鏡頭對準展品
    </div>

    <button class="absolute top-5 left-5 text-3xl z-20">×</button>
  </div>
</template>
