<!-- src/components/inventory/items/InventoryItem.vue -->
<template>
  <div 
    class="p-2 border border-gray-200 dark:border-gray-700 rounded-md"
    :class="{'bg-gray-50 dark:bg-gray-800': item.isBox}"
  >
    <div class="flex flex-wrap items-start justify-between">
      <!-- Item header component -->
      <ItemHeader
        :item="item"
        :getBoxName="getBoxName"
        :getBoxCompletionPercentage="getBoxCompletionPercentage"
        @toggle-expand="$emit('toggle-expand', item.boxId)"
        @navigate-to-parent="$emit('navigate-to-parent', item.boxId)"
        @save="$emit('save')"
    />

      <!-- Item controls component -->
      <ItemControls
        v-if="item"
        :item="item"
        :activeStatusDropdown="activeStatusDropdown"
        :getStatusClass="getStatusClass"
        :statusOptions="statusOptions"
        @mark-present="$emit('mark-present', item)"
        @open-note="$emit('open-note', item)"
        @toggle-status="$emit('toggle-status', item)"
        @update-status="(status) => $emit('update-status', [item, status])"
      />
    </div>

    <!-- Box content component -->
    <BoxContent
      v-if="item.isBox && hasBoxContents(item)"
      :box="item"
      :expanded="isBoxExpanded"
      :activeStatusDropdown="activeStatusDropdown"
      :getStatusClass="getStatusClass"
      :getStatusLabel="getStatusLabel"
      :statusOptions="statusOptions"
      :getBoxCompletedCount="getBoxCompletedCount"
      :getBoxItemCount="getBoxItemCount"
      :getBoxCompletionPercentage="getBoxCompletionPercentage"
      @mark-all-present="$emit('mark-all-present', item.boxId)"
      @mark-present="$emit('mark-present', $event)"
      @open-note="$emit('open-note', $event)"
      @toggle-status="$emit('toggle-status', $event)"
      @update-status="$emit('update-status', $event)"
      @save="$emit('save')"
      @toggle-expand="$emit('toggle-expand', item.boxId)"
    />

    <!-- Empty box message -->
    <div
      v-else-if="item.isBox && (!item.contents || !hasBoxContents(item))"
      class="mt-2 text-xs text-gray-500 dark:text-gray-400 italic"
    >
      Aucun élément associé à cette box
  </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useBoxManagement } from '../../../composables/useBoxManagement';
import { useBoxCalculations } from '../../../composables/useBoxCalculations';
import ItemHeader from './ItemHeader.vue';
import ItemControls from './ItemControls.vue';
import BoxContent from '../boxes/BoxContent.vue';

const props = defineProps({
  item: Object,
  expandedBoxes: Array,
  activeStatusDropdown: Object,
  getStatusLabel: Function,
  getStatusClass: Function,
  statusOptions: Object,
  getBoxName: Function,
});

// Get hasBoxContents from the composable
const { hasBoxContents } = useBoxManagement();
const { 
  getBoxCompletionPercentage, 
  getBoxItemCount, 
  getBoxCompletedCount 
} = useBoxCalculations();

const emit = defineEmits([
  'toggle-expand',
  'navigate-to-parent',
  'mark-present',
  'update-status',
  'toggle-status',
  'open-note',
  'save',
  'mark-all-present',
  'mark-all-in-truck'
]);

const isBoxExpanded = computed(() => 
  props.item.isBox && props.expandedBoxes.includes(props.item.boxId)
);
</script>