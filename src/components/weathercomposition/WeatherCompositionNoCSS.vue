<script setup>
import { ref, computed, watch, watchEffect } from 'vue'

// 1. 요구사항 변수명에 맞게 반응형 상태 정의
const searchQuery = ref(null) // 검색어
const selectedCityInfo = ref(null) // 선택된 도시
const weatherList = ref([
  { id: 'city_01', name: '서울', temp: 28, status: '맑음', humidity: 60 },
  { id: 'city_02', name: '수원', temp: 24, status: '비', humidity: 80 },
  { id: 'city_03', name: '부산', temp: 26, status: '구름', humidity: 70 },
  { id: 'city_04', name: '제주', temp: 26, status: '구름', humidity: 80 },
])

const showDetail = (cityName, status) => {
  window.alert(`${cityName}의 현재 날씨는 [${status}] 상태입니다.`)
}

// 도시 클릭 시 선택된 도시 이름 업데이트
const selectCity = (cityName) => {
  selectedCityInfo.value = cityName
}

// 2. 검색어 필터링 (filteredWeatherList)
const filteredWeatherList = computed(() => {
  if (!searchQuery.value) return weatherList.value

  return weatherList.value.filter((city) => city.name.includes(searchQuery.value.trim()))
})

// 5. [나만의 Computed] 불쾌지수가 추가 계산된 도시 목록
const displayWeatherList = computed(() => {
  return filteredWeatherList.value.map((city) => {
    // 불쾌지수 공식
    const discomfIndex = Math.round(
      0.81 * city.temp + 0.01 * city.humidity * (0.99 * city.temp - 14.3) + 46.3,
    )

    return {
      ...city,
      discomfIndex,
      isHighDiscomfort: discomfIndex >= 75, // 75 이상이면 높음
    }
  })
})

// 3. selectedCityInfo 감시 (watch 이용) & 5. [나만의 Watcher] 불쾌지수 알림
watch(selectedCityInfo, (newCityName, oldCityName) => {
  // 요구사항 3: 상태바 문구가 바뀔 때마다 콘솔로그 작성
  console.log(`[watch] 선택 도시 변경: ${oldCityName || '없음'} -> ${newCityName}`)

  if (!newCityName) return

  // displayWeatherList에서 선택한 도시의 불쾌지수 정보 참조
  const targetCity = displayWeatherList.value.find((city) => city.name === newCityName)

  // 불쾌지수가 75 이상인 경우 경고 알림
  if (targetCity && targetCity.isHighDiscomfort) {
    alert(`⚠️ 경고: ${targetCity.name}의 불쾌지수는 [${targetCity.discomfIndex}]로 매우 높습니다!`)
  }
})

// 3. searchQuery 감시 (watchEffect 이용): 타이핑 시마다 콘솔로그 작성
watchEffect(() => {
  console.log(`[watchEffect] 현재 검색어: "${searchQuery.value || ''}"`)
})
</script>

<template>
  <div class="weather-mockup">
    <h2>Weather Mockup</h2>
    <div>
      <h3>도시검색</h3>
      <input
        type="text"
        :value="searchQuery"
        @input="searchQuery = $event.target.value"
        placeholder="검색할 도시 이름 입력"
      />
      <p>입력한 도시 이름: {{ searchQuery }}</p>
    </div>
    <div>
      <h3>지역별 날씨 현황</h3>

      <!-- 4. 검색 결과 표시 (Template 영역) -->
      <ul v-if="displayWeatherList.length > 0">
        <li v-for="city in displayWeatherList" :key="city.id" @click="selectCity(city.name)">
          <div>
            {{ city.name }} - {{ city.temp }}°C - {{ city.status }} - 습도: {{ city.humidity }}%

            <span v-if="city.isHighDiscomfort" style="color: orange; font-weight: bold">
              [불쾌지수: {{ city.discomfIndex }}]
            </span>

            <button @click.stop="showDetail(city.name, city.status)">상세보기</button>
            <span v-if="city.temp >= 25"> (더움)</span>
            <span v-else> (선선함)</span>
          </div>
        </li>
      </ul>
      <p v-else>검색 결과가 일치하는 도시가 없습니다.</p>

      <p v-if="selectedCityInfo">이 지역은 {{ selectedCityInfo }}입니다.</p>
      <p v-else>카드를 클릭하세요</p>
    </div>
  </div>
</template>
