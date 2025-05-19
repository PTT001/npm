<template>
  <section class="mb-8 pl-4 font">
    <div class="relative overflow-hidden">
      <swiper
        :modules="modules"
        slides-per-view="auto"
        :space-between="16"
        :free-mode="false"
        :pagination="false"
        :navigation="false"
        @swiper="onSwiper"
        @slideChange="onSlideChange"
        class="w-full h-full"
      >
        <swiper-slide
          v-for="(item, index) in item"
          :key="index"
          class="transition-transform duration-300 hover:scale-102"
        >
          <div
            class="relative bg-gray-100 rounded-3xl shadow-md overflow-hidden w-[180px]"
            @click="GoToInfo(item.id)"
          >
            <img
              :src="item.imageUrl"
              :alt="item.alt"
              class="object-cover w-full"
            />

            <div class="absolute bottom-0 left-0 right-0 p-4 text-left">
              <p class="text-white text-xs">{{ item.location }}</p>
              <p class="text-white text-sm">{{ item.name }}</p>
            </div>
          </div>
        </swiper-slide>
      </swiper>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import {
  Navigation,
  Pagination,
  A11y,
  Autoplay,
  FreeMode
} from 'swiper/modules'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import router from '../router'

const modules = [Pagination, Navigation, A11y, Autoplay, FreeMode]

const props = defineProps({
  item: {
    type: Array,
    required: true,
    default: () => []
  }
})

const GoToInfo = id => {
  router.push(`/Info/${id}`)
}

const onSwiper = swiper => {}
const onSlideChange = swiper => {}
</script>

<style scoped>
:deep(.swiper) {
  width: 100%;
  height: 100%;
  background-color: transparent !important;
}

:deep(.swiper-slide) {
  text-align: center;
  font-size: 18px;
  background: transparent !important;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 180px !important; /* 固定滑塊寬度為 180px */
}

:deep(.swiper-slide img) {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.font {
  font-family: 'Noto Sans TC', serif;
  font-optical-sizing: auto; /* 保持光學尺寸調整 */
  font-weight: 400; /* 設定一個預設字重，例如 Regular 400 */
  font-style: normal;
  -webkit-font-smoothing: antialiased; /* 改善字體渲染 (macOS/iOS) */
  -moz-osx-font-smoothing: grayscale; /* 改善字體渲染 (Firefox on macOS) */
}
</style>
