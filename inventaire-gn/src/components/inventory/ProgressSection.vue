<template>
    <div class="card mb-4">
      <h2 class="text-lg font-medium mb-2">Progression</h2>
      
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
          <span class="w-3 h-3 rounded-full bg-status-in-truck"></span>
          <span>Dans le camion: {{ inTruckCount }}</span>
        </div>
        
        <div class="flex items-center space-x-1">
          <span class="w-3 h-3 rounded-full bg-status-not-needed"></span>
          <span>Non pertinent: {{ notNeededCount }}</span>
        </div>
      </div>
      
      <!-- Statistiques des boîtes -->
      <div v-if="boxCount > 0" class="border-t border-gray-200 dark:border-gray-700 mt-2 pt-2">
        <div class="text-sm font-medium mb-1">Boîtes et leur contenu</div>
        <div class="grid grid-cols-2 gap-2 text-sm">
          <div class="flex items-center space-x-1">
            <span class="w-2 h-2 rounded-full bg-blue-500"></span>
            <span>Boîtes: {{ boxCount }}</span>
          </div>
          <div class="flex items-center space-x-1">
            <span class="w-2 h-2 rounded-full bg-purple-500"></span>
            <span>Éléments dans des boîtes: {{ boxContentCount }}</span>
          </div>
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
    inTruckCount: Number,
    notNeededCount: Number,
    boxCount: Number,
    boxContentCount: Number
  });
  </script>