<!-- src/views/WeatherHomeView.vue (기존 WeatherParent.vue 대체) -->
<script setup>
import { ref, computed, watch, watchEffect, onMounted } from 'vue'
import { useRouter } from 'vue-router'
// 💡 방금 만든 스토어 가져오기!
import { useWeatherStore } from '../stores/weatherStore' 

import BaseDashboardCard from '../components/exercise/BaseDashboardCard.vue'
import SearchBar from '../components/exercise/SearchBar.vue'
import WeatherCard from '../components/exercise/WeatherCard.vue'
import SelectionFeedback from '../components/exercise/SelectionFeedback.vue'

const router = useRouter()
const weatherStore = useWeatherStore() // 스토어 연결

const searchQuery = ref('')
const selectedCityInfo = ref(null)

onMounted(() => {
  weatherStore.fetchAllWeather()
})

// 화면 이동 및 선택
const showDetail = (cityId) => {
  router.push('/weather/' + cityId)
}

const selectCity = (cityName) => {
  selectedCityInfo.value = cityName
}

// 💡 엄청나게 간결해진 리스트! (불쾌지수 계산은 스토어에서 이미 끝남)
const displayWeatherList = computed(() => {
  if (!searchQuery.value) return weatherStore.weatherList
  
  // 검색어가 있으면 필터링해서 보여주기
  return weatherStore.weatherList.filter((city) => 
    city.name.includes(searchQuery.value.trim())
  )
})

watch(selectedCityInfo, (newCityName, oldCityName) => {
  if (!newCityName) return
  console.log(`[watch] 선택 도시 변경: ${oldCityName || '없음'} -> ${newCityName}`)

  const targetCity = displayWeatherList.value.find((city) => city.name === newCityName)
  if (targetCity && targetCity.isHighDiscomfort) {
    alert(`⚠️ 경고: ${targetCity.name}의 불쾌지수는 [${targetCity.discomfIndex}]로 매우 높습니다!`)
  }
})

watchEffect(() => {
  console.log(`[watchEffect] 현재 검색어: "${searchQuery.value}"`)
})

const handleUpdateQuery = (newQuery) => {
  searchQuery.value = newQuery
}
</script>


<template>
  <div>
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