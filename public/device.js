function Log(msg, color = '#0f0') {
  console.log(`%c ${msg}`, `color:${color};`)
}

/**
 * 啟用攝影機
 * @param {String} videoElementID
 * @param {Boolean} isFrontCamera 是否使用前置攝影機
 * @returns {Promise}
 */
async function OpenCamera(
  videoElementID = 'webcam-video',
  isFrontCamera = false
) {
  Log('OpenCamera')
  const videoElement = document.getElementById(videoElementID)
  if (!videoElement) {
    Log('Video element not found', 'red')
    return
  }

  // 設置影片元素屬性
  videoElement.setAttribute('autoplay', 'true')
  videoElement.setAttribute('muted', 'true')
  videoElement.setAttribute('playsinline', 'true')

  // 設置全螢幕樣式
  videoElement.style.width = '100vw'
  videoElement.style.height = '100vh'
  videoElement.style.objectFit = 'cover'
  videoElement.style.position = 'absolute'
  videoElement.style.top = '0'
  videoElement.style.left = '0'
  videoElement.style.display = 'none' // 延遲顯示直到串流穩定

  // 設置攝影機選項
  const facingMode = isFrontCamera ? 'user' : 'environment'
  ArplanetWebAR.SetDeviceOption('CAM', {
    video: {
      facingMode: facingMode,
      frameRate: { min: 24 },
      width: { ideal: 1920 }, // 設置理想解析度
      height: { ideal: 1080 }
    }
  })

  // 監聽裝置資料事件
  ArplanetWebAR.removeEventListener('device_data')
  ArplanetWebAR.addEventListener('device_data', e => {
    const event = e.detail && e.detail.name ? e.detail : null
    if (event && event.type === 'CAM') {
      Log(
        `Stream settings: ${JSON.stringify(
          event.data.getVideoTracks()[0].getSettings()
        )}`,
        'blue'
      )
      videoElement.srcObject = event.data
      videoElement
        .play()
        .then(() => {
          videoElement.style.display = 'block' // 串流穩定後顯示
        })
        .catch(err => {
          Log(`Video play error: ${err}`, 'red')
        })
    }
  })

  // 請求攝影機權限
  return ArplanetWebAR.RequestDevicePermission('CAM')
}

/**
 * 關閉攝影機
 * @param {String} videoElementID
 * @returns {Promise}
 */
async function CloseCamera(videoElementID = 'webcam-video') {
  Log('CloseCamera')
  const videoElement = document.getElementById(videoElementID)
  if (videoElement) {
    videoElement.srcObject = null
    videoElement.style.display = 'none'
  }
  return ArplanetWebAR.CloseDevice('CAM')
}

/**
 * 初始化 WebAR SDK
 */
async function InitWebARSDK() {
  Log('InitWebARSDK')
  ArplanetWebAR.Emit('check_user_browser', { isRedirect: true, isAlert: true })
  ArplanetWebAR.Emit('init', {
    product_id: 'demo',
    project_id: 'demo'
  })
  ArplanetWebAR.SetAutoCloseDevice(true)
}
