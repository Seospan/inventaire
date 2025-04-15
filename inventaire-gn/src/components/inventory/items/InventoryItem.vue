<!-- src/components/inventory/items/InventoryItem.vue -->
<template>
  <div 
    class="p-2 border border-gray-200 dark:border-gray-700 rounded-md"
    :class="{'bg-gray-50 dark:bg-gray-800': item.isBox}"
  >
    <div class="flex flex-wrap items-start justify-between">
      <!-- Item name and content -->
      <div class="flex-grow mr-2 flex items-center">
        <!-- Expansion icon for boxes -->
        <button 
          v-if="item.isBox && hasBoxContents(item)"
          @click.stop="$emit('toggle-expand', item.boxId)"
          class="mr-2 text-blue-500 dark:text-blue-400 focus:outline-none"
        >
          <svg 
            :class="[isBoxExpanded ? 'transform rotate-90' : '', 'w-4 h-4 transition-transform']"
            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
          >
            <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
          </svg>
        </button>
        
        <!-- Box icon for boxes -->
        <div v-if="item.isBox" class="mr-2 text-blue-500 dark:text-blue-400">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8M10 14h4" />
          </svg>
        </div>
        
        <div>
          <div class="font-medium">
            {{ item.name }}
            <span v-if="item.isBox" class="ml-1 text-xs px-1 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-sm">
              Box
            </span>
            <span v-if="item.boxId && !item.isBox" class="ml-1 text-xs px-1 py-0.5 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-sm cursor-pointer" @click.stop="$emit('navigate-to-parent', item.boxId)">
              Dans: {{ getBoxName(item.boxId) }}
            </span>
          </div>
          
          <!-- Progress bar for boxes -->
          <div v-if="item.isBox && hasBoxContents(item)" class="w-full bg-gray-200 rounded-full h-1.5 mt-2">
            <div 
              class="bg-status-present h-1.5 rounded-full" 
              :style="{ width: getBoxCompletionPercentage(item) + '%' }"
            >mmm</div>
          </div>
          
          <!-- Quantity management -->
          <div v-if="item.targetQuantity || item.variableQuantity" class="mt-1 flex items-center">
            <label class="text-sm mr-2">Quantité:</label>
            <input 
              v-model="item.currentQuantity" 
              type="number" 
              min="0"
              class="w-16 p-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
              @change="$emit('save')"
            />
            
            <span v-if="item.targetQuantity" class="ml-1 text-sm">
              / {{ item.targetQuantity }}
              <span v-if="item.isMinimumQuantity" class="text-xs">(min)</span>
            </span>
          </div>
          
          <!-- Notes display -->
          <div v-if="item.note" class="mt-1 text-sm italic text-gray-500 dark:text-gray-400">
            {{ item.note }}
          </div>
        </div>
      </div>
      
      <!-- Action buttons -->
      <div class="flex items-center space-x-2">
        <!-- Present button -->
        <button 
          v-if="!item.isBox || (item.isBox && !hasBoxContents(item))"
          @click.stop="$emit('mark-present', item)"
          class="p-1 bg-status-present text-white rounded-md text-sm"
          :disabled="item.status === 'present'"
          :class="{'opacity-50': item.status === 'present'}"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </button>
        
        <!-- Note button -->
        <button 
          @click.stop="$emit('open-note', item)"
          class="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          title="Ajouter une note"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        
        <!-- Status menu -->
        <div class="relative">
          <button 
            @click.stop="$emit('toggle-status', item)"
            class="p-1 rounded-md"
            :class="item.status ? getStatusClass(item.status) : 'bg-gray-200 dark:bg-gray-700'"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
          
          <!-- Status dropdown menu -->
          <div 
            v-if="activeStatusDropdown === item"
            class="absolute right-0 mt-1 w-40 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10"
          >
            <div class="py-1">
              <button 
                v-for="(label, status) in statusOptions" 
                :key="status" 
                @click.stop="$emit('update-status', [item, status === 'null' ? null : status])"
                class="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                :class="{'font-medium': item.status === (status === 'null' ? null : status)}"
              >
                <span 
                  class="w-3 h-3 rounded-full mr-2" 
                  :class="getStatusClass(status === 'null' ? null : status)"
                ></span>
                {{ label }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Box content (expanded view) -->
    <div 
      v-if="item.isBox && isBoxExpanded && hasBoxContents(item)" 
      class="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700"
    >
      <!-- Status summary and progress -->
      <div class="mb-3 p-2 bg-gray-100 dark:bg-gray-700 rounded-md text-sm">
        <div class="flex justify-between items-center mb-2">
          <div class="font-medium">
            {{ getBoxCompletedCount(item) }}/{{ getBoxItemCount(item) }} éléments vérifiés
          </div>
          <div>
            {{ getBoxCompletionPercentage(item) }}%
          </div>
        </div>
        
        <!-- Box group actions -->
        <div class="flex flex-wrap gap-2">
          <button 
            @click.stop="$emit('mark-all-present', item.boxId)" 
            class="px-2 py-1 bg-status-present text-white rounded-md text-xs"
          >
            Tout marquer présent
          </button>
        </div>
      </div>
      
      <!-- Box content sections -->
      <div v-for="(contentSubsection, contentSubsectionKey) in item.contents" :key="contentSubsectionKey" class="mb-3">
        <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 pb-1">
          {{ contentSubsection.title }}
        </h4>
        
        <!-- Box items list -->
        <div class="space-y-2 pl-2">
          <div 
            v-for="(contentItem, contentIndex) in contentSubsection.items" 
            :key="contentIndex" 
            class="p-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800"
          >
            <div class="flex flex-wrap items-start justify-between">
              <!-- Item name and content -->
              <div class="flex-grow mr-2">
                <div class="font-medium">{{ contentItem.name }}</div>
                
                <!-- Quantity management -->
                <div v-if="contentItem.targetQuantity || contentItem.variableQuantity" class="mt-1 flex items-center">
                  <label class="text-sm mr-2">Quantité:</label>
                  <input 
                    v-model="contentItem.currentQuantity" 
                    type="number" 
                    min="0"
                    class="w-16 p-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                    @change="$emit('save')"
                  />
                  
                  <span v-if="contentItem.targetQuantity" class="ml-1 text-sm">
                    / {{ contentItem.targetQuantity }}
                    <span v-if="contentItem.isMinimumQuantity" class="text-xs">(min)</span>
                  </span>
                </div>
                
                <!-- Notes display -->
                <div v-if="contentItem.note" class="mt-1 text-sm italic text-gray-500 dark:text-gray-400">
                  {{ contentItem.note }}
                </div>
              </div>
              
              <!-- Action buttons -->
              <div class="flex items-center space-x-2">
                <!-- Present button -->
                <button 
                  @click.stop="$emit('mark-present', contentItem)"
                  class="p-1 bg-status-present text-white rounded-md text-sm"
                  :disabled="contentItem.status === 'present'"
                  :class="{'opacity-50': contentItem.status === 'present'}"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </button>
                
                <!-- Note button -->
                <button 
                  @click.stop="$emit('open-note', contentItem)"
                  class="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  title="Ajouter une note"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                
                <!-- Status menu -->
                <div class="relative">
                  <button 
                    @click.stop="$emit('toggle-status', contentItem)"
                    class="p-1 rounded-md"
                    :class="contentItem.status ? getStatusClass(contentItem.status) : 'bg-gray-200 dark:bg-gray-700'"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                  </button>
                  
                  <!-- Status dropdown menu -->
                  <div 
                    v-if="activeStatusDropdown === contentItem"
                    class="absolute right-0 mt-1 w-40 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10"
                  >
                    <div class="py-1">
                      <button 
                        v-for="(label, status) in statusOptions" 
                        :key="status" 
                        @click.stop="$emit('update-status', [contentItem, status === 'null' ? null : status])"
                        class="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                        :class="{'font-medium': contentItem.status === (status === 'null' ? null : status)}"
                      >
                        <span 
                          class="w-3 h-3 rounded-full mr-2" 
                          :class="getStatusClass(status === 'null' ? null : status)"
                        ></span>
                        {{ label }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Box content summary (collapsed view) -->
    <div 
      v-else-if="item.isBox && !isBoxExpanded && hasBoxContents(item)" 
      class="mt-2 pl-2 border-t border-gray-200 dark:border-gray-700 pt-2"
    >
      <div class="flex flex-wrap gap-1 mt-1">
        <span class="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs bg-status-present text-white">
          {{ getBoxCompletedCount(item) }}/{{ getBoxItemCount(item) }} vérifiés
        </span>
      </div>
    </div>
    
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

const props = defineProps({
  item: Object,
  expandedBoxes: Array,
  activeStatusDropdown: Object,
  getStatusLabel: Function,
  getStatusClass: Function,
  statusOptions: Object,
  getBoxName: Function,
  hasBoxContents: Function,
  getBoxCompletionPercentage: Function,
  getBoxItemCount: Function,
  getBoxCompletedCount: Function
});

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