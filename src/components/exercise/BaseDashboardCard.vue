<!-- BaseDashboardCard.vue -->
<template>
  <section class="dashboard-section">
    <!-- 타이틀이나 배지 등이 들어갈 수 있는 헤더 슬롯 -->
    <div v-if="$slots.header" class="section-header">
      <slot name="header"></slot>
    </div>
    
    <!-- 메인 컨텐츠가 들어갈 기본 슬롯 -->
    <slot></slot>
  </section>
</template>

<style scoped>
.dashboard-section {
  background: var(--card-bg, #ffffff);
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  margin-bottom: 28px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}
</style>