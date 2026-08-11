<script setup>
const id = 'user-profile-card'
const src = 'https://vuejs.org/images/logo.png'
</script>
<template>
  <div class="practice-section">
    <h2>v-bind 디렉티브 학습</h2>
    <div :id="id">
      <img :src="src" alt="Vue 로고" style="width: 100px" />
    </div>
  </div>
</template>
