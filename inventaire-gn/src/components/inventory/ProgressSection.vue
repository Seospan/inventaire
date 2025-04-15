<template>
    <div class="card mb-4">
      <div class="flex justify-between items-center mb-2">
        <h2 class="text-lg font-medium">Progression de l'inventaire</h2>
        <router-link 
          to="/truck" 
          class="text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          Chargement Camion
        </router-link>
      </div>
      
      <!-- Barre de progression -->
      <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-4">
        <div
          class="bg-status-present h-4 rounded-full transition-all duration-500"
          :style="{ width: `${progress}%` }"
          :title="`${progress}% complété`"
        ></div>
      </div>
      
      <!-- Statistiques -->
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm mb-2">
        <div class="flex items-center space-x-1">
          <span class="w-3 h-3 rounded-full bg-status-present"></span>
          <span>Présent: {{ presentCount }}</span>
        </div>
        
        <div class="flex items-center space-x-1">
          <span class="w-3 h-3 rounded-full bg-status-to-find"></span>
          <span>À trouver: {{ toFindCount }}</span>
        </div>
        
        <div class="flex items-center space-x-1">
          <span class="w-3 h-3 rounded-full bg-status-to-buy"></span>
          <span>À acheter: {{ toBuyCount }}</span>
        </div>
        
        <div class="flex items-center space-x-1">
          <span class="w-3 h-3 rounded-full bg-status-to-repair"></span>
          <span>À réparer: {{ toRepairCount }}</span>
        </div>
        
        <div class="flex items-center space-x-1">
          <span class="w-3 h-3 rounded-full bg-status-not-needed"></span>
          <span>Non pertinent: {{ notNeededCount }}</span>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  defineProps({
    progress: Number,
    presentCount: Number,
    toFindCount: Number,
    toBuyCount: Number,
    toRepairCount: Number,
    notNeededCount: Number,
    boxCount: Number,
    boxContentCount: Number
  });
  </script>