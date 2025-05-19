<template>
  <div class="min-h-screen bg-gray-100">
    <header
      ref="headerRef"
      class="fixed top-0 left-0 right-0 z-30 p-4 flex items-center transition-all duration-300"
      :class="{
        'bg-custom-bg shadow-md': isScrolled,
        'bg-transparent': !isScrolled
      }"
    >
      <button
        @click="goBack"
        class="w-12 h-12 p-2 rounded-full hover:bg-black/10 transition-colors"
        v-if="!isScrolled"
      >
        <img :src="Back" alt="Back" class="object-contain" />
      </button>

      <button
        @click="goBack"
        class="w-12 h-12 p-2 rounded-full hover:bg-black/10 transition-colors"
        v-if="isScrolled"
      >
        <img :src="Back2" alt="Back" class="object-contain" />
      </button>

      <h2
        class="text-lg font-semibold text-title-bg transition-opacity duration-500 ease-in-out absolute left-1/2 transform -translate-x-1/2"
        :class="{ 'opacity-100': isScrolled, 'opacity-0': !isScrolled }"
      >
        霽青描金游魚轉心瓶
      </h2>
    </header>

    <main class="overflow-y-auto h-screen relative">
      <DetailSlider :banner="banner" ref="detailSliderRef" />

      <div
        class="bg-custom-bg pt-16 pb-8 px-6 rounded-t-[60px] shadow-lg relative z-20 -mt-20"
      >
        <div
          class="absolute -top-5 left-1/2 -translate-x-1/2 bg-title-bg rounded-full"
        >
          <h2 class="text-lg font-semibold text-title py-[6px] px-[11px]">
            霽青描金游魚轉心瓶
          </h2>
        </div>

        <div class="text-gray-700 space-y-4 pt-8">
          <div class="flex">
            <span
              class="w-auto min-w-[4rem] shrink-0 font-bold text-xl mr-4 text-custom-font"
              >年代</span
            >
            <span class="font-semibold text-base">清 乾隆 西元 1736-1795</span>
          </div>
          <div class="flex">
            <span
              class="w-auto min-w-[4rem] shrink-0 font-bold text-xl mr-4 text-custom-font"
              >尺寸</span
            >
            <span class="font-semibold text-base">
              高 23.5 cm，深 18.5 cm，口徑 5.3 cm， 足徑 8.4 cm，腹圍 43.2 cm
            </span>
          </div>
          <div class="flex">
            <span
              class="w-auto min-w-[4rem] shrink-0 font-bold text-xl mr-4 text-custom-font"
              >地點</span
            >
            <span class="font-semibold text-base">205 陳列室</span>
          </div>
        </div>

        <div class="flex justify-around mt-8 mb-6 py-4 space-x-2 sm:space-x-4">
          <button @click="openAR" class="w-1/3 max-w-[100px]">
            <img
              src="../assets/Interaction1.png"
              alt="AR Interaction"
              class="w-full h-auto object-contain"
            />
          </button>
          <div class="self-center h-8 border-l border-custom-divider"></div>
          <button class="w-1/3 max-w-[100px]" @click="openMusicPlayer">
            <img
              src="../assets/Interaction2.png"
              alt="Interaction 2"
              class="w-full h-auto object-contain"
            />
          </button>
          <div class="self-center h-8 border-l border-custom-divider"></div>
          <button @click="scrollToVideo" class="w-1/3 max-w-[100px]">
            <img
              src="../assets/Interaction3.png"
              alt="Scroll to Video"
              class="w-full h-auto object-contain"
            />
          </button>
        </div>

        <div class="mt-8">
          <h3 class="text-xl font-bold text-gray-800 mb-3 text-custom-font">
            簡介
          </h3>
          <p class="text-gray-700 leading-relaxed font-semibold text-base font">
            套瓶，侈口捲邊，長頸，豐肩，斂腹，矮圈足，器肩飾有四圓環形繫耳。瓶腹分內外兩層，內層施淺青湖綠色釉表現出湖水一樣的背景，其間以粉彩畫水草、落花及金魚。器外底施湖綠釉，書有「大清乾隆年製」青花篆體款識。外瓶器腹部上作四鏤空開光，觀者可自頸部握住轉動，透過外瓶開光看見內瓶所繪之水草魚紋悠游嬉戲於眼前，如同走馬燈一般，故名「轉心瓶」。
          </p>
        </div>

        <div class="mt-8" ref="videoSection">
          <h3 class="text-xl font-bold text-gray-800 mb-3 text-custom-font">
            相關影片
          </h3>
          <div
            class="w-full rounded-lg overflow-hidden"
            style="aspect-ratio: 16 / 9"
          >
            <iframe
              class="w-full h-full"
              src="https://www.youtube.com/embed/LTlj4Ekpx4Y"
              title="YouTube video player"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowfullscreen
            ></iframe>
          </div>
        </div>

        <div class="mt-8 pb-8">
          <h3 class="text-xl font-bold text-gray-800 mb-3 text-custom-font">
            其他熱門展品
          </h3>
          <OtherHotItem :item="others" />
        </div>
      </div>
    </main>

    <!-- Full-screen AR Iframe -->
    <div v-if="showAR" class="fixed inset-0 z-50 bg-black">
      <button
        @click="closeAR"
        class="absolute top-4 left-4 w-12 h-12 p-2 rounded-full bg-white/80 hover:bg-white transition-colors flex items-center justify-center"
      >
        <svg
          class="w-6 h-6 text-gray-800"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          ></path>
        </svg>
      </button>
      <iframe
        class="w-full h-full"
        src="https://coreinteraction.arplanets.com/prod/index.html#/modelViewer/15817"
        title="AR Experience"
        frameborder="0"
        allow="accelerometer; gyroscope; web-share; camera; vr; xr; ar"
        allowfullscreen
      ></iframe>
    </div>

    <!-- 音訊播放器 Modal -->
    <div>
      <MusicPlayer ref="musicPlayer" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import Back from '../assets/Back.png'
import Back2 from '../assets/Back2.png'
import DetailSlider from '../components/DetailSlider.vue'
import OtherHotItem from '../components/OtherHotItemSlider.vue'
import 'vue3-audio-player/dist/style.css'
import MusicPlayer from '../components/MusicPlayer.vue'
import { useRoute } from 'vue-router'
import store from '../../store'

console.log(store.data, '!?')

const route = useRoute()
const id = ref(route.params.id)

const banner = [
  {
    'ImageUrl':
      'https://arplanets.s3.ap-southeast-1.amazonaws.com/frontend-test/CY/img/dragon.png'
  },
  {
    'ImageUrl':
      'https://arplanets.s3.ap-southeast-1.amazonaws.com/frontend-test/CY/img/dragon.png'
  },
  {
    'ImageUrl':
      'https://arplanets.s3.ap-southeast-1.amazonaws.com/frontend-test/CY/img/dragon.png'
  },
  {
    'ImageUrl':
      'https://arplanets.s3.ap-southeast-1.amazonaws.com/frontend-test/CY/img/dragon.png'
  },
  {
    'ImageUrl':
      'https://arplanets.s3.ap-southeast-1.amazonaws.com/frontend-test/CY/img/dragon.png'
  }
]

const others = [
  {
    'name': '太平有象瓷尊',
    'location': '1F｜陳列室 105',
    'imageUrl':
      'https://arplanets.s3.ap-southeast-1.amazonaws.com/frontend-test/CY/img/elephant.png'
  },
  {
    'name': '翠玉白菜',
    'location': '2F｜陳列室 205',
    'imageUrl':
      'https://arplanets.s3.ap-southeast-1.amazonaws.com/frontend-test/CY/img/cabbage.png'
  },
  {
    'name': '太平有象瓷尊',
    'location': '1F｜陳列室 105',
    'imageUrl':
      'https://arplanets.s3.ap-southeast-1.amazonaws.com/frontend-test/CY/img/elephant.png'
  },
  {
    'name': '翠玉白菜',
    'location': '2F｜陳列室 205',
    'imageUrl':
      'https://arplanets.s3.ap-southeast-1.amazonaws.com/frontend-test/CY/img/cabbage.png'
  }
]

// Refs for elements
const headerRef = ref(null)
const detailSliderRef = ref(null)
const videoSection = ref(null)

const headerHeight = ref(0)
let observer = null

// Reactive state for header visibility
const isScrolled = ref(false)

// Router instance for navigation
const router = useRouter()

const scrollToVideo = () => {
  videoSection.value?.scrollIntoView({ behavior: 'smooth', block: 'center' }) // Added block: 'center' for better positioning
}

const showAR = ref(false)
const openAR = () => {
  showAR.value = true
}
const closeAR = () => {
  showAR.value = false
}

// Go back to previous route
const goBack = () => {
  router.push(`/InfoList`)
}

const musicPlayer = ref(null) // Ref to access MusicPlayer component

// Method to open the music player
const openMusicPlayer = () => {
  if (musicPlayer.value) {
    musicPlayer.value.openPlayer()
  }
}

onMounted(() => {
  // Get header height after it's rendered
  if (headerRef.value) {
    headerHeight.value = headerRef.value.offsetHeight
  }

  // Ensure DetailSlider component's root element ($el) is available and is an Element
  if (detailSliderRef.value && detailSliderRef.value.$el instanceof Element) {
    const targetElement = detailSliderRef.value.$el

    observer = new IntersectionObserver(
      ([entry]) => {
        isScrolled.value = !entry.isIntersecting
      },
      {
        root: null, // observing intersections with the viewport
        rootMargin: `-${headerHeight.value}px 0px 0px 0px`,
        threshold: 0 // Trigger as soon as any part crosses the boundary
      }
    )
    observer.observe(targetElement)
  } else if (detailSliderRef.value) {
    console.warn(
      'DetailSlider ref is present, but $el is not an Element or is not available yet. IntersectionObserver not started for DetailSlider.'
    )
  }
})

onUnmounted(() => {
  if (observer) {
    observer.disconnect()
  }
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
</style>
