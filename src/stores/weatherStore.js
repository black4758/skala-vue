import { defineStore } from 'pinia'
import { ref } from 'vue'
import { fetchWeatherByCity, fetchAirPollution } from '../api/weatherApi'
export const useWeatherStore = defineStore('weather', () => {
  const weatherList = ref([])
  const isLoading = ref(false)
  const targetCities = [
    { id: 'Seoul', name: '서울' },
    { id: 'Busan', name: '부산' },
    { id: 'Incheon', name: '인천' },
    { id: 'Daegu', name: '대구' },
    { id: 'Daejeon', name: '대전' },
    { id: 'Gwangju', name: '광주' },
    { id: 'Ulsan', name: '울산' },
    { id: 'Jeju', name: '제주' }
  ]
  // 시간 변환 도우미 함수 (일출/일몰용)
  const formatTime = (timestamp) => {
    const date = new Date(timestamp * 1000)
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${hours}:${minutes}`
  }
  // 대기질 지수(AQI)를 한국어 텍스트로 변환하는 함수
  // OpenWeatherMap AQI: 1(Good), 2(Fair), 3(Moderate), 4(Poor), 5(Very Poor)
  const getAqiText = (aqi) => {
    switch (aqi) {
      case 1: return '좋음 🔵'
      case 2: return '보통 🟢'
      case 3: return '나쁨 🟡'
      case 4: return '매우 나쁨 🟠'
      case 5: return '최악 🔴'
      default: return '정보 없음'
    }
  }
  const fetchAllWeather = async () => {
    if (weatherList.value.length > 0) return
    isLoading.value = true
    try {
      // 1. 날씨 데이터 먼저 다 가져오기
      const promises = targetCities.map(city => fetchWeatherByCity(city.id))
      const results = await Promise.all(promises)
      
      // 💡 2. 날씨 데이터 안에 있는 위도(lat), 경도(lon)를 꺼내서 대기질 API 한꺼번에 부르기
      const pollutionPromises = results.map(data => fetchAirPollution(data.coord.lat, data.coord.lon))
      const pollutionResults = await Promise.all(pollutionPromises)
      
      // 3. 두 데이터를 합쳐서 이쁘게 포장하기
      weatherList.value = results.map((data, index) => {
        const temp = Math.round(data.main.temp)
        const humidity = data.main.humidity
        const discomfIndex = Math.round(0.81 * temp + 0.01 * humidity * (0.99 * temp - 14.3) + 46.3)
        
        // 대기질 지수(AQI) 가져오기
        const aqi = pollutionResults[index].list[0].main.aqi
        return {
          id: targetCities[index].id,
          name: targetCities[index].name,
          temp,
          status: data.weather[0].description,
          humidity,
          wind: `${data.wind.speed}m/s`,
          discomfIndex,
          isHighDiscomfort: discomfIndex >= 75,
          sunrise: formatTime(data.sys.sunrise),
          sunset: formatTime(data.sys.sunset),
          // 💡 미세먼지 데이터 추가 완성!
          fineDust: getAqiText(aqi) 
        }
      })
    } catch (error) {
      console.error("날씨 데이터를 불러오는데 실패했습니다.", error)
    } finally {
      isLoading.value = false
    }
  }
  return { weatherList, isLoading, fetchAllWeather }
})