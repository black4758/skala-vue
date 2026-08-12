<!-- WeatherCard.vue -->
<script setup>
defineProps({
  city: Object,
  isActive: Boolean
})

defineEmits(['select-card', 'click-detail'])
</script>

<template>
  <article 
    class="weather-card" 
    :class="{ active: isActive }" 
    @click="$emit('select-card', city.name)"
  >
    <div class="card-header">
      <div class="city-info">
        <h4 class="city-name">{{ city.name }}</h4>
        <span class="status-badge">{{ city.status }}</span>
      </div>
      <span v-if="city.temp >= 25" class="temp-tag hot">더움 🔥</span>
      <span v-else class="temp-tag cool">선선함 🌿</span>
    </div>

    <div class="card-body">
      <div class="temp-display">
        <span class="temp-value">{{ city.temp }}</span>
        <span class="temp-unit">°C</span>
      </div>
      <div class="humidity-display">
        <span class="label">습도</span>
        <span class="value">{{ city.humidity }}%</span>
      </div>

      <div
        v-if="city.isHighDiscomfort"
        class="discomfort-warning"
      >
        ⚠️ 불쾌지수 높음 ({{ city.discomfIndex }})
      </div>
    </div>

    <div class="card-footer">
      <!-- 💡 수정된 부분: 라우팅 이동을 위해 city.id를 전달합니다 -->
      <button class="btn-detail" @click.stop="$emit('click-detail', city.id)">
        상세보기
      </button>
    </div>
  </article>
</template>

<style scoped>
.weather-card {
  background: var(--card-bg, #ffffff);
  border: 2px solid transparent;
  border-radius: 16px;
  padding: 16px;
  cursor: pointer;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.weather-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.weather-card.active {
  border-color: var(--primary-color, #2563eb);
  background-color: #f0f9ff;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.city-name {
  font-size: 1.15rem;
  font-weight: 700;
  margin: 0 0 2px 0;
}

.status-badge {
  font-size: 0.8rem;
  color: var(--text-muted, #64748b);
}

.temp-tag {
  font-size: 0.75rem;
  font-weight: 700;
  padding: 4px 8px;
  border-radius: 8px;
}

.temp-tag.hot {
  background: #fef2f2;
  color: #dc2626;
}

.temp-tag.cool {
  background: #f0fdf4;
  color: #16a34a;
}

.card-body {
  margin-bottom: 16px;
}

.temp-display {
  display: flex;
  align-items: baseline;
  margin-bottom: 4px;
}

.temp-value {
  font-size: 2.25rem;
  font-weight: 800;
  line-height: 1;
}

.temp-unit {
  font-size: 1rem;
  color: var(--text-muted, #64748b);
  margin-left: 2px;
}

.humidity-display {
  font-size: 0.8rem;
  color: var(--text-muted, #64748b);
}

.humidity-display .value {
  font-weight: 600;
  color: var(--text-main, #0f172a);
  margin-left: 4px;
}

.discomfort-warning {
  margin-top: 8px;
  font-size: 0.8rem;
  color: #dc2626;
  font-weight: bold;
}

.btn-detail {
  width: 100%;
  padding: 8px 0;
  background: #f1f5f9;
  border: none;
  border-radius: 8px;
  color: #475569;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-detail:hover {
  background: #e2e8f0;
  color: var(--text-main, #0f172a);
}
</style>