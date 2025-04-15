<!-- src/components/inventory/actions/ActionButtons.vue -->
<template>
  <div class="flex justify-end mb-4">
    <!-- Action Menu -->
    <ActionMenu>
      <!-- Import Button -->
      <ActionMenuItem @click="$emit('import')">
        <template #icon>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
        </template>
        Import Inventory
      </ActionMenuItem>
      
      <!-- Export Button -->
      <ActionMenuItem @click="$emit('export')">
        <template #icon>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-500 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
        </template>
        Export Inventory
      </ActionMenuItem>
      
      <!-- Reset Button -->
      <ActionMenuItem @click="confirmReset" :disabled="resetDisabled">
        <template #icon>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-500 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </template>
        Reset Inventory
      </ActionMenuItem>
    </ActionMenu>
  </div>
  
  <!-- Reset Confirmation Modal -->
  <ConfirmModal
    :active="showResetConfirm"
    title="Confirm Reset"
    message="Are you sure you want to reset the inventory? This action cannot be undone."
    confirm-text="Reset"
    cancel-text="Cancel"
    type="danger"
    @confirm="executeReset"
    @cancel="showResetConfirm = false"
  />
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import ConfirmModal from '../../ui/ConfirmModal.vue';
import ActionMenu from './ActionMenu.vue';
import ActionMenuItem from './ActionMenuItem.vue';

// Props
const props = defineProps({
  resetDisabled: {
    type: Boolean,
    default: false
  }
});

// Emits
const emit = defineEmits(['import', 'export', 'reset']);

// State
const showResetConfirm = ref(false);

// Methods
const confirmReset = () => {
  console.log('Confirm reset called, disabled:', props.resetDisabled);
  console.log('Current showResetConfirm value:', showResetConfirm.value);
  if (!props.resetDisabled) {
    showResetConfirm.value = true;
    console.log('Set showResetConfirm to:', showResetConfirm.value);
  }
};

const executeReset = () => {
  console.log('Executing reset in ActionButtons');
  showResetConfirm.value = false;
  emit('reset');
};
</script>