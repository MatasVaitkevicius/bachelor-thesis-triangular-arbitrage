import Vue from 'vue'
import moment from 'moment'

Vue.filter('smallNumber', (value, decimals = 18, round = null) => {
  let prefix

  if (value < 0) {
    value = Math.abs(value)
    prefix = '-'
  } else {
    prefix = ''
  }

  round = round === null ? (decimals > 6 ? 6 : 4) : round

  let valueStr = value.toString()

  valueStr = valueStr.padStart(decimals + 1, '0')

  let left = valueStr.substr(0, valueStr.length - decimals) || '0'
  const right = valueStr.substr(left.length) || '0'

  return prefix + Number(left + '.' + right).toFixed(round).toString()
})

Vue.filter('datetime', value => {
  return value ? moment(value).format('DD-MMM-YY HH:mm:ss') : '-'
})

Vue.filter('number', (number, decimals = 0, decPoint = '.', thousandsSep = ',') => {
  decimals = Math.abs(decimals) || 0
  number = parseFloat(number)

  if (!decPoint || !thousandsSep) {
    decPoint = '.'
    thousandsSep = ','
  }

  let roundedNumber = Math.round(Math.abs(number) * ('1e' + decimals)) + ''
  let numbersString = decimals ? (roundedNumber.slice(0, decimals * -1) || 0) : roundedNumber
  let decimalsString = decimals ? roundedNumber.slice(decimals * -1) : ''
  let formattedNumber = ""

  while (numbersString.length > 3) {
    formattedNumber += thousandsSep + numbersString.slice(-3)
    numbersString = numbersString.slice(0, -3)
  }

  if (decimals && decimalsString.length === 1) {
    while (decimalsString.length < decimals) {
      decimalsString = decimalsString + decimalsString
    }
  }

  return (number < 0 ? '-' : '') + numbersString + formattedNumber + (decimalsString ? (decPoint + decimalsString) : '')
})
