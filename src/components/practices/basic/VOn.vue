<script setup>
import { ref } from 'vue'
const count = ref(0)

const showAlert = () => {
  alert('버튼 클릭!')
}
</script>

<template>
  <div class="practice-section">
    <h2>v-on 디렉티브 학습</h2>
    <p>버튼 클릭 횟수: {{ count }}</p>
    <button @click="count++">숫자 증가 버튼</button>
    <br />
    <button @click="showAlert">알림창 버튼</button>
  </div>
</template>
