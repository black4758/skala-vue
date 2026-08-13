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
  if (weatherStore.weatherList.length === 0) return null
  return [...weatherStore.weatherList].sort((a, b) => b.temp - a.temp)[0]
})

// 💡 추가 활용 6: 가장 기온이 낮은 도시 찾기
const coldestCity = computed(() => {
  if (weatherStore.weatherList.length === 0) return null
  return [...weatherStore.weatherList].sort((a, b) => a.temp - b.temp)[0]
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

// 💡 추가 활용 7: 여행가기 좋은 지역 추천 (온도 18~26도, 습도 60% 이하, 미세먼지 좋음/보통)
const goodTravelCities = computed(() => {
  return weatherStore.weatherList.filter(city => {
    const isGoodTemp = city.temp >= 18 && city.temp <= 26
    const isGoodHumidity = city.humidity <= 60
    const isGoodAir = city.fineDust.includes('좋음') || city.fineDust.includes('보통')
    return isGoodTemp && isGoodHumidity && isGoodAir
  })
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
        <button @click="router.push('/weather/' + hottestCity.id)" class="btn-detail">
          상세보기
        </button>
      </div>

      <!-- 통계 카드 3: 가장 바람이 강한 지역 -->
      <div class="stat-card windiest" v-if="windiestCity">
        <h3>🌬️ 바람이 가장 강한 지역</h3>
        <div class="stat-value">{{ windiestCity.name }}</div>
        <div class="stat-sub">풍속 {{ windiestCity.wind }}</div>
        <button @click="router.push('/weather/' + windiestCity.id)" class="btn-detail">
          상세보기
        </button>
      </div>

      <!-- 통계 카드 4: 가장 추운 지역 (신규 추가) -->
      <div class="stat-card coldest" v-if="coldestCity">
        <h3>❄️ 가장 추운 지역</h3>
        <div class="stat-value">{{ coldestCity.name }}</div>
        <div class="stat-sub">({{ configStore.convertTemp(coldestCity.temp) }}{{ configStore.unitSymbol }})</div>
        <button @click="router.push('/weather/' + coldestCity.id)" class="btn-detail">
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

      <!-- 리스트 2: 미세먼지 청정 구역 -->
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

      <!-- 리스트 3: 여행 추천 지역 -->
      <div class="list-section travel">
        <h3>
          ✈️ 지금 여행가기 딱 좋은 지역
          <span class="info-wrapper">
            <i class="pi pi-info-circle info-icon"></i>
            <span class="info-tooltip">
              <strong>💡 추천 기준</strong><br>
              • 온도: 18°C ~ 26°C<br>
              • 습도: 60% 이하<br>
              • 미세먼지: 좋음 또는 보통
            </span>
          </span>
        </h3>
        <ul v-if="goodTravelCities.length > 0" class="warning-list">
          <li v-for="city in goodTravelCities" :key="city.id">
            <strong>{{ city.name }}</strong>
            <span class="status">{{ configStore.convertTemp(city.temp) }}{{ configStore.unitSymbol }}, 습도 {{ city.humidity }}%</span>
          </li>
        </ul>
        <div v-else class="empty-state">
          <p>현재 여행 조건(온도/습도/공기)에 딱 맞는 곳이 없네요 😭</p>
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

.stat-card.coldest {
  border: 2px solid #93c5fd;
  background-color: #eff6ff;
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
.btn-detail {
  width: 100%;
  margin-top: 10px;
  padding: 8px 0;
  background: #f1f5f9;
  border: none;
  border-radius: 8px;
  color: #475569;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-detail:hover {
  background: #e2e8f0;
  color: #0f172a;
}

.lists-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}
@media (min-width: 768px) {
  .lists-grid {
    grid-template-columns: 1fr 1fr;
  }
}
@media (min-width: 1024px) {
  .lists-grid {
    grid-template-columns: 1fr 1fr 1fr;
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
  display: flex;
  align-items: center;
  gap: 8px;
}
.list-section.clean-air h3 {
  color: #059669;
}
.list-section.travel h3 {
  color: #d97706;
}

/* 툴팁 CSS */
.info-wrapper {
  position: relative;
  display: inline-flex;
  align-items: center;
  cursor: help;
  color: #94a3b8;
}
.info-wrapper:hover .info-icon {
  color: #d97706;
}
.info-tooltip {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-top: 8px;
  background: #1e293b;
  color: white;
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: normal;
  line-height: 1.6;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s ease;
  z-index: 10;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}
.info-tooltip::before {
  content: '';
  position: absolute;
  top: -4px;
  left: 50%;
  transform: translateX(-50%) rotate(45deg);
  width: 8px;
  height: 8px;
  background: #1e293b;
}
.info-wrapper:hover .info-tooltip {
  opacity: 1;
  visibility: visible;
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