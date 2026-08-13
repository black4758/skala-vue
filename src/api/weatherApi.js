import axios from "axios";

const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

export const fetchWeatherByCity = async (cityName) => {
  try {
    const response = await axios.get(`${BASE_URL}/weather`, {
      params: {
        q: cityName,
        appid: API_KEY,
        units: 'metric', // 섭씨온도
        lang: 'kr'       // 날씨 상태(description)를 한국어로 받기 위함
      }
    });
    return response.data;
  } catch (error) {
    console.error(`[API 에러] ${cityName} 날씨 정보를 가져오는데 실패했습니다:`, error);
    throw error; // 에러를 던져서 컴포넌트에서 잡도록 함
  }
};

export const fetchForecastByCity = async (cityName) => {
  try {
    const response = await axios.get(`${BASE_URL}/forecast`, {
      params: {
        q: cityName,
        appid: API_KEY,
        units: 'metric',
        lang: 'kr'
      }
    });
    return response.data;
  } catch (error) {
    console.error(`[API 에러] ${cityName} 일기예보를 가져오는데 실패했습니다:`, error);
    throw error;
  }
};

export const fetchAirPollution = async (lat, lon) => {
  try {
    const response = await axios.get(`${BASE_URL}/air_pollution`, {
      params: {
        lat: lat,
        lon: lon,
        appid: API_KEY,
      }
    });
    return response.data;
  } catch (error) {
    console.error(`대기질 정보를 가져오는데 실패했습니다:`, error);
    throw error;
  }
};