<!-- src/components/exercise/UnitToggler.vue -->
<script setup>
import { useConfigStore } from '../../stores/configStore'

const configStore = useConfigStore()
</script>

<template>
  <button class="unit-toggler" @click="configStore.toggleUnit">
    단위: <strong>{{ configStore.unitSymbol }}</strong> 🔄
  </button>
</template>

<style scoped>
.unit-toggler {
  padding: 8px 16px;
  background-color: #f1f5f9;
  border: 2px solid #e2e8f0;
  border-radius: 20px;
  color: #0f172a;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 6px;
}

.unit-toggler:hover {
  background-color: #e2e8f0;
  border-color: #cbd5e1;
}
</style>