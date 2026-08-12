<!-- WeatherParent.vue -->
<script setup>
import { ref, computed, watch, watchEffect } from 'vue'
import BaseDashboardCard from './BaseDashboardCard.vue'
import SearchBar from './SearchBar.vue'
import WeatherCard from './WeatherCard.vue'
import SelectionFeedback from './SelectionFeedback.vue'

// 1. 반응형 상태 정의 유지
const searchQuery = ref('')
const selectedCityInfo = ref(null)
const weatherList = ref([
  { id: 'city_01', name: '서울', temp: 28, status: '맑음', humidity: 60 },
  { id: 'city_02', name: '수원', temp: 24, status: '비', humidity: 80 },
  { id: 'city_03', name: '부산', temp: 26, status: '구름', humidity: 70 },
  { id: 'city_04', name: '제주', temp: 26, status: '구름', humidity: 80 },
])

const showDetail = (cityName, status) => {
  window.alert(`${cityName}의 현재 날씨는 [${status}] 상태입니다.`)
}

const selectCity = (cityName) => {
  selectedCityInfo.value = cityName
}

// 2. 검색어 필터링 유지
const filteredWeatherList = computed(() => {
  if (!searchQuery.value) return weatherList.value
  return weatherList.value.filter((city) => city.name.includes(searchQuery.value.trim()))
})

// 5. 불쾌지수 계산 유지
const displayWeatherList = computed(() => {
  return filteredWeatherList.value.map((city) => {
    const discomfIndex = Math.round(
      0.81 * city.temp + 0.01 * city.humidity * (0.99 * city.temp - 14.3) + 46.3,
    )
    return {
      ...city,
      discomfIndex,
      isHighDiscomfort: discomfIndex >= 75,
    }
  })
})

// 3 & 5. selectedCityInfo 감시 유지
watch(selectedCityInfo, (newCityName, oldCityName) => {
  console.log(`[watch] 선택 도시 변경: ${oldCityName || '없음'} -> ${newCityName}`)
  if (!newCityName) return

  const targetCity = displayWeatherList.value.find((city) => city.name === newCityName)
  if (targetCity && targetCity.isHighDiscomfort) {
    alert(`⚠️ 경고: ${targetCity.name}의 불쾌지수는 [${targetCity.discomfIndex}]로 매우 높습니다!`)
  }
})

// 3. searchQuery 감시 유지
watchEffect(() => {
  console.log(`[watchEffect] 현재 검색어: "${searchQuery.value || ''}"`)
})

// SearchBar로부터의 이벤트 처리
const handleUpdateQuery = (newQuery) => {
  searchQuery.value = newQuery
}
</script>

<template>
  <div class="weather-mockup">
    <!-- 헤더 영역 -->
    <header class="app-header">
      <h2>☀️ Weather Dashboard</h2>
      <p class="subtitle">실시간 지역별 날씨 현황 및 검색</p>
    </header>

    <!-- 도시 검색 섹션 (BaseDashboardCard 사용) -->
    <BaseDashboardCard>
      <!-- SearchBar 컴포넌트를 slot으로 주입 -->
      <SearchBar 
        :search-query="searchQuery" 
        @update-query="handleUpdateQuery"
      />
    </BaseDashboardCard>

    <!-- 날씨 리스트 섹션 (BaseDashboardCard 사용) -->
    <BaseDashboardCard>
      <template #header>
        <h3 class="section-title">지역별 날씨 현황</h3>
        <span class="count-badge">총 {{ displayWeatherList.length }}개 도시</span>
      </template>

      <!-- 날씨 카드 그리드 -->
      <div v-if="displayWeatherList.length > 0" class="card-grid">
        <WeatherCard
          v-for="city in displayWeatherList"
          :key="city.id"
          :city="city"
          :is-active="selectedCityInfo === city.name"
          @select-card="selectCity"
          @click-detail="showDetail"
        />
      </div>

      <!-- 빈 상태 표시 -->
      <div v-else class="empty-state">
        <p>🔍 검색어와 일치하는 도시가 없습니다.</p>
      </div>

      <!-- 선택된 도시 안내 바 (추가 분리된 컴포넌트) -->
      <SelectionFeedback :selected-city-info="selectedCityInfo" />
    </BaseDashboardCard>
  </div>
</template>

<style scoped>
/* 전역 레이아웃 및 뼈대에 해당하는 CSS만 남김 */
.weather-mockup {
  --primary-color: #2563eb;
  --primary-hover: #1d4ed8;
  --bg-gradient: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  --card-bg: #ffffff;
  --text-main: #0f172a;
  --text-muted: #64748b;
  --border-color: #e2e8f0;

  font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif;
  width: 100%;
  max-width: 768px;
  margin: 40px auto;
  padding: 32px;
  background: var(--bg-gradient);
  border-radius: 24px;
  box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.1);
  color: var(--text-main);
  box-sizing: border-box;
}

.app-header {
  margin-bottom: 28px;
  text-align: center;
}

.app-header h2 {
  font-size: 1.75rem;
  font-weight: 800;
  margin: 0 0 6px 0;
  letter-spacing: -0.02em;
}

.subtitle {
  font-size: 0.95rem;
  color: var(--text-muted);
  margin: 0;
}

.section-title {
  font-size: 1.2rem;
  font-weight: 700;
  margin: 0;
}

.count-badge {
  font-size: 0.8rem;
  background: #e0e7ff;
  color: #3730a3;
  padding: 4px 10px;
  border-radius: 9999px;
  font-weight: 600;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.empty-state {
  text-align: center;
  padding: 40px 0;
  color: #64748b;
  background: #ffffff;
  border-radius: 16px;
  margin-bottom: 24px;
}
</style>