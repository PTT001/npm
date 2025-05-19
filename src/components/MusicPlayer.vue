<template>
  <div
    class="fixed inset-0 bg-gray-900 flex flex-col items-center justify-center z-50"
    v-if="isVisible"
  >
    <!-- 關閉按鈕 -->
    <button
      class="absolute top-4 left-4 w-10 h-10 flex items-center justify-center bg-gray-700 hover:bg-gray-600 rounded-full transition-colors"
      @click="closePlayer"
    >
      <svg
        class="w-6 h-6 text-white"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
    <!-- 音樂播放器內容 -->
    <div class="text-white flex flex-col items-center">
      <!-- 圓形進度條和播放按鈕 -->
      <div class="relative w-48 h-48">
        <svg class="absolute w-full h-full" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#4b5563"
            stroke-width="8"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#3b82f6"
            stroke-width="8"
            :stroke-dasharray="circleCircumference"
            :stroke-dashoffset="progressOffset"
            transform="rotate(-90 50 50)"
          />
        </svg>
        <button
          class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 rounded-full w-32 h-32 flex items-center justify-center transition-colors"
          @click="togglePlay"
        >
          <svg
            v-if="!isPlaying"
            class="w-16 h-16"
            fill="white"
            viewBox="0 0 24 24"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
          <svg v-else class="w-16 h-16" fill="white" viewBox="0 0 24 24">
            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
          </svg>
        </button>
      </div>
      <!-- 控制按鈕 -->
      <div class="flex space-x-4 mt-6">
        <button
          class="bg-gray-700 hover:bg-gray-600 p-3 rounded-full"
          @click="rewind"
        >
          <svg class="w-6 h-6" fill="white" viewBox="0 0 24 24">
            <path d="M12.5 3.5v17l-8-8.5 8-8.5zm8 0v17l-8-8.5 8-8.5z" />
          </svg>
        </button>
        <button
          class="bg-gray-700 hover:bg-gray-600 p-3 rounded-full"
          @click="fastForward"
        >
          <svg class="w-6 h-6" fill="white" viewBox="0 0 24 24">
            <path d="M11.5 3.5v17l8-8.5-8-8.5zm-8 0v17l8-8.5-8-8.5z" />
          </svg>
        </button>
      </div>
      <!-- 時間顯示 -->
      <div class="mt-4 text-lg">
        {{ formatTime(currentTime) }} / {{ formatTime(duration) }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MusicPlayer',
  data() {
    return {
      isPlaying: false,
      currentTime: 0,
      duration: 180, // 假設音樂長度為180秒
      circleCircumference: 2 * Math.PI * 45, // 圓周長 (半徑45)
      audio: null,
      isVisible: false // 控制播放器顯示
    }
  },
  computed: {
    progressOffset() {
      const progress = this.currentTime / this.duration
      return this.circleCircumference * (1 - progress)
    }
  },
  methods: {
    togglePlay() {
      if (this.isPlaying) {
        this.audio.pause()
      } else {
        this.audio.play()
      }
      this.isPlaying = !this.isPlaying
    },
    rewind() {
      this.currentTime = Math.max(0, this.currentTime - 10)
      this.audio.currentTime = this.currentTime
    },
    fastForward() {
      this.currentTime = Math.min(this.duration, this.currentTime + 10)
      this.audio.currentTime = this.currentTime
    },
    formatTime(seconds) {
      const minutes = Math.floor(seconds / 60)
      const secs = Math.floor(seconds % 60)
      return `${minutes}:${secs.toString().padStart(2, '0')}`
    },
    updateProgress() {
      this.currentTime = this.audio.currentTime
      if (this.currentTime >= this.duration) {
        this.isPlaying = false
        this.currentTime = 0
        this.audio.currentTime = 0
        this.audio.pause()
      }
    },
    openPlayer() {
      this.isVisible = true
    },
    closePlayer() {
      this.isVisible = false
      // this.isPlaying = false
      // this.audio.pause()
      // this.currentTime = 0
      // this.audio.currentTime = 0
    }
  },
  mounted() {
    // 初始化音頻對象
    this.audio = new Audio(
      'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Carefree.mp3'
    )
    this.audio.addEventListener('timeupdate', this.updateProgress)
    this.audio.addEventListener('loadedmetadata', () => {
      this.duration = this.audio.duration
    })
  },
  beforeUnmount() {
    // 清理事件監聽器
    this.audio.removeEventListener('timeupdate', this.updateProgress)
    this.audio.pause()
  }
}
</script>

<style scoped>
/* TailwindCSS is used directly in the template, so no additional CSS is needed here */
</style>
