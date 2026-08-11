<script setup>
const handleLink = () => {
  alert('링크를 클릭했습니다.')
}
const handleBox = () => {
  alert('부모 박스를 클릭했습니다.')
}
const handleChild1 = () => {
  alert('자식 박스를 클릭했습니다.')
}
const handleChild2 = () => {
  alert('자식 2')
}
</script>

<template>
  <div class="practice-section">
    <h2>이벤트 수식어 학습</h2>
    <p>1) 이벤트 전파 방지</p>
    <a href="https://www.naver.com" @click.prevent="handleLink">네이버 링크</a>
    <br />
    <h3>2) .stop (이벤트 버블링 막기)</h3>
    <div @click="handleBox" style="padding: 20px; background-color: #eee">
      <p>부모 영역 (클릭 시 alert 발동)</p>
      <button @click="handleChild1">버블링 발생 버튼</button>
      <button @click.stop="handleChild2">버블링 차단 버튼</button>
    </div>
  </div>
</template>
