<!-- src/views/WeatherStatsView.vue -->
<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useConfigStore } from '../stores/configStore'

const router = useRouter()
const configStore = useConfigStore()

// 대시보드에서 사용했던 임시 데이터 재활용
const weatherList = ref([
  { id: 'city_01', name: '서울', temp: 28, status: '맑음', humidity: 60 },
  { id: 'city_02', name: '수원', temp: 24, status: '비', humidity: 80 },
  { id: 'city_03', name: '부산', temp: 26, status: '구름', humidity: 70 },
  { id: 'city_04', name: '제주', temp: 26, status: '구름', humidity: 80 },
])

// 💡 배운 것 활용 1: 전체 평균 기온 계산
const averageTemp = computed(() => {
  const total = weatherList.value.reduce((sum, city) => sum + city.temp, 0)
  return (total / weatherList.value.length).toFixed(0) // 소수점 1자리까지
})

// 💡 배운 것 활용 2: 가장 기온이 높은 도시 찾기
const hottestCity = computed(() => {
  return [...weatherList.value].sort((a, b) => b.temp - a.temp)[0]
})

// 💡 배운 것 활용 3: 습도가 70% 이상인 꿉꿉한 지역 필터링
const highHumidityCities = computed(() => {
  return weatherList.value.filter(city => city.humidity >= 70)
})
</script>

<template>
  <div class="stats-view">
    <div class="header-section">
      <h2>📊 전국 기상 통계 분석</h2>
      <p>현재 등록된 날씨 데이터를 바탕으로 자동 분석된 결과입니다.</p>
    </div>

    <div class="stats-grid">
      <!-- 통계 카드 1: 평균 기온 -->
      <div class="stat-card">
        <h3>🌡️ 전국 평균 기온</h3>
        <div class="stat-value">{{ configStore.convertTemp(averageTemp) }}{{ configStore.unitSymbol }}</div>
      </div>

      <!-- 통계 카드 2: 최고 기온 지역 -->
      <div class="stat-card hottest">
        <h3>🔥 가장 더운 지역</h3>
        <div class="stat-value">{{ hottestCity.name }} ({{ configStore.convertTemp(hottestCity.temp) }}{{ configStore.unitSymbol }})</div>
        <button @click="router.push('/weather/' + hottestCity.id)" class="link-btn">
          상세보기
        </button>
      </div>
    </div>

    <!-- 통계 카드 3: 습도 경고 리스트 -->
    <div class="list-section">
      <h3>💧 습도 주의 지역 (70% 이상)</h3>
      <ul class="warning-list">
        <li v-for="city in highHumidityCities" :key="city.id">
          <strong>{{ city.name }}</strong> : 습도 {{ city.humidity }}% 
          <span class="status">({{ city.status }})</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.header-section {
  text-align: center;
  margin-bottom: 30px;
}
.header-section h2 { margin-bottom: 5px; color: #0f172a; }
.header-section p { color: #64748b; }

.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 24px;
}

.stat-card {
  background: white;
  padding: 24px;
  border-radius: 16px;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
}
.stat-card.hottest {
  border: 2px solid #fca5a5;
  background-color: #fef2f2;
}

.stat-card h3 {
  margin: 0 0 10px 0;
  font-size: 1.1rem;
  color: #475569;
}
.stat-value {
  font-size: 2rem;
  font-weight: 800;
  color: #0f172a;
}
.link-btn {
  margin-top: 10px;
  padding: 6px 12px;
  background: #dc2626;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.list-section {
  background: white;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
}
.warning-list {
  list-style: none;
  padding: 0;
}
.warning-list li {
  padding: 12px;
  border-bottom: 1px solid #e2e8f0;
  font-size: 1.1rem;
}
.warning-list li:last-child {
  border-bottom: none;
}
.status { color: #3b82f6; font-size: 0.95rem; margin-left: 8px; }
</style>