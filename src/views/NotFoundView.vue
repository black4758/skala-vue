<!-- src/views/NotFoundView.vue -->
<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
</script>

<template>
  <div class="not-found">
    <h1>404</h1>
    <h2>페이지를 찾을 수 없습니다 😢</h2>
    <p>요청하신 주소가 올바른지 다시 확인해 주세요.</p>
    <button @click="router.push('/')">홈으로 돌아가기</button>
  </div>
</template>

<style scoped>
.not-found {
  text-align: center;
  padding: 50px 0;
}
h1 { font-size: 5rem; margin: 0; color: #dc2626; }
button {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #64748b;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}
</style>