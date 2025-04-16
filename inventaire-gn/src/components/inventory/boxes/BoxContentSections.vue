<!-- src/components/inventory/boxes/BoxContentSections.vue -->
<template>
    <div v-for="(contentSubsection, contentSubsectionKey) in contents" :key="contentSubsectionKey" class="mb-3">
      <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 pb-1">
        {{ contentSubsection.title }}
      </h4>
      
      <!-- Box items list -->
      <div class="space-y-2 pl-2">
        <BoxContentItem 
          v-for="(contentItem, contentIndex) in contentSubsection.items"
          :key="contentIndex"
          :item="contentItem"
          :activeStatusDropdown="activeStatusDropdown"
          :getStatusClass="getStatusClass"
          :statusOptions="statusOptions"
          @mark-present="$emit('mark-present', $event)"
          @open-note="$emit('open-note', $event)"
          @toggle-status="$emit('toggle-status', $event)"
          @update-status="$emit('update-status', $event)"
          @save="$emit('save')"
        />
      </div>
    </div>
  </template>
  
  <script setup>
  import BoxContentItem from './BoxContentItem.vue';
  
  const props = defineProps({
    contents: Object,
    activeStatusDropdown: Object,
    getStatusClass: Function,
    getStatusLabel: Function, // Add this
    statusOptions: Object
  });
  
  const emit = defineEmits([
    'mark-present',
    'open-note',
    'toggle-status',
    'update-status',
    'save',
    'toggle-expand'
  ]);
  </script>