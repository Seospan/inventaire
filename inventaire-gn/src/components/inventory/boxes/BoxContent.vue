<!-- src/components/inventory/boxes/BoxContent.vue -->
<template>
  <div>
    <div 
      v-if="expandedView" 
      class="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700"
    >
      <BoxExpandedView 
        :box="box"
        v-bind="$props"
        v-on="$listeners"
      />
    </div>
    <div 
      v-else
      class="mt-2 pl-2 border-t border-gray-200 dark:border-gray-700 pt-2"
    >
      <BoxCollapsedView 
        :box="box"
        @toggle="$emit('toggle-expand', box.boxId)"
        v-bind="$props"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useBoxManagement } from '../../../composables/useBoxManagement';
import BoxExpandedView from './BoxExpandedView.vue';
import BoxCollapsedView from './BoxCollapsedView.vue';

const props = defineProps({
  box: Object,
  expanded: Boolean
});

const { hasBoxContents } = useBoxManagement();

const isValidBox = computed(() => 
  props.box && props.box.isBox && props.box.contents && hasBoxContents(props.box)
);

const expandedView = computed(() => 
  isValidBox.value && props.expanded
);
</script>