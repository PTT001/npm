<template>
  <section class="mb-8">
    <div class="relative overflow-hidden">
      <swiper
        :modules="modules"
        :slides-per-view="1.5"
        :space-between="16"
        :free-mode="true"
        :pagination="false"
        :navigation="false"
        @swiper="onSwiper"
        @slideChange="onSlideChange"
        class="w-full h-full"
      >
        <swiper-slide
          v-for="(item, index) in item"
          :key="index"
          class="py-4 transition-transform duration-300 hover:scale-102"
        >
          <div class="flex rounded-lg overflow-hidden w-[280px] h-[122px]">
            <!-- 圖片 -->
            <div class="rounded-lg">
              <img :src="item.imageUrl" :alt="item.alt" />
            </div>

            <!-- 文字內容 -->
            <div class="m-4 flex flex-col justify-between w-1/2 text-left">
              <div>
                <p class="text-sm font-medium text-gray-800 mb-1">
                  {{ item.name }}
                </p>
                <p class="text-xs text-gray-600">{{ item.location }}</p>
              </div>
              <div class="text-sm text-[#a99f85] flex items-center">
                前往查看 <span class="ml-1">›</span>
              </div>
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

const modules = [Pagination, Navigation, A11y, Autoplay, FreeMode]

const props = defineProps({
  item: {
    type: Array,
    required: true,
    default: () => []
  }
})

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
}

:deep(.swiper-slide img) {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
