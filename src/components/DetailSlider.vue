<template>
  <section class="mb-8">
    <div class="relative overflow-hidden rounded-lg shadow-lg">
      <swiper
        :modules="modules"
        :slides-per-view="1"
        :space-between="0"
        :pagination="{ clickable: true }"
        :navigation="false"
        @swiper="onSwiper"
        @slideChange="onSlideChange"
        class="w-full h-full"
      >
        <swiper-slide v-for="(image, index) in banner" :key="index">
          <img
            :src="image.ImageUrl"
            :alt="image.alt"
            class="object-cover w-full h-full"
          />
        </swiper-slide>
      </swiper>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
// 引入 Swiper Vue 組件
import { Swiper, SwiperSlide } from 'swiper/vue'

// 引入 Swiper 核心和所需模組
import { Navigation, Pagination, A11y, Autoplay } from 'swiper/modules'

// 引入 Swiper 樣式
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
// 如果您使用 Autoplay 等其他模組，也需要引入對應的 CSS
// import 'swiper/css/autoplay'

// 設定要使用的 Swiper 模組
const modules = [Pagination, Navigation, A11y, Autoplay]

// 接收 banner prop
const props = defineProps({
  banner: {
    type: Array,
    required: true,
    default: () => []
  }
})

const onSwiper = swiper => {}

const onSlideChange = swiper => {
  // console.log('slide change', swiper.realIndex);
}

// 如果需要在組件掛載後做一些操作，可以使用 onMounted
onMounted(() => {})
</script>

<style scoped>
/* 修改分頁器的樣式 */
:deep(.swiper-pagination-bullet) {
  background-color: white !important;
  opacity: 0.6 !important;
  margin-bottom: 4.5rem !important;
}

:deep(.swiper-pagination-bullet-active) {
  background-color: white !important;
  opacity: 1 !important;
}

/* 如果需要導航按鈕，也可以在此處設定樣式 */
/*
:deep(.swiper-button-next),
:deep(.swiper-button-prev) {
  color: white !important;
}
*/

/* 確保 Swiper 容器填滿其父容器 */
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
