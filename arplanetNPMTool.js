/**
 * -------------------------------------------------------
 * 設定參數
 * -------------------------------------------------------
 */
//輸出路徑
const LOCAL_FILE = './dist'
//Bucket設定
const S3_BUCKET_PROD = 'arplanets'
// const S3_BUCKET_PROD = 'arplanets';
const S3_BUCKET_TEST = 'arplanets'
//Bucket路徑設定
const S3_BUCKET_PROD_PATH = '/frontend-test/CY/'
// const S3_BUCKET_PROD_PATH = '/frontend-test/0424TEST/';
const S3_BUCKET_TEST_PATH = '/frontend-test/CY/'
//最終url host
const S3_HOST_PROD = 'https://s3.ap-southeast-1.amazonaws.com/arplanets'
// const S3_HOST_PROD = 'https://s3.ap-southeast-1.amazonaws.com/arplanets';
const S3_HOST_TEST = 'https://s3.ap-southeast-1.amazonaws.com/arplanets'
//打包指令
const BUILD_PROD_CMD = 'npm run build'
const BUILD_TEST_CMD = 'npm run build:test'
//aws profile
const PROFILE_PROD = 'default'
const PROFILE_TEST = 'default'

/**
 * -------------------------------------------------------
 * [正式環境]編譯&發布
 * -------------------------------------------------------
 */
const DeployProd = () => {
  DeployAndBuild(
    'PROD',
    S3_HOST_PROD,
    S3_BUCKET_PROD,
    S3_BUCKET_PROD_PATH,
    BUILD_PROD_CMD,
    PROFILE_PROD
  )
}
/**
 * -------------------------------------------------------
 * [測試環境]編譯&發布
 * -------------------------------------------------------
 */
const DeployTest = () => {
  DeployAndBuild(
    'TEST',
    S3_HOST_TEST,
    S3_BUCKET_TEST,
    S3_BUCKET_TEST_PATH,
    BUILD_TEST_CMD,
    PROFILE_TEST
  )
}

/**
 * -------------------------------------------------------
 * 編譯並發布
 * -------------------------------------------------------
 */
const DeployAndBuild = (
  ENV,
  HOST,
  S3_BUCKET,
  S3_BUCKET_PATH,
  BUILD_CMD,
  S3_PROFILE
) => {
  log(
    'cyan',
    '————————————————————————————————————————————————————————————————————————————————————'
  )
  log('cyan', `[step.1] build stage...`)
  log(
    'cyan',
    '————————————————————————————————————————————————————————————————————————————————————'
  )
  const S3_URI = HOST + S3_BUCKET_PATH + 'index.html'
  EXECUTE_CMD(BUILD_CMD, () => {
    log(
      'cyan',
      '————————————————————————————————————————————————————————————————————————————————————'
    )
    log('cyan', `[step.2] deploy to s3...`)
    log(
      'cyan',
      '————————————————————————————————————————————————————————————————————————————————————'
    )
    DeployS3(S3_BUCKET, S3_BUCKET_PATH, S3_PROFILE, () => {
      log(
        'green',
        '▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅'
      )
      log('green', `Build & Deploy【${ENV}】Complete!! `)
      log('yellow', `${S3_URI}`)
      log(
        'green',
        '▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅'
      )
    })
  })
}

/**
 * -------------------------------------------------------
 * 發布至S3
 * -------------------------------------------------------
 */
const DeployS3 = (s3_bucket, s3_bucket_key, s3_profile, onComplete) => {
  let S3_ARN = 's3://' + s3_bucket
  UpLoadToS3(LOCAL_FILE, S3_ARN + s3_bucket_key, 600, s3_profile, () => {
    if (onComplete != undefined && onComplete != null) {
      onComplete()
    }
  })
}

/**
 * -------------------------------------------------------
 * 上傳至S3
 * -------------------------------------------------------
 */
const UpLoadToS3 = (localPath, BucketPath, CacheSec, Profile, onComplete) => {
  let cmd =
    'aws s3 cp ' +
    localPath +
    ' ' +
    BucketPath +
    ' --recursive --acl public-read --cache-control max-age=' +
    CacheSec
  if (Profile !== undefined && Profile !== null && Profile.length > 0) {
    cmd += ' --profile ' + Profile
  }
  EXECUTE_CMD(cmd, onComplete)
}

/**
 * 執行原始指令
 * @param {string} exe_cmd
 * @param {function} onComplete
 */
const EXECUTE_CMD = (exe_cmd, onComplete) => {
  // console.log("EXECUTE_CMD:" + exe_cmd);
  if (exe_cmd !== undefined && exe_cmd !== null && exe_cmd.length > 0) {
    var exec = require('child_process').exec
    exec(exe_cmd, (error, stdout, stderr) => {
      if (error !== null) {
        console.log(`${stdout}`)
        console.log(`${stderr}`)
        log('red', `【CMD】【Error】「${error}」`)
      } else {
        log('purple', `【CMD】【Complete】「${exe_cmd}」`)
        onComplete()
      }
    })
  } else {
    onComplete()
  }
}

const log = (color, ...args) => {
  // adjust text color
  if (color === 'red') {
    console.log(`\u001b[31m`, ...args, `\u001b[0m`)
  } else if (color === 'green') {
    console.log(`\u001b[32m`, ...args, `\u001b[0m`)
  } else if (color === 'yellow') {
    console.log(`\u001b[33m`, ...args, `\u001b[0m`)
  } else if (color === 'blue') {
    console.log(`\u001b[34m`, ...args, `\u001b[0m`)
  } else if (color === 'purple') {
    console.log(`\u001b[35m`, ...args, `\u001b[0m`)
  } else if (color === 'cyan') {
    console.log(`\u001b[36m`, ...args, `\u001b[0m`)
  }
  // adjust bg color
  else if (color === 'red_bg') {
    console.log(`\u001b[41m`, ...args, `\u001b[0m`)
  } else if (color === 'blue_bg') {
    console.log(`\u001b[44m`, ...args, `\u001b[0m`)
  } else if (color === 'purple_bg') {
    console.log(`\u001b[45m`, ...args, `\u001b[0m`)
  } else if (color === 'cyan_bg') {
    console.log(`\u001b[46m`, ...args, `\u001b[0m`)
  }
  // adjust text and bg color for better visibility
  else if (color === 'green_bg') {
    console.log(`\u001b[42m\u001b[34m`, ...args, `\u001b[0m`)
  } else if (color === 'yellow_bg') {
    console.log(`\u001b[43m\u001b[34m`, ...args, `\u001b[0m`)
  } else if (color === 'white_bg') {
    console.log(`\u001b[47m\u001b[34m`, ...args, `\u001b[0m`)
  }
  // if you didn't specify a color, log everything with default color
  else {
    console.log(color, ...args)
  }
}

module.exports = { DeployProd, DeployTest }
