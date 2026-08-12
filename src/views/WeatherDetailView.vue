<!-- src/views/WeatherDetailView.vue -->
<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useConfigStore } from '../stores/configStore'

const route = useRoute()
const router = useRouter()
const cityDetail = ref(null)
const configStore = useConfigStore()

// 임시 Mock Data (상세 기상관측 정보 추가)
const mockDetailData = [
  { id: 'city_01', name: '서울', temp: 28, status: '맑음', humidity: 60, wind: '2m/s 북동풍', fineDust: '보통', sunrise: '05:30', sunset: '19:40' },
  { id: 'city_02', name: '수원', temp: 24, status: '비', humidity: 80, wind: '4m/s 남풍', fineDust: '좋음', sunrise: '05:32', sunset: '19:39' },
  { id: 'city_03', name: '부산', temp: 26, status: '구름', humidity: 70, wind: '5m/s 바닷바람', fineDust: '좋음', sunrise: '05:25', sunset: '19:30' },
  { id: 'city_04', name: '제주', temp: 26, status: '구름', humidity: 80, wind: '7m/s 남동풍', fineDust: '보통', sunrise: '05:40', sunset: '19:45' },
]

onMounted(() => {
  // router.params.cityId를 기반으로 Mount 시점에 객체 선택
  const targetId = route.params.cityId
  cityDetail.value = mockDetailData.find(city => city.id === targetId)
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
      <button @click="goBack" class="back-btn">⬅ 대시보드로 돌아가기</button>
    </div>
    
    <div v-else class="error-card">
      <h2>😢 도시 정보를 찾을 수 없습니다.</h2>
      <button @click="goBack" class="back-btn">대시보드로 돌아가기</button>
    </div>
  </div>
</template>

<style scoped>
.detail-view {
  display: flex;
  justify-content: center;
}

.detail-card, .error-card {
  background: white;
  width: 100%;
  max-width: 500px;
  padding: 32px;
  border-radius: 20px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);
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

.back-btn {
  width: 100%;
  padding: 14px;
  background-color: #2563eb;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.05rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.back-btn:hover {
  background-color: #1d4ed8;
}

.error-card {
  text-align: center;
}
</style>