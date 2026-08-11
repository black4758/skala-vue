<script setup>
import { ref } from 'vue'
const input = ref(null)
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

// 도시 클릭 시 선택된 도시 이름 업데이트
const selectCity = (cityName) => {
  selectedCity.value = cityName
}
</script>
<template>
  <div class="weather-mockup">
    <h2>Weather Mockup</h2>
    <div>
      <h3>도시검색</h3>
      <input
        type="text"
        :value="input"
        @input="input = $event.target.value"
        placeholder="검색할 도시 이름 입력"
      />
      <p>입력한 도시 이름: {{ input }}</p>
    </div>
    <div>
      <h3>지역별 날씨 현황</h3>
      <ul>
        <li v-for="city in weatherList" :key="city.id" @click="selectCity(city.name)">
          <div>
            {{ city.name }} - {{ city.temp }}°C - {{ city.status }} - 습도: {{ city.humidity }}%
            <button @click.stop="showDetail(city.name, city.status)">상세보기</button>
            <span v-if="city.temp >= 25"> (더움)</span>
            <span v-else> (선선함)</span>
          </div>
        </li>
      </ul>
      <p v-if="selectedCity">이 지역은 {{ selectedCity }}입니다.</p>
      <p v-else>카드를 클릭하세요</p>
    </div>
  </div>
</template>
