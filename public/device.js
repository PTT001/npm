function Log(msg, color = '#0f0') {
  console.log(`%c ${msg}`, `color:${color};`)
}

/***
 * 初始化WebARSDK
 */
async function InitWebARSDK() {
  Log('InitWebARSDK')
  //檢查瀏覽器相容性
  ArplanetWebAR.Emit('check_user_browser', { isRedirect: true, isAlert: true })
  //初始化專案
  ArplanetWebAR.Emit('init', {
    product_id: 'demo',
    project_id: 'demo'
  })
  //開啟自動管理裝置
  ArplanetWebAR.SetAutoCloseDevice(true)
}

/**
 * 啟用攝影機
 * @param {String} videoElementID
 * @param {String} isFrontCamera 是否是前鏡頭
 * @returns
 */
async function OpenCamera(
  videoElementID = 'webcam-video',
  isFrontCamera = false
) {
  Log('OpenCamera')
  let isVideoMirror = isFrontCamera === true ? true : false
  let facingMode = isFrontCamera === true ? 'user' : 'environment'
  document.documentElement.style.setProperty(
    '--videoIsMirror',
    `${isVideoMirror}`
  )

  const videoElement = document.getElementById(videoElementID)
  if (videoElement) {
    videoElement.setAttribute('autoplay', true)
    videoElement.style.display = 'block'
    videoElement.style.opacity = 1
  }
  window.onresize = function () {
    FullScreenVideoElement(videoElement)
  }
  videoElement.onloadedmetadata = function () {
    Log('onloadedmetadata')
    document.documentElement.style.setProperty(
      '--videoWidth',
      `${videoElement.videoWidth}px`
    )
    document.documentElement.style.setProperty(
      '--videoHeight',
      `${videoElement.videoHeight}px`
    )
    FullScreenVideoElement(videoElement)
  }

  ArplanetWebAR.SetDeviceOption('CAM', {
    video: {
      facingMode: facingMode,
      //   width: { ideal: 200 },
      //   height: { ideal: 200 },
      frameRate: { min: 24 }
    }
  })
  //移除裝置資料事件
  ArplanetWebAR.removeEventListener('device_data')
  //監聽裝置資料事件
  ArplanetWebAR.addEventListener('device_data', e => {
    const event =
      e.detail !== undefined &&
      e.detail !== null &&
      e.detail['name'] !== undefined &&
      e.detail['name'] !== null
        ? e.detail
        : null
    if (event === null) {
      return
    }
    if (event['type'] === 'CAM') {
      let videoStream = event['data']
      videoElement.srcObject = videoStream
      videoElement.play()
    }
  })

  return ArplanetWebAR.RequestDevicePermission('CAM')
}

/**
 * 關閉攝像頭
 * @returns {Promise}
 */
async function CloseCamera(videoElementID = 'webcam-video') {
  Log('CloseCamera')
  const videoElement = document.getElementById(videoElementID)
  const _this = this
  if (videoElement) {
    videoElement.style.display = 'none'
    videoElement.style.opacity = 0
  }
  return ArplanetWebAR.CloseDevice('CAM')
}

/**
 * 計算物件縮放水平垂直居中
 * @param {HTMLVideoElement} videoElement 影像物件
 * @param {number} windowWidth 視窗寬度
 * @param {number} windowHeight 視窗高度
 * @param {number} videoWidth 影像原始寬度
 * @param {number} videoHeight 影像原始高度
 * @param {boolean} isMirror 鏡像設置
 * @returns  {Object} 返回縮放比例寬高偏移量
 */
function calculateVideoTransform(
  videoElement,
  windowWidth,
  windowHeight,
  videoWidth,
  videoHeight,
  isMirror = false
) {
  // 計算影片寬高比
  const videoAspectRatio = videoWidth / videoHeight
  // 計算視窗寬高比
  const windowAspectRatio = windowWidth / windowHeight
  Log('[videoWidth]' + videoWidth + ',[videoHeight]' + videoHeight, 'red')
  Log('[v.a]' + videoAspectRatio + ',[w.a]' + windowAspectRatio, 'red')
  let scaleRate = 1
  let offsetX = 0
  let offsetY = 0
  let type = 0
  let scaledWidth = 0
  let scaledHeight = 0
  // 視窗為橫
  if (windowAspectRatio >= 1) {
    //影片為橫
    if (videoAspectRatio >= 1) {
      //影片寬度超過螢幕寬度
      if (videoAspectRatio >= windowAspectRatio) {
        type = 1
        //以高為基準
        scaleRate = windowHeight / videoHeight
      }
      //影片寬度小於螢幕寬度
      else {
        type = 2
        //以寬為主
        scaleRate = windowWidth / videoWidth
      }
    }
    //影片為直
    else {
      type = 3
      //以寬為主
      scaleRate = windowWidth / videoWidth
    }
  }
  //視窗為直
  else {
    //影片為橫
    if (videoAspectRatio >= 1) {
      type = 4
      //以高為主
      scaleRate = windowHeight / videoHeight
    }
    //影片為直
    else {
      //影片寬度超過螢幕寬度
      if (videoAspectRatio >= windowAspectRatio) {
        type = 5
        //以高為主
        scaleRate = windowHeight / videoHeight
      }
      //影片寬度小於螢幕寬度
      else {
        type = 6
        //以寬為主
        scaleRate = windowWidth / videoWidth
      }
    }
  }
  //取得縮放後的大小
  scaledWidth = videoWidth * scaleRate
  scaledHeight = videoHeight * scaleRate
  //計算偏移X量
  //1.先計算縮放的質心，由於css transform scale的質心是物件中心點，但是HTML物件的質心是左上角，會導致縮放後物件會有偏移
  //先將物件調整至縮放的原點還是在左上角為主，後續再做額外的視窗偏移計算
  //    (縮放大小 - 原始大小)/ (縮放比 * 2)  ，2是置中參數
  let scale_zero_x = (scaledWidth - videoWidth) / (scaleRate * 2)
  let scale_zero_y = (scaledHeight - videoHeight) / (scaleRate * 2)
  //求出縮放後的原始點位scale_zero_x,scale_zero_y後，後續再做視窗的切割偏移孝正
  //此時縮放的物件真實的左上角已經被孝正與螢幕0.0疊合
  //2.計算螢幕偏移位置，要水平垂直居中
  //(螢幕大小 - 縮放大小)/ (縮放比*2)
  let window_sx = (windowWidth - scaledWidth) / (scaleRate * 2)
  let window_sy = (windowHeight - scaledHeight) / (scaleRate * 2)
  offsetX = scale_zero_x + window_sx
  offsetY = scale_zero_y + window_sy
  //鏡像
  let scaleX = isMirror === true ? '-1' : '1'
  // 設置 transform 属性
  videoElement.style.transform = `scale(${scaleRate}) translateX(${offsetX}px) translateY(${offsetY}px) scaleX(${scaleX})`
  //Log("[type]" + type + "[scaleRate]" + scaleRate + "[scaledWidth]" + scaledWidth + "[scaledHeight]" + scaledHeight + "[offsetX]" + offsetX + "[offsetY]" + offsetY)
  // 返回缩放比例、尺寸和偏移量
  return {
    scaleRate,
    scaledWidth,
    scaledHeight,
    offsetX,
    offsetY
  }
}

/**
 * 影像全螢幕，並保持水平垂直居中
 * @param {HTMLVideoElement} videoElement
 * @returns
 */
async function FullScreenVideoElement(videoElement) {
  Log('FullScreenVideoElement')
  if (!(videoElement instanceof HTMLVideoElement)) {
    return
  }
  const videoWidth = Number.parseFloat(
    document.documentElement.style.getPropertyValue('--videoWidth')
  )
  const videoHeight = Number.parseFloat(
    document.documentElement.style.getPropertyValue('--videoHeight')
  )
  const videoIsMirror =
    document.documentElement.style
      .getPropertyValue('--videoIsMirror')
      .toLowerCase() === 'true'
  if (videoWidth <= 0 || videoHeight <= 0) {
    return
  }

  // 不進行縮放，直接設置影片大小為 200x200
  videoElement.style.width = '180px'
  videoElement.style.height = '180px'
  videoElement.style.transform = videoIsMirror ? 'scaleX(-1)' : 'scaleX(1)' // 只保留鏡像效果
  videoElement.style.position = 'absolute' // 可選：讓影片可定位
  videoElement.style.borderRadius = '20px'
  videoElement.style.left = '50%' // 可選：水平居中
  videoElement.style.top = '50%' // 可選：垂直居中
  videoElement.style.transform += ' translate(-50%, -50%)' // 居中偏移

  return {
    scaleRate: 1,
    scaledWidth: 400,
    scaledHeight: 400,
    offsetX: 0,
    offsetY: 0
  }

  //   const WindowWidth = document.documentElement.clientWidth
  //   const WindowHeight = document.documentElement.clientHeight
  //   return calculateVideoTransform(
  //     videoElement,
  //     WindowWidth,
  //     WindowHeight,
  //     videoWidth,
  //     videoHeight,
  //     videoIsMirror
  //   )
}
