<script setup>
import { ref } from 'vue'
const text1 = ref('') // v-model용 변수
const text2 = ref('') // 원리 이해용 변수
</script>
<template>
  <div class="practice-section">
    <h2>v-model 디렉티브 학습</h2>
    <h3>양방향 바인딩</h3>
    <input type="text" v-model="text1" placeholder="내용을 입력하세요" />
    <p>입력한 내용: {{ text1 }}</p>

    <h3>v-model 원리 이해</h3>
    <input
      type="text"
      :value="text2"
      @input="(e) => (text2 = e.target.value)"
      placeholder="내용을 입력하세요"
    />
    <p>입력한 내용: {{ text2 }}</p>
  </div>
</template>
