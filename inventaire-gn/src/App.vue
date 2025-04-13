<template>
  <div class="app-container">
    <header>
      <h1>Inventaire GN</h1>
    </header>
    
    <main class="container">
      <InventoryManager />
    </main>

    <ThemeToggle />
  </div>
</template>

<script>
import InventoryManager from './components/inventory/InventoryManager.vue'
import ThemeToggle from './components/ui/ThemeToggle.vue'

export default {
  name: 'App',
  components: {
    InventoryManager,
    ThemeToggle
  }
}
</script>