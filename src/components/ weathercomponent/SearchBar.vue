<!-- SearchBar.vue -->
<script setup>
defineProps({
  searchQuery: String
})

defineEmits(['update-query'])
</script>

<template>
  <div class="search-box">
    <label for="city-search" class="search-label">도시 검색</label>
    <div class="input-wrapper">
      <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      </svg>
      <input
        id="city-search"
        type="text"
        :value="searchQuery"
        @input="$emit('update-query', $event.target.value)"
        placeholder="검색할 도시 이름을 입력하세요..."
      />
    </div>
    <p class="search-result">
      입력한 도시 이름: <strong>{{ searchQuery || '없음' }}</strong>
    </p>
  </div>
</template>

<style scoped>
.search-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 8px;
  color: var(--text-main, #0f172a);
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 14px;
  width: 18px;
  height: 18px;
  color: var(--text-muted, #64748b);
}

.input-wrapper input {
  width: 100%;
  padding: 12px 16px 12px 42px;
  font-size: 0.95rem;
  border: 1.5px solid var(--border-color, #e2e8f0);
  border-radius: 10px;
  outline: none;
  transition: all 0.2s ease;
}

.input-wrapper input:focus {
  border-color: var(--primary-color, #2563eb);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
}

.search-result {
  margin: 10px 0 0 0;
  font-size: 0.85rem;
  color: var(--text-muted, #64748b);
}

.search-result strong {
  color: var(--primary-color, #2563eb);
}
</style>