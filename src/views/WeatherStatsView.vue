<!-- src/views/WeatherStatsView.vue -->
<script setup>
import { onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useConfigStore } from '../stores/configStore'
import { useWeatherStore } from '../stores/weatherStore'

const router = useRouter()
const configStore = useConfigStore()
const weatherStore = useWeatherStore()

onMounted(() => {
  weatherStore.fetchAllWeather()
})

// 💡 배운 것 활용 1: 전체 평균 기온 계산
const averageTemp = computed(() => {
  const total = weatherStore.weatherList.reduce((sum, city) => sum + city.temp, 0)
  return (total / weatherStore.weatherList.length).toFixed(0) // 소수점 1자리까지
})

// 💡 배운 것 활용 2: 가장 기온이 높은 도시 찾기
const hottestCity = computed(() => {
  return [...weatherStore.weatherList].sort((a, b) => b.temp - a.temp)[0]
})

// 💡 배운 것 활용 3: 습도가 70% 이상인 꿉꿉한 지역 필터링
const highHumidityCities = computed(() => {
  return weatherStore.weatherList.filter(city => city.humidity >= 70)
})

// 💡 추가 활용 4: 바람이 가장 강한 지역 (wind 문자열에서 숫자만 추출해 비교)
const windiestCity = computed(() => {
  if (weatherStore.weatherList.length === 0) return null
  return [...weatherStore.weatherList].sort((a, b) => parseFloat(b.wind) - parseFloat(a.wind))[0]
})

// 💡 추가 활용 5: 미세먼지 청정 구역 ('좋음' 상태인 지역)
const cleanAirCities = computed(() => {
  return weatherStore.weatherList.filter(city => city.fineDust.includes('좋음'))
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
        <div class="stat-value" v-if="averageTemp !== 'NaN'">{{ configStore.convertTemp(averageTemp) }}{{ configStore.unitSymbol }}</div>
      </div>

      <!-- 통계 카드 2: 최고 기온 지역 -->
      <div class="stat-card hottest" v-if="hottestCity">
        <h3>🔥 가장 더운 지역</h3>
        <div class="stat-value">{{ hottestCity.name }}</div>
        <div class="stat-sub">({{ configStore.convertTemp(hottestCity.temp) }}{{ configStore.unitSymbol }})</div>
        <button @click="router.push('/weather/' + hottestCity.id)" class="link-btn">
          상세보기
        </button>
      </div>

      <!-- 통계 카드 3: 가장 바람이 강한 지역 (신규 추가) -->
      <div class="stat-card windiest" v-if="windiestCity">
        <h3>🌬️ 바람이 가장 강한 지역</h3>
        <div class="stat-value">{{ windiestCity.name }}</div>
        <div class="stat-sub">풍속 {{ windiestCity.wind }}</div>
        <button @click="router.push('/weather/' + windiestCity.id)" class="link-btn blue-btn">
          상세보기
        </button>
      </div>
    </div>

    <!-- 통계 리스트 영역 (Grid로 나란히 배치) -->
    <div class="lists-grid">
      <!-- 리스트 1: 습도 경고 리스트 -->
      <div class="list-section">
        <h3>💧 습도 주의 지역 (70% 이상)</h3>
        <ul v-if="highHumidityCities.length > 0" class="warning-list">
          <li v-for="city in highHumidityCities" :key="city.id">
            <strong>{{ city.name }}</strong> : 습도 {{ city.humidity }}% 
            <span class="status">({{ city.status }})</span>
          </li>
        </ul>
        <div v-else class="empty-state">
          <p>현재 습도가 높은 꿉꿉한 지역이 없습니다! 🎉</p>
        </div>
      </div>

      <!-- 리스트 2: 미세먼지 청정 구역 (신규 추가) -->
      <div class="list-section clean-air">
        <h3>🍃 미세먼지 청정 구역</h3>
        <ul v-if="cleanAirCities.length > 0" class="warning-list">
          <li v-for="city in cleanAirCities" :key="city.id">
            <strong>{{ city.name }}</strong> : {{ city.fineDust }}
          </li>
        </ul>
        <div v-else class="empty-state">
          <p>현재 미세먼지 '좋음'인 지역이 없습니다 😢</p>
        </div>
      </div>
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
.link-btn.blue-btn {
  background: #2563eb;
}

.lists-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}
@media (min-width: 600px) {
  .lists-grid {
    grid-template-columns: 1fr 1fr;
  }
}

.list-section {
  background: white;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
}
.list-section h3 {
  margin-top: 0;
  color: #475569;
  font-size: 1.1rem;
  border-bottom: 2px solid #f1f5f9;
  padding-bottom: 12px;
}
.list-section.clean-air h3 {
  color: #059669;
}

.warning-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.warning-list li {
  padding: 12px 0;
  border-bottom: 1px solid #e2e8f0;
  font-size: 1.05rem;
}
.warning-list li:last-child {
  border-bottom: none;
}
.status { color: #3b82f6; font-size: 0.95rem; margin-left: 8px; }

.empty-state {
  text-align: center;
  color: #94a3b8;
  padding: 20px 0;
  font-size: 0.95rem;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}
.empty-state p { margin: 0; }
</style>