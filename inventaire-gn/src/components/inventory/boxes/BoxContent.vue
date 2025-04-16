<!-- src/components/inventory/boxes/BoxContent.vue -->
<template>
  <div>
    <div 
      v-if="expandedView" 
      class="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700"
    >
      <BoxExpandedView 
        :box="box"
        :activeStatusDropdown="activeStatusDropdown"
        :getStatusClass="getStatusClass"
        :getStatusLabel="getStatusLabel"
        :statusOptions="statusOptions"
        @mark-all-present="$emit('mark-all-present', $event)"
        @mark-present="$emit('mark-present', $event)"
        @open-note="$emit('open-note', $event)"
        @toggle-status="$emit('toggle-status', $event)"
        @update-status="$emit('update-status', $event)"
        @save="$emit('save')"
        @toggle-expand="$emit('toggle-expand', $event)"
      />
    </div>
    <div 
      v-else
      class="mt-2 pl-2 border-t border-gray-200 dark:border-gray-700 pt-2"
    >
      <BoxCollapsedView 
        :box="box"
        @toggle="$emit('toggle-expand', box.boxId)"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useBoxManagement } from '../../../composables/useBoxManagement';
import { useBoxCalculations } from '../../../composables/useBoxCalculations';
import BoxExpandedView from './BoxExpandedView.vue';
import BoxCollapsedView from './BoxCollapsedView.vue';

const props = defineProps({
  box: Object,
  expanded: Boolean,
  activeStatusDropdown: Object,
  getStatusClass: Function,
  getStatusLabel: Function,
  statusOptions: Object,
  getBoxCompletedCount: Function,
  getBoxItemCount: Function,
  getBoxCompletionPercentage: Function
});

defineEmits([
  'mark-all-present',
  'mark-present',
  'open-note',
  'toggle-status',
  'update-status',
  'save',
  'toggle-expand'
]);

const { hasBoxContents } = useBoxManagement();

const { getBoxCompletedCount, getBoxItemCount, getBoxCompletionPercentage } = useBoxCalculations();

const isValidBox = computed(() => 
  props.box && props.box.isBox && props.box.contents && hasBoxContents(props.box)
);

const expandedView = computed(() => 
  isValidBox.value && props.expanded
);
</script>