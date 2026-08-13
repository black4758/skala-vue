<!-- src/views/WeatherAboutView.vue -->
<script setup>
import { useRouter } from 'vue-router'
import Button from 'primevue/button'
const router = useRouter()
</script>

<template>
  <div class="about-view">
    <div class="card">
      <h2>☁️ Weather App 소개</h2>
      <p>본 서비스는 실시간 지역별 날씨 현황을 제공하는 대시보드입니다.</p>
      <p>Vue Router를 활용한 SPA(Single Page Application)로 제작되었습니다.</p>
      <Button @click="router.push('/')" label="🏠 메인 대시보드로 돌아가기" class="mt-4" />
    </div>
  </div>
</template>

<style scoped>
.card {
  background: white;
  padding: 30px;
  border-radius: 16px;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}
.mt-4 {
  margin-top: 20px;
}
</style>