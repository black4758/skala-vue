// src/stores/configStore.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useConfigStore = defineStore('config', () => {
  // 1. State: 기본 단위는 섭씨('celsius')
  const unit = ref('celsius')

  // 2. Getter: 화면에 표시할 기호(°C 또는 °F)를 계산
  const unitSymbol = computed(() => (unit.value === 'celsius' ? '°C' : '°F'))

  // 3. Action: 단위를 토글하는 함수
  const toggleUnit = () => {
    unit.value = unit.value === 'celsius' ? 'fahrenheit' : 'celsius'
  }

  // 4. 온도를 단위에 맞게 변환하는 함수
  const convertTemp = (rawTemp) => {
    if (unit.value === 'fahrenheit') {
      return Math.round((rawTemp * 9) / 5 + 32)
    }
    return rawTemp
  }

  return { unit, unitSymbol, toggleUnit, convertTemp }
})