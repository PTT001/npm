let rules = []
let globalVars = {}

function evaluateConditionNode(node, payload) {
  let finalSource = payload
  if (node.source === 'Event') {
    finalSource = payload
  } else if (node.source === 'GlobalVars') {
    finalSource = globalVars
  }
  const { field, operator, value } = node
  const actual = finalSource[field] //事件輸入
  const val = value //規則值

  // console.log(
  //   '[rule][field]: ' + field + ',[operator]: ' + operator + ',[val]: ' + val
  // )
  // console.log('[event][payload]: ', payload)
  switch (operator) {
    case 'StringEquals':
      return String(actual) == String(val)
    case 'StringNotEquals':
      return String(actual) != String(val)
    case 'StringEqualsIgnoreCase':
      return String(actual).toLowerCase() == String(val).toLowerCase()
    case 'StringNotEqualsIgnoreCase':
      return String(actual).toLowerCase() != String(val).toLowerCase()
    case 'StringStartsWith':
      return String(actual).startsWith(String(val))
    case 'StringStartsWithIgnoreCase':
      return String(actual).toLowerCase().startsWith(String(val).toLowerCase())
    case 'StringLike':
      const StringLikePattern = String(val)
        .replace(/[-[\]{}()+.,\\^$|#\s]/g, '\\$&') // 轉義特殊字元
        .replace(/\*/g, '.*') // * 代表任意字元
        .replace(/\?/g, '.') // ? 代表任一字元
      const StringLikeRegex = new RegExp('^' + StringLikePattern + '$', 'i') // 'i' 忽略大小寫
      return StringLikeRegex.test(String(actual))
    case 'StringNotLike':
      const StringNotLikePattern = String(val)
        .replace(/[-[\]{}()+.,\\^$|#\s]/g, '\\$&') // 轉義特殊字元
        .replace(/\*/g, '.*') // * 代表任意字元
        .replace(/\?/g, '.') // ? 代表任一字元
      const StringNotLikeRegex = new RegExp(
        '^' + StringNotLikePattern + '$',
        'i'
      ) // 'i' 忽略大小寫
      return !StringNotLikeRegex.test(String(actual))
    case 'NumericEquals':
      return Number(actual) == Number(val)
    case 'NumericNotEquals':
      return Number(actual) == Number(val)
    case 'NumericLessThan':
      return Number(actual) < Number(val)
    case 'NumericLessThanEquals':
      return Number(actual) <= Number(val)
    case 'NumericGreaterThan':
      return Number(actual) > Number(val)
    case 'NumericGreaterThanEquals':
      return Number(actual) >= Number(val)
    case 'BoolEquals':
      return (
        Boolean(actual) ===
        (val === true || String(val).toLocaleLowerCase() === 'true')
      )
    case 'BoolNotEquals':
      return (
        Boolean(actual) !==
        (val === true || String(val).toLocaleLowerCase() === 'true')
      )
    default:
      return false
  }
}

const ActionExecuter = {
  set_string_global_value: (params, ruleName, context) => {
    globalVars[params.key] = interpolate(params.val, context)
    displayGlobalVars()
  },
  set_number_global_value: (params, ruleName, context) => {
    globalVars[params.key] = parseFloat(interpolate(params.val, context))
    displayGlobalVars()
  },
  redirect_uri: (params, ruleName, context) => {
    const { url, openMode } = params
    if (openMode === 'self') {
      window.location.href = url // 直接在當前視窗開啟
    } else if (openMode === 'blank') {
      window.open(url, '_blank') // 新開一個分頁
    } else {
    }
  }
}

const EventManager = {
  invoke: event => {
    for (const rule of rules) {
      if (
        !rule.enabled ||
        rule.eventType !== event.type ||
        !rule.sources.includes(event.target)
      )
        continue

      const conditions_result = rule.conditions.map(condition =>
        evaluateConditionNode(condition, event.payload)
      )

      console.log('conditions_result: ', conditions_result)

      const is_trigger_action = conditions_result.every(Boolean)

      if (is_trigger_action) {
        let i = 0

        rule.actions.forEach(action => {
          const executor = ActionExecuter[action.type]

          if (executor) executor(action.params, rule.name, event.payload)
        })
      }
    }
  }
}

function simulateEvent() {
  const event = JSON.parse(document.getElementById('eventInput').value)
  EventManager.invoke(event)
}

function loadRules(rule) {
  try {
    rules = rule
    //依據優先順序排列(大的優先權高)
    rules.sort((a, b) => b.priority - a.priority)
  } catch (e) {
    log('規則格式錯誤：' + e.message, 'red')
  }
}
