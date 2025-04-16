<!-- src/components/inventory/boxes/BoxContentItem.vue -->
<template>
  <div class="p-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800">
    <div class="flex flex-wrap items-start justify-between">
      <!-- Item name and content -->
      <div class="flex-grow mr-2">
        <div class="font-medium">{{ item.name }}</div>
        
        <!-- Quantity management -->
        <ItemQuantity 
          v-if="item.targetQuantity || item.variableQuantity"
          :item="item"
          @save="$emit('save')"
        />
        
        <!-- Notes display -->
        <div v-if="item.note" class="mt-1 text-sm italic text-gray-500 dark:text-gray-400">
          {{ item.note }}
        </div>
      </div>
      
      <!-- Action buttons -->
      <ItemControls
        :item="item"
        :activeStatusDropdown="activeStatusDropdown"
        :getStatusClass="getStatusClass"
        :statusOptions="statusOptions"
        :showPresenceButton="true"
        @mark-present="$emit('mark-present', item)"
        @open-note="$emit('open-note', item)"
        @toggle-status="$emit('toggle-status', item)"
        @update-status="(status) => $emit('update-status', [item, status])"
      />
    </div>
  </div>
</template>

<script setup>
import ItemControls from '../items/ItemControls.vue';
import ItemQuantity from '../items/ItemQuantity.vue';

const props = defineProps({
  item: Object,
  activeStatusDropdown: Object,
  getStatusClass: Function,
  statusOptions: Object
});

const emit = defineEmits([
  'mark-present',
  'open-note',
  'toggle-status',
  'update-status',
  'save'
]);
</script>