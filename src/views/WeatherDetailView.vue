<!-- src/views/WeatherDetailView.vue -->
<script setup>
import { computed, onMounted, ref, watch } from 'vue' // 💡 computed 추가, ref 제거
import { useRoute, useRouter } from 'vue-router'
import { useConfigStore } from '../stores/configStore'
import { useWeatherStore } from '../stores/weatherStore'
import { fetchForecastByCity } from '../api/weatherApi'
import Button from 'primevue/button'

const route = useRoute()
const router = useRouter()
const configStore = useConfigStore()
const weatherStore = useWeatherStore()

onMounted(() => {
  // 스토어에 "날씨 데이터 좀 가져와 줘!" 라고 요청 (이미 있으면 알아서 안 가져옴)
  weatherStore.fetchAllWeather() 
})

// 💡 핵심: 가짜 데이터 지우고, 스토어에서 내 도시(targetId)랑 이름이 똑같은 애를 찾아서 반환!
const cityDetail = computed(() => {
  const targetId = route.params.cityId
  return weatherStore.weatherList.find(city => city.id === targetId)
})

const forecastList = ref([])
const isLoadingForecast = ref(true)
const timezoneOffset = ref(0) // 💡 도시의 타임존 오프셋 저장

watch(() => cityDetail.value, async (newVal) => {
  if (newVal) {
    isLoadingForecast.value = true
    try {
      const data = await fetchForecastByCity(newVal.id)
      // 타임존 오프셋(초 단위) 저장
      timezoneOffset.value = data.city.timezone || 0
      // 향후 24시간(8개) 데이터만 가져오기
      forecastList.value = data.list.slice(0, 8)
    } catch (e) {
      console.error("일기예보 로드 실패", e)
    } finally {
      isLoadingForecast.value = false
    }
  }
}, { immediate: true })

const formatForecastTime = (dt_txt) => {
  // API가 주는 dt_txt는 UTC 기준 문자열 (예: "2024-08-13 12:00:00")
  // 1. 공백을 T로 바꾸고 Z를 붙여서 명시적인 UTC 시간으로 파싱
  const date = new Date(dt_txt.replace(' ', 'T') + 'Z')
  // 2. 해당 도시의 타임존 오프셋(초)을 더해서 해당 도시의 현지 시간으로 변환
  date.setSeconds(date.getSeconds() + timezoneOffset.value)
  // 3. 변환된 시간에서 UTC 기준의 시간(Hours)만 추출하면 정확한 현지 시간이 됨!
  return `${date.getUTCHours()}시`
}

const getWeatherEmoji = (icon) => {
  const map = {
    '01d': '☀️', '01n': '🌙',
    '02d': '⛅', '02n': '☁️',
    '03d': '☁️', '03n': '☁️',
    '04d': '☁️', '04n': '☁️',
    '09d': '🌧️', '09n': '🌧️',
    '10d': '🌦️', '10n': '🌦️',
    '11d': '⛈️', '11n': '⛈️',
    '13d': '❄️', '13n': '❄️',
    '50d': '🌫️', '50n': '🌫️'
  }
  return map[icon] || '☁️'
}

const goBack = () => {
  router.push('/')
}
</script>

<template>
  <div class="detail-view">
    <div v-if="cityDetail" class="detail-card">
      <!-- 상단 헤더 영역 -->
      <div class="card-header">
        <h2>📍 {{ cityDetail.name }} 상세 날씨</h2>
        <span class="status-badge">{{ cityDetail.status }}</span>
      </div>

      <!-- 메인 기온 영역 -->
      <div class="main-temp-display">
        <span class="temp">{{ configStore.convertTemp(cityDetail.temp) }}</span>
        <span class="unit">{{ configStore.unitSymbol }}</span>
      </div>

      <!-- 상세 정보 그리드 영역 -->
      <div class="info-grid">
        <div class="info-item">
          <span class="icon">💧</span>
          <div class="text-group">
            <span class="label">습도</span>
            <span class="value">{{ cityDetail.humidity }}%</span>
          </div>
        </div>
        
        <div class="info-item">
          <span class="icon">🌬️</span>
          <div class="text-group">
            <span class="label">풍속</span>
            <span class="value">{{ cityDetail.wind }}</span>
          </div>
        </div>

        <div class="info-item">
          <span class="icon">😷</span>
          <div class="text-group">
            <span class="label">미세먼지</span>
            <span class="value">{{ cityDetail.fineDust }}</span>
          </div>
        </div>

        <div class="info-item">
          <span class="icon">🌅</span>
          <div class="text-group">
            <span class="label">일출/일몰</span>
            <span class="value">{{ cityDetail.sunrise }} / {{ cityDetail.sunset }}</span>
          </div>
        </div>
      </div>

      <!-- 시간별 일기예보 영역 (신규) -->
      <div class="forecast-section">
        <h3>🕒 시간별 예보 (24시간)</h3>
        
        <!-- 로딩 중일 때 표시할 UI -->
        <div v-if="isLoadingForecast" class="forecast-loading">
          <span class="spinner">⏳</span> 예보 데이터를 불러오는 중...
        </div>

        <!-- 로딩 완료 후 표시할 UI -->
        <div v-else-if="forecastList.length > 0" class="forecast-scroll">
          <div class="forecast-item" v-for="item in forecastList" :key="item.dt">
            <div class="time">{{ formatForecastTime(item.dt_txt) }}</div>
            <div class="weather-emoji">{{ getWeatherEmoji(item.weather[0].icon) }}</div>
            <div class="temp">{{ configStore.convertTemp(item.main.temp) }}{{ configStore.unitSymbol }}</div>
          </div>
        </div>
      </div>
      
      <!-- 하단 버튼 -->
      <Button @click="goBack" class="w-full" label="대시보드로 돌아가기" size="large" />
    </div>
    
    <div v-else class="error-card">
      <h2>😢 도시 정보를 찾을 수 없습니다.</h2>
      <Button @click="goBack" class="w-full mt-4" label="대시보드로 돌아가기" size="large" />
    </div>
  </div>
</template>

<style scoped>
.detail-view {
  width: 100%;
}

.detail-card, .error-card {
  background: white;
  width: 100%;
  padding: 32px;
  border-radius: 20px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);
  box-sizing: border-box;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  border-bottom: 1px solid #f1f5f9;
  padding-bottom: 16px;
}

.card-header h2 {
  margin: 0;
  font-size: 1.4rem;
  color: #0f172a;
}

.status-badge {
  background: #eff6ff;
  color: #2563eb;
  padding: 6px 14px;
  border-radius: 20px;
  font-weight: 700;
  font-size: 0.95rem;
}

.main-temp-display {
  text-align: center;
  margin: 30px 0;
}

.main-temp-display .temp {
  font-size: 4rem;
  font-weight: 800;
  color: #0f172a;
  line-height: 1;
}

.main-temp-display .unit {
  font-size: 1.5rem;
  font-weight: 600;
  color: #64748b;
  margin-left: 4px;
  vertical-align: super;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 32px;
}

.info-item {
  display: flex;
  align-items: center;
  background: #f8fafc;
  padding: 16px;
  border-radius: 12px;
  gap: 12px;
}

.info-item .icon {
  font-size: 1.5rem;
}

.text-group {
  display: flex;
  flex-direction: column;
}

.text-group .label {
  font-size: 0.85rem;
  color: #64748b;
  margin-bottom: 4px;
}

.text-group .value {
  font-size: 1.05rem;
  font-weight: 700;
  color: #1e293b;
}

.w-full { width: 100%; }
.mt-4 { margin-top: 16px; }

.forecast-section {
  margin-bottom: 32px;
}

.forecast-section h3 {
  font-size: 1.1rem;
  color: #0f172a;
  margin-bottom: 16px;
  border-bottom: 1px solid #f1f5f9;
  padding-bottom: 8px;
}

.forecast-loading {
  text-align: center;
  padding: 40px 0;
  color: #64748b;
  background: #f8fafc;
  border-radius: 12px;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.spinner {
  display: inline-block;
  margin-right: 10px;
  font-size: 1.2rem;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  100% { transform: rotate(360deg); }
}

.forecast-scroll {
  display: flex;
  overflow-x: auto;
  gap: 12px;
  padding-bottom: 12px;
}

/* 스크롤바 숨기기 (선택사항) */
.forecast-scroll::-webkit-scrollbar {
  height: 6px;
}
.forecast-scroll::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}
.forecast-scroll::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

.forecast-item {
  min-width: 80px;
  background: #f8fafc;
  border-radius: 12px;
  padding: 16px 8px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
}

.forecast-item .time {
  font-size: 0.9rem;
  color: #64748b;
  font-weight: 600;
  margin-bottom: 4px;
}

.forecast-item .weather-emoji {
  font-size: 2.2rem;
  margin: 8px 0;
}

.forecast-item .temp {
  font-size: 1.1rem;
  font-weight: 700;
  color: #0f172a;
}

.error-card {
  text-align: center;
}
</style>