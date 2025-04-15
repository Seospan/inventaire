<!-- src/views/InventoryView.vue -->
<template>
    <div>
      <div class="mb-4 flex justify-between items-center">
        <h2 class="text-2xl font-bold">Inventaire</h2>
        
        <!-- Navigation button to truck loading page -->
        <router-link 
          to="/truck" 
          class="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md shadow-sm transition-colors"
        >
          Chargement Camion
        </router-link>
      </div>
      
      <!-- Pass hideInTruck prop to hide truck-related functionality -->
      <InventoryManager :hideInTruck="true" />
    </div>
  </template>
  
  <script setup>
  import InventoryManager from '../components/inventory/InventoryManager.vue';
  </script>