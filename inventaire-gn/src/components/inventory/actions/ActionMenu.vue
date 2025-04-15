<!-- src/components/inventory/actions/ActionMenu.vue -->
<template>
    <div>
      <!-- Menu Button -->
      <button 
        @click="toggleMenu" 
        class="flex items-center justify-center p-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors"
        :aria-expanded="isOpen"
        aria-haspopup="true"
      >
        <span class="sr-only">Open actions menu</span>
        <!-- Menu icon - three bars when closed, X when open -->
        <svg v-if="!isOpen" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
  
      <!-- Overlay when menu is open -->
      <transition
        enter-active-class="transition-opacity ease-out duration-300"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity ease-in duration-200"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div 
          v-if="isOpen" 
          class="fixed inset-0 bg-black/50 dark:bg-black/70 z-40"
          @click="isOpen = false"
        ></div>
      </transition>
  
      <!-- Lateral Menu -->
      <transition
        enter-active-class="transition ease-out duration-300"
        enter-from-class="transform -translate-x-full"
        enter-to-class="transform translate-x-0"
        leave-active-class="transition ease-in duration-200"
        leave-from-class="transform translate-x-0"
        leave-to-class="transform -translate-x-full"
      >
        <div 
          v-if="isOpen" 
          ref="menuRef"
          class="fixed inset-y-0 left-0 w-64 max-w-xs bg-white dark:bg-gray-800 shadow-lg dark:shadow-gray-900/70 z-50 flex flex-col"
          role="menu"
          aria-orientation="vertical"
          tabindex="-1"
        >
          <div class="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 class="text-lg font-medium text-gray-900 dark:text-gray-100">Menu</h2>
            <button 
              @click="isOpen = false"
              class="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <!-- Updated version of ActionMenu.vue -->

            <!-- Add this after the header in the menu -->
            <div class="py-2 flex-1 overflow-y-auto">
            <!-- Navigation Section -->
            <div class="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Navigation
            </div>
            
            <router-link to="/" custom v-slot="{ navigate, isActive }">
                <button 
                @click="navigate(); isOpen = false;"
                class="w-full px-4 py-3 text-left flex items-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                :class="{ 'bg-blue-50 dark:bg-blue-900/20': isActive }"
                >
                <span class="mr-3 text-blue-500 dark:text-blue-400">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                </span>
                <span class="font-medium text-gray-700 dark:text-gray-200">Inventaire</span>
                </button>
            </router-link>
            
            <router-link to="/truck" custom v-slot="{ navigate, isActive }">
                <button 
                @click="navigate(); isOpen = false;"
                class="w-full px-4 py-3 text-left flex items-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                :class="{ 'bg-purple-50 dark:bg-purple-900/20': isActive }"
                >
                <span class="mr-3 text-purple-500 dark:text-purple-400">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                    </svg>
                </span>
                <span class="font-medium text-gray-700 dark:text-gray-200">Chargement Camion</span>
                </button>
            </router-link>
            
            <!-- Divider -->
            <div class="my-2 border-t border-gray-200 dark:border-gray-700"></div>
            
            <!-- Actions Section -->
            <div class="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
            </div>
            
            <!-- Menu Items (the existing slot) -->
            <slot></slot>
            </div>
        </div>
      </transition>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, onUnmounted } from 'vue';
  
  const isOpen = ref(false);
  const menuRef = ref(null);
  
  const toggleMenu = () => {
    isOpen.value = !isOpen.value;
  };
  
  // Close menu when pressing escape key
  const handleEscKey = (event) => {
    if (event.key === 'Escape' && isOpen.value) {
      isOpen.value = false;
    }
  };
  
  onMounted(() => {
    document.addEventListener('keydown', handleEscKey);
  });
  
  onUnmounted(() => {
    document.removeEventListener('keydown', handleEscKey);
  });
  </script>