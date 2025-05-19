<template>
  <div class="min-h-screen bg-custom-bg">
    <header
      class="fixed top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-custom-bg"
      :class="{ 'show-border': isScrolled }"
    >
      <div class="flex items-center">
        <img :src="search" alt="Search" class="w-6 h-6 mr-7" />
        <h1 class="text-2xl font-extrabold text-gray-800">歡迎體驗智慧導覽</h1>
      </div>
    </header>

    <main class="pt-20 pb-16">
      <section class="mb-8">
        <div
          class="relative mx-4 overflow-hidden rounded-3xl shadow-lg aspect-video"
        >
          <slider :banner="store.data.banners" />
        </div>
      </section>

      <section class="mb-8">
        <div class="flex items-center justify-between mb-4 mx-4">
          <h3 class="text-2xl font-bold text-gray-800">熱門 AR 展品</h3>
          <a class="text-sm text-custom2-bg hover:text-blue-800 font">
            查看全部 &gt;
          </a>
        </div>

        <div class="">
          <ItemSldier :item="store.data.hotItems" />
        </div>
      </section>

      <section class="mb-8">
        <div class="flex items-center justify-between mb-4 mx-4">
          <h3 class="text-2xl font-bold text-gray-800">其他展品</h3>
          <a class="text-sm text-custom2-bg hover:text-blue-800 font">
            查看全部 &gt;
          </a>
        </div>

        <div>
          <ItemSldier :item="store.data.items" />
        </div>
      </section>

      <div class="fixed bottom-4 right-4 z-20">
        <img :src="Scan" alt="Scan" class="w-20 h-20" @click="GoToScan" />
      </div>
    </main>
  </div>
</template>

<script setup>
import search from '../assets/search.png'
import Scan from '../assets/Scan.png'
import axios from 'axios'
import { onMounted, ref, onUnmounted } from 'vue'
import slider from '../components/Slider.vue'
import ItemSldier from '../components/ItemSlider.vue'
import router from '../router'
import store from '../../store'

// 追蹤滾動狀態
const isScrolled = ref(false)

// 處理滾動事件
const handleScroll = () => {
  isScrolled.value = window.scrollY > 0
}

const GoToScan = () => {
  router.push(`/Scan`)
}

onMounted(async () => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.font {
  font-family: 'Noto Sans TC', serif;
  font-optical-sizing: auto; /* 保持光學尺寸調整 */
  font-weight: 400; /* 設定一個預設字重，例如 Regular 400 */
  font-style: normal;
  -webkit-font-smoothing: antialiased; /* 改善字體渲染 (macOS/iOS) */
  -moz-osx-font-smoothing: grayscale; /* 改善字體渲染 (Firefox on macOS) */
}

.show-border {
  border-bottom: 1px solid #c7c1b7; /* 可調整顏色和粗細 */
}
</style>
