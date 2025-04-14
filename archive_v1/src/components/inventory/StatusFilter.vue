<template>
    <div class="filter-tabs">
      <button 
        class="filter-tab" 
        :class="{ active: currentFilter === 'all' }" 
        @click="$emit('change-filter', 'all')"
      >
        Tous
      </button>
      <button 
        class="filter-tab" 
        :class="{ active: currentFilter === 'to-buy' }" 
        @click="$emit('change-filter', 'to-buy')"
      >
        À acheter <span class="tab-count">{{ toBuyCount }}</span>
      </button>
      <button 
        class="filter-tab" 
        :class="{ active: currentFilter === 'to-find' }" 
        @click="$emit('change-filter', 'to-find')"
      >
        À trouver <span class="tab-count">{{ toFindCount }}</span>
      </button>
      <button 
        class="filter-tab" 
        :class="{ active: currentFilter === 'to-repair' }" 
        @click="$emit('change-filter', 'to-repair')"
      >
        À réparer <span class="tab-count">{{ toRepairCount }}</span>
      </button>
      <button 
        class="filter-tab" 
        :class="{ active: currentFilter === 'present' }" 
        @click="$emit('change-filter', 'present')"
      >
        Présent
      </button>
    </div>
  </template>
  
  <script>
  export default {
    name: 'StatusFilter',
    props: {
      currentFilter: {
        type: String,
        required: true
      },
      toFindCount: {
        type: Number,
        required: true
      },
      toBuyCount: {
        type: Number,
        required: true
      },
      toRepairCount: {
        type: Number,
        required: true
      }
    }
  }
  </script>