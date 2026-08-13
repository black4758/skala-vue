<!-- src/views/WeatherDetailView.vue -->
<script setup>
import { computed, onMounted } from 'vue' // 💡 computed 추가, ref 제거
import { useRoute, useRouter } from 'vue-router'
import { useConfigStore } from '../stores/configStore'
import { useWeatherStore } from '../stores/weatherStore'
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
      
      <!-- 하단 버튼 -->
      <Button @click="goBack" class="w-full" label="⬅ 대시보드로 돌아가기" size="large" />
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

.error-card {
  text-align: center;
}
</style>