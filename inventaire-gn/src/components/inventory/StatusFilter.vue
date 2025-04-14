<template>
    <div class="card mb-4">
      <div class="flex overflow-x-auto pb-2 -mx-2 px-2">
        <button
          v-for="filter in filters"
          :key="filter.value"
          @click="changeFilter(filter.value)"
          class="px-3 py-1 rounded-full text-sm whitespace-nowrap mr-2 flex items-center transition-colors"
          :class="currentFilter === filter.value ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'"
        >
          <span class="w-2 h-2 rounded-full mr-1" :class="filter.class"></span>
          {{ filter.label }}
          <span v-if="filter.count" class="ml-1 px-1.5 py-0.5 text-xs bg-white bg-opacity-20 rounded-full">
            {{ filter.count }}
          </span>
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue';
  
  const props = defineProps({
    currentFilter: String,
    toFindCount: Number,
    toBuyCount: Number,
    toRepairCount: Number,
    notNeededCount: Number,
    inTruckCount: Number,
    presentCount: Number,
    nullCount: Number
  });
  
  const emit = defineEmits(['change-filter']);
  
  const filters = computed(() => [
    { 
      label: 'Tous', 
      value: 'all', 
      class: 'bg-gray-400'
    },
    { 
      label: 'À vérifier', 
      value: 'null', 
      class: 'bg-gray-400',
      count: props.nullCount
    },
    { 
      label: 'Présent', 
      value: 'present', 
      class: 'bg-status-present',
      count: props.presentCount
    },
    { 
      label: 'À trouver', 
      value: 'to-find', 
      class: 'bg-status-to-find',
      count: props.toFindCount
    },
    { 
      label: 'À acheter', 
      value: 'to-buy', 
      class: 'bg-status-to-buy',
      count: props.toBuyCount
    },
    { 
      label: 'À réparer', 
      value: 'to-repair', 
      class: 'bg-status-to-repair',
      count: props.toRepairCount
    },
    { 
      label: 'Dans le camion', 
      value: 'in-truck', 
      class: 'bg-status-in-truck',
      count: props.inTruckCount
    },
    { 
      label: 'Non pertinent', 
      value: 'not-needed', 
      class: 'bg-status-not-needed',
      count: props.notNeededCount
    }
  ]);
  
  const changeFilter = (filter) => {
    emit('change-filter', filter);
  };
  </script>