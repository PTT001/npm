// 全局變量聲明
let model // 存儲TensorFlow.js模型
let video // 存儲HTML視頻元素
let canvas // 存儲HTML畫布元素
let ctx // 畫布上下文
let isModelReady = false // 模型是否已加載完成的狀態標誌
let isClassifying = false // 是否正在執行分類的狀態標誌
let classifyInterval // 存儲分類間隔計時器的引用
let labels = []
let isFrontCam = false

const bufferSize = 25
let predictionBuffer = []

function addPredictionToBuffer(prediction) {
  if (predictionBuffer.length >= bufferSize) {
    predictionBuffer.shift() // 移除最舊的
  }
  predictionBuffer.push(prediction)
}

function getDominantPrediction() {
  if (predictionBuffer.length === 0) return null

  const labelStats = {}

  for (const { label, confidence } of predictionBuffer) {
    if (!labelStats[label]) {
      labelStats[label] = { count: 0, totalConfidence: 0 }
    }
    labelStats[label].count += 1
    labelStats[label].totalConfidence += confidence
  }

  // 找出出現最多次的 label
  const dominant = Object.entries(labelStats).sort(
    (a, b) => b[1].count - a[1].count
  )[0]

  const [label, stats] = dominant
  const averageConfidence = stats.totalConfidence / stats.count

  return {
    label,
    averageConfidence
  }
}

function showPrediction(predictions) {
  // 將預測值與索引配對並排序
  const indexedPredictions = Array.from(predictions)
    .map((conf, idx) => ({ confidence: conf, index: idx }))
    .sort((a, b) => b.confidence - a.confidence)

  // Only show the highest confidence prediction
  const topPrediction = indexedPredictions[0]
  const { confidence, index } = topPrediction
  const percentage = (confidence * 100).toFixed(2)

  const labelName = labels[index]

  // 加入新的預測
  addPredictionToBuffer({
    label: labelName,
    confidence: parseFloat(percentage)
  })

  // 只有當 buffer 滿 10 個時才進行 invoke
  if (predictionBuffer.length === bufferSize) {
    // 每次都使用 buffer 裡最多的 label 進行推斷與回傳
    const dominantPrediction = getDominantPrediction()

    if (dominantPrediction) {
      EventManager.invoke({
        target: 'camera1',
        type: 'onAIClassify',
        payload: {
          label: dominantPrediction.label,
          confidence: (dominantPrediction.averageConfidence * 100).toFixed(2)
        }
      })
    }
  }

  // EventManager.invoke({
  //   'target': 'camera1',
  //   'type': 'onAIClassify',
  //   'payload': {
  //     'label': labelName,
  //     'confidence': percentage
  //   }
  // })

  const labelContainer = document.getElementById('label-container')
  labelContainer.innerHTML = '' // 清空現有內容

  // 創建標籤元素
  const labelItem = document.createElement('div')
  labelItem.style.marginBottom = '0.5rem'

  // 標籤文字
  const labelText = document.createElement('div')
  labelText.textContent = labels[index]
  labelText.style.marginBottom = '4px'
  labelItem.appendChild(labelText)

  // 進度條容器
  const barContainer = document.createElement('div')
  barContainer.style.position = 'relative'
  barContainer.style.height = '16px'
  barContainer.style.backgroundColor = '#e5e7eb' // 淺灰
  barContainer.style.borderRadius = '4px'
  barContainer.style.overflow = 'hidden'

  // 進度條
  const bar = document.createElement('div')
  bar.style.position = 'absolute'
  bar.style.top = '0'
  bar.style.left = '0'
  bar.style.height = '100%'
  bar.style.width = `${percentage}%`
  bar.style.backgroundColor = '#22c55e' // 綠色
  bar.style.borderRadius = '4px'
  bar.style.transition = 'width 0.3s ease'

  // 百分比文字
  const percentText = document.createElement('div')
  percentText.textContent = `${percentage}%`
  percentText.style.position = 'absolute'
  percentText.style.right = '4px'
  percentText.style.top = '50%'
  percentText.style.transform = 'translateY(-50%)'
  percentText.style.fontSize = '12px'
  percentText.style.color = '#1f2937' // 深灰

  barContainer.appendChild(bar)
  barContainer.appendChild(percentText)
  labelItem.appendChild(barContainer)
  labelContainer.appendChild(labelItem)
}

// async function changeCam(video_id) {
//   isFrontCam = !isFrontCam
//   //更換cam
//   await CloseCamera(video_id)
//   await OpenCamera(video_id, isFrontCam)
// }

async function loadLabels(config) {
  try {
    const response = await fetch(config.label_url) // 假設標籤檔案名叫 labels.json
    const data = await response.json()
    console.log()

    return data.labels // 假設JSON結構是 { "labels": ["label1", "label2", ...] }
  } catch (error) {
    console.error('標籤檔案載入失敗:', error)
    return []
  }
}

/**
 * 初始化函數 - 加載TensorFlow.js模型並設置按鈕事件監聽器
 * 這是應用程序的入口點
 */

async function TensorFlowInit(config) {
  const video_id = 'webcam-video'
  await InitWebARSDK()
  await OpenCamera(video_id, isFrontCam)

  video = document.getElementById('webcam-video')

  try {
    // 方法 1: 禁用 WEBGL_PACK 以避免著色器連結問題
    tf.ENV.set('WEBGL_PACK', false)
    console.log('WEBGL_PACK 已禁用')

    // 方法 2: 檢查 WebGL 2.0 支持
    const gl = document.createElement('canvas').getContext('webgl2')
    if (!gl) {
      console.warn('此設備不支援 WebGL 2.0，可能影響性能')
      // 方法 3: 如果 WebGL 2.0 不支援，切換到 CPU 後端
      await tf.setBackend('cpu')
      console.log('已切換到 CPU 後端')
    } else {
      console.log('WebGL 2.0 支援正常')
    }

    labels = await loadLabels(config)

    if (labels.length === 0) {
      throw new Error('無法載入標籤或標籤列表為空')
    }

    model = await tf.loadLayersModel(config.model_url)
    isModelReady = true

    await startClassifying()
  } catch (error) {
    console.error('初始化失敗:', error)
  }
}

/**
 * 開始分類 - 設置定期執行模型推理的計時器
 */
function startClassifying() {
  if (!isModelReady || !video) {
    return
  }

  isClassifying = true

  // 設置定時器，每500毫秒執行一次分類
  classifyInterval = setInterval(() => {
    // 確保視頻已經加載足夠的數據
    if (video && video.readyState === 4) {
      classifyFrame()
    }
  }, 100)
}

/**
 * 分類單一影格 - 對當前視頻幀執行模型推理
 * 這是模型預測的核心功能
 */
function classifyFrame() {
  if (!isModelReady || !video) {
    return
  }

  // 使用tf.tidy自動清理中間張量，防止內存洩漏
  tf.tidy(() => {
    // 從視頻元素創建TensorFlow張量
    const tfImage = tf.browser.fromPixels(video)

    // 將圖像調整為模型需要的224x224尺寸
    const resizedImage = tf.image.resizeBilinear(tfImage, [224, 224])

    // 將像素值從[0, 255]範圍正規化到[0, 1]範圍
    const normalizedImage = resizedImage.div(tf.scalar(255))

    // 轉置張量維度為channels_first格式[1, 3, 224, 224]
    // 這是為了匹配模型的輸入格式要求
    const transposed = tf.transpose(normalizedImage, [2, 0, 1])
    const batchedImage = transposed.expandDims(0)

    // 執行模型推理並獲取預測結果
    const predictions = model.predict(batchedImage)
    const predictionArray = predictions.dataSync()

    // 找出最高置信度的類別索引
    // const maxIndex = predictionArray.indexOf(Math.max(...predictionArray))
    // const confidence = predictionArray[maxIndex]

    // 在UI上顯示預測結果
    showPrediction(predictionArray)
  })
}
