<!-- src/components/exercise/UnitToggler.vue -->
<script setup>
import { useConfigStore } from '../../stores/configStore'
import Button from 'primevue/button'

const configStore = useConfigStore()
</script>

<template>
  <Button 
    @click="configStore.toggleUnit"
    :label="`단위: ${configStore.unitSymbol}`"
    icon="pi pi-sync"
    severity="secondary"
    rounded
    outlined
  />
</template>

<style scoped>
</style>