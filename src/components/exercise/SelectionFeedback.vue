<!-- SelectionFeedback.vue -->
<script setup>
defineProps({
  selectedCityInfo: [String, null]
})
</script>

<template>
  <div class="selection-feedback" :class="{ selected: selectedCityInfo }">
    <p v-if="selectedCityInfo">
      📍 현재 선택한 지역: <strong>{{ selectedCityInfo }}</strong>
    </p>
    <p v-else class="placeholder-text">날씨 카드를 클릭하면 상세 선택 정보가 표시됩니다.</p>
  </div>
</template>

<style scoped>
.selection-feedback {
  background: rgba(255, 255, 255, 0.6);
  border: 1px dashed var(--border-color, #e2e8f0);
  padding: 14px 20px;
  border-radius: 12px;
  text-align: center;
  transition: all 0.3s ease;
}

.selection-feedback.selected {
  background: #eff6ff;
  border-style: solid;
  border-color: #bfdbfe;
}

.selection-feedback p {
  margin: 0;
  font-size: 0.9rem;
}

.placeholder-text {
  color: var(--text-muted, #64748b);
}
</style>