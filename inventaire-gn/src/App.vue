<template>
  <div class="app-container">
    <header>
      <h1>Inventaire GN</h1>
    </header>
    
    <main class="container">
      <InventoryManager />
    </main>
  </div>
</template>

<script>
import InventoryManager from './components/inventory/InventoryManager.vue'

export default {
  name: 'App',
  components: {
    InventoryManager
  }
}
</script>