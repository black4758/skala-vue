<!-- src/components/exercise/UnitToggler.vue -->
<script setup>
import { useConfigStore } from '../../stores/configStore'
import Button from 'primevue/button'

const configStore = useConfigStore()

const handleToggle = (event) => {
  configStore.toggleUnit()
  // 버튼 클릭 후 포커스(눌림 상태)를 강제로 해제합니다.
  if (event.currentTarget) {
    event.currentTarget.blur()
  }
}
</script>

<template>
  <Button 
    @click="handleToggle"
    :label="`단위: ${configStore.unitSymbol}`"
    icon="pi pi-sync"
    severity="secondary"
    rounded
    outlined
  />
</template>

<style scoped>
</style>