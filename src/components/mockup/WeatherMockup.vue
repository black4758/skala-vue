<script setup>
import { ref } from 'vue'

const input = ref('')
const weatherList = ref([
  { id: 'city_01', name: '서울', temp: 28, status: '맑음', humidity: 60 },
  { id: 'city_02', name: '수원', temp: 24, status: '비', humidity: 80 },
  { id: 'city_03', name: '부산', temp: 26, status: '구름', humidity: 70 },
  { id: 'city_04', name: '제주', temp: 26, status: '구름', humidity: 80 },
])

const showDetail = (cityName, status) => {
  window.alert(`${cityName}의 현재 날씨는 [${status}] 상태입니다.`)
}

const selectedCity = ref(null)

const selectCity = (cityName) => {
  selectedCity.value = cityName
}
</script>

<template>
  <div class="weather-mockup">
    <!-- 헤더 영역 -->
    <header class="app-header">
      <h2>☀️ Weather Dashboard</h2>
      <p class="subtitle">실시간 지역별 날씨 현황 및 검색</p>
    </header>

    <!-- 도시 검색 섹션 -->
    <section class="search-section">
      <div class="search-box">
        <label for="city-search" class="search-label">도시 검색</label>
        <div class="input-wrapper">
          <svg
            class="search-icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            id="city-search"
            type="text"
            :value="input"
            @input="input = $event.target.value"
            placeholder="검색할 도시 이름을 입력하세요..."
          />
        </div>
        <p class="search-result">
          입력한 도시 이름: <strong>{{ input || '없음' }}</strong>
        </p>
      </div>
    </section>

    <!-- 날씨 리스트 섹션 -->
    <section class="list-section">
      <div class="section-title">
        <h3>지역별 날씨 현황</h3>
        <span class="count-badge">총 {{ weatherList.length }}개 도시</span>
      </div>

      <div class="card-grid">
        <article
          v-for="city in weatherList"
          :key="city.id"
          class="weather-card"
          :class="{ active: selectedCity === city.name }"
          @click="selectCity(city.name)"
        >
          <div class="card-header">
            <div class="city-info">
              <h4 class="city-name">{{ city.name }}</h4>
              <span class="status-badge">{{ city.status }}</span>
            </div>
            <!-- 온도 기반 뱃지 -->
            <span v-if="city.temp >= 25" class="temp-tag hot">더움 🔥</span>
            <span v-else class="temp-tag cool">선선함 🌿</span>
          </div>

          <div class="card-body">
            <div class="temp-display">
              <span class="temp-value">{{ city.temp }}</span>
              <span class="temp-unit">°C</span>
            </div>
            <div class="humidity-display">
              <span class="label">습도</span>
              <span class="value">{{ city.humidity }}%</span>
            </div>
          </div>

          <div class="card-footer">
            <button class="btn-detail" @click.stop="showDetail(city.name, city.status)">
              상세보기
            </button>
          </div>
        </article>
      </div>

      <!-- 선택된 도시 안내 바 -->
      <div class="selection-feedback" :class="{ selected: selectedCity }">
        <p v-if="selectedCity">
          📍 현재 선택한 지역: <strong>{{ selectedCity }}</strong>
        </p>
        <p v-else class="placeholder-text">💡 날씨 카드를 클릭하면 상세 선택 정보가 표시됩니다.</p>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* CSS Reset & Variables */
.weather-mockup {
  --primary-color: #2563eb;
  --primary-hover: #1d4ed8;
  --bg-gradient: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  --card-bg: #ffffff;
  --text-main: #0f172a;
  --text-muted: #64748b;
  --border-color: #e2e8f0;

  font-family:
    'Pretendard',
    -apple-system,
    BlinkMacSystemFont,
    system-ui,
    Roboto,
    sans-serif;

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

/* Header */
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

/* Search Section */
.search-section {
  background: var(--card-bg);
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  margin-bottom: 28px;
}

.search-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 8px;
  color: var(--text-main);
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 14px;
  width: 18px;
  height: 18px;
  color: var(--text-muted);
}

.input-wrapper input {
  width: 100%;
  padding: 12px 16px 12px 42px;
  font-size: 0.95rem;
  border: 1.5px solid var(--border-color);
  border-radius: 10px;
  outline: none;
  transition: all 0.2s ease;
}

.input-wrapper input:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
}

.search-result {
  margin: 10px 0 0 0;
  font-size: 0.85rem;
  color: var(--text-muted);
}

.search-result strong {
  color: var(--primary-color);
}

/* List Section Header */
.section-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.section-title h3 {
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

/* Grid Cards Layout */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.weather-card {
  background: var(--card-bg);
  border: 2px solid transparent;
  border-radius: 16px;
  padding: 16px;
  cursor: pointer;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.weather-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

/* Card Selection Highlight */
.weather-card.active {
  border-color: var(--primary-color);
  background-color: #f0f9ff;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.city-name {
  font-size: 1.15rem;
  font-weight: 700;
  margin: 0 0 2px 0;
}

.status-badge {
  font-size: 0.8rem;
  color: var(--text-muted);
}

.temp-tag {
  font-size: 0.75rem;
  font-weight: 700;
  padding: 4px 8px;
  border-radius: 8px;
}

.temp-tag.hot {
  background: #fef2f2;
  color: #dc2626;
}

.temp-tag.cool {
  background: #f0fdf4;
  color: #16a34a;
}

/* Card Body */
.card-body {
  margin-bottom: 16px;
}

.temp-display {
  display: flex;
  align-items: baseline;
  margin-bottom: 4px;
}

.temp-value {
  font-size: 2.25rem;
  font-weight: 800;
  line-height: 1;
}

.temp-unit {
  font-size: 1rem;
  color: var(--text-muted);
  margin-left: 2px;
}

.humidity-display {
  font-size: 0.8rem;
  color: var(--text-muted);
}

.humidity-display .value {
  font-weight: 600;
  color: var(--text-main);
  margin-left: 4px;
}

/* Detail Button */
.btn-detail {
  width: 100%;
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
  color: var(--text-main);
}

/* Selection Feedback Footer Bar */
.selection-feedback {
  background: rgba(255, 255, 255, 0.6);
  border: 1px dashed var(--border-color);
  padding: 14px 20px;
  border-radius: 12px;
  text-align: center;
  transition: all 0.3s ease;
}

.selection-feedback.selected {
  background: #eff6ff;
  border-style: solid;
  border-color: #bfdbfe;
}

.selection-feedback p {
  margin: 0;
  font-size: 0.9rem;
}

.placeholder-text {
  color: var(--text-muted);
}
</style>
