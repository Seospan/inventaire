<template>
    <div>
      <div v-for="(section, sectionKey) in inventory" :key="sectionKey" class="card mb-4">
        <!-- En-tête de section -->
        <div 
          @click="toggleSection(sectionKey)"
          class="flex justify-between items-center cursor-pointer p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
        >
          <h2 class="text-lg font-medium">{{ section.title }}</h2>
          <div class="flex items-center space-x-2">
            <!-- Indicateur de complétion -->
            <div v-if="getSectionProgress(sectionKey) === 100" class="text-status-present">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
            </div>
            
            <!-- Pourcentage de progression -->
            <div class="text-sm">
              {{ getSectionProgress(sectionKey) }}%
            </div>
            
            <!-- Flèche d'expansion -->
            <svg 
              class="h-5 w-5 transform transition-transform" 
              :class="isOpen(sectionKey) ? 'rotate-180' : ''" 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </div>
        </div>
        
        <!-- Contenu de la section -->
        <div v-if="isOpen(sectionKey)" class="mt-2 pl-2">
          <div v-for="(subsection, subsectionKey) in section.subsections" :key="subsectionKey" class="mb-4">
            <h3 class="font-medium text-gray-700 dark:text-gray-300 mb-2 border-b border-gray-200 dark:border-gray-700 pb-1">
              {{ subsection.title }}
            </h3>
            
            <div class="space-y-2">
              <div 
                v-for="(item, itemIndex) in subsection.items" 
                :key="itemIndex" 
                class="p-2 border border-gray-200 dark:border-gray-700 rounded-md"
                :class="{'bg-gray-50 dark:bg-gray-800': item.isBox}"
              >
                <div class="flex flex-wrap items-start justify-between">
                  <!-- Nom de l'élément et icône d'expansion pour les box -->
                  <div class="flex-grow mr-2 flex items-center">
                    <!-- Icône d'expansion pour les box -->
                    <button 
                      v-if="item.isBox && item.contents && hasBoxContents(item)"
                      @click.stop="toggleBoxExpand(item.boxId)"
                      class="mr-2 text-blue-500 dark:text-blue-400 focus:outline-none"
                    >
                      <svg 
                        :class="[expandedBoxes.includes(item.boxId) ? 'transform rotate-90' : '', 'w-4 h-4 transition-transform']"
                        xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                      >
                        <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                      </svg>
                    </button>
                    
                    <!-- Icône de box pour les box -->
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
                        <span v-if="item.boxId && !item.isBox" class="ml-1 text-xs px-1 py-0.5 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-sm cursor-pointer" @click.stop="navigateToParentBox(item.boxId)">
                          Dans: {{ getBoxName(item.boxId) }}
                        </span>
                      </div>
                      
                      <!-- Barre de progression pour les box -->
                      <div v-if="item.isBox && hasBoxContents(item)" class="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                        <div 
                          class="bg-status-present h-1.5 rounded-full" 
                          :style="{ width: getBoxCompletionPercentage(item) + '%' }"
                        ></div>
                      </div>
                      
                      <!-- Gestion des quantités -->
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
                      
                      <!-- Affichage des notes -->
                      <div v-if="item.note" class="mt-1 text-sm italic text-gray-500 dark:text-gray-400">
                        {{ item.note }}
                      </div>
                    </div>
                  </div>
                  
                  <!-- Actions -->
                  <div class="flex items-center space-x-2">
                    <!-- Bouton pour marquer comme présent (standard pour tous les éléments) -->
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
                    
                    <!-- Bouton pour marquer comme dans le camion -->
                    <button 
                      @click.stop="$emit('update-status', item, 'in-truck')" 
                      class="p-1 bg-status-in-truck text-white rounded-md text-sm"
                      :disabled="item.status === 'in-truck'"
                      :class="{'opacity-50': item.status === 'in-truck'}"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                      </svg>
                    </button>
                    
                    <!-- Bouton pour ouvrir la modale de note -->
                    <button 
                      @click.stop="$emit('open-note', item)"
                      class="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                      title="Ajouter une note"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    
                    <!-- Menu de statut -->
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
                      
                      <!-- Dropdown du menu de statut -->
                      <div 
                        v-if="activeStatusDropdown === item"
                        class="absolute right-0 mt-1 w-40 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10"
                      >
                        <div class="py-1">
                          <button 
                            v-for="(label, status) in statusOptions" 
                            :key="status" 
                            @click.stop="$emit('update-status', item, status === 'null' ? null : status)"
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
                
                <!-- Contenu de la box (affiché directement) -->
                <div 
                  v-if="item.isBox && item.contents && expandedBoxes.includes(item.boxId) && hasBoxContents(item)" 
                  class="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700"
                >
                  <!-- Résumé des statuts et barre de progression -->
                  <div class="mb-3 p-2 bg-gray-100 dark:bg-gray-700 rounded-md text-sm">
                    <div class="flex justify-between items-center mb-2">
                      <div class="font-medium">
                        {{ getBoxCompletedCount(item) }}/{{ getBoxItemCount(item) }} éléments vérifiés
                      </div>
                      <div>
                        {{ getBoxCompletionPercentage(item) }}%
                      </div>
                    </div>
                    
                    <!-- Actions de groupe pour la box -->
                    <div class="flex flex-wrap gap-2">
                      <button 
                        @click.stop="$emit('mark-all-present', item.boxId)" 
                        class="px-2 py-1 bg-status-present text-white rounded-md text-xs"
                      >
                        Tout marquer présent
                      </button>
                      
                      <button 
                        @click.stop="$emit('mark-all-in-truck', item.boxId)" 
                        class="px-2 py-1 bg-status-in-truck text-white rounded-md text-xs"
                      >
                        Tout marquer dans camion
                      </button>
                    </div>
                  </div>
                  
                  <!-- Sous-sections de la box -->
                  <div v-for="(contentSubsection, contentSubsectionKey) in item.contents" :key="contentSubsectionKey" class="mb-3">
                    <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 pb-1">
                      {{ contentSubsection.title }}
                    </h4>
                    
                    <!-- Liste des éléments dans la sous-section -->
                    <div class="space-y-2 pl-2">
                      <div 
                        v-for="(contentItem, contentIndex) in contentSubsection.items" 
                        :key="contentIndex" 
                        class="p-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800"
                      >
                        <div class="flex flex-wrap items-start justify-between">
                          <!-- Nom de l'élément -->
                          <div class="flex-grow mr-2">
                            <div class="font-medium">{{ contentItem.name }}</div>
                            
                            <!-- Gestion des quantités -->
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
                            
                            <!-- Affichage des notes -->
                            <div v-if="contentItem.note" class="mt-1 text-sm italic text-gray-500 dark:text-gray-400">
                              {{ contentItem.note }}
                            </div>
                          </div>
                          
                          <!-- Actions -->
                          <div class="flex items-center space-x-2">
                            <!-- Action buttons with consistent styling -->
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
                            
                            <button 
                              @click.stop="$emit('update-status', contentItem, 'in-truck')" 
                              class="p-1 bg-status-in-truck text-white rounded-md text-sm"
                              :disabled="contentItem.status === 'in-truck'"
                              :class="{'opacity-50': contentItem.status === 'in-truck'}"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                              </svg>
                            </button>
                            
                            <!-- Bouton pour ouvrir la modale de note -->
                            <button 
                              @click.stop="$emit('open-note', contentItem)"
                              class="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                              title="Ajouter une note"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            
                            <!-- Menu de statut -->
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
                              
                              <!-- Dropdown du menu de statut -->
                              <div 
                                v-if="activeStatusDropdown === contentItem"
                                class="absolute right-0 mt-1 w-40 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10"
                              >
                                <div class="py-1">
                                  <button 
                                    v-for="(label, status) in statusOptions" 
                                    :key="status" 
                                    @click.stop="$emit('update-status', contentItem, status === 'null' ? null : status)"
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
                
                <!-- Aperçu du contenu de la box (lorsque non développé) -->
                <div 
                  v-if="item.isBox && item.contents && !expandedBoxes.includes(item.boxId) && hasBoxContents(item)" 
                  class="mt-2 pl-2 border-t border-gray-200 dark:border-gray-700 pt-2"
                >
                  <div class="text-xs text-gray-500 dark:text-gray-400 flex justify-between items-center">
                    <span>{{ getBoxItemCount(item) }} élément(s) dans cette box</span>
                    <button 
                      @click.stop="toggleBoxExpand(item.boxId)"
                      class="text-blue-500 hover:text-blue-700 dark:hover:text-blue-300 underline"
                    >
                      Voir le détail
                    </button>
                  </div>
                  <div class="flex flex-wrap gap-1 mt-1">
                    <span class="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs bg-status-present text-white">
                      {{ getBoxCompletedCount(item) }}/{{ getBoxItemCount(item) }} vérifiés
                    </span>
                  </div>
                </div>
                
                <!-- Message lorsque la box est vide -->
                <div 
                  v-if="item.isBox && (!item.contents || !hasBoxContents(item))" 
                  class="mt-2 text-xs text-gray-500 dark:text-gray-400 italic"
                >
                  Aucun élément associé à cette box
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue';
  
  const props = defineProps({
    inventory: Object,
    openSections: Array,
    activeStatusDropdown: Object,
    getStatusLabel: Function,
    getStatusClass: Function
  });
  
  const emit = defineEmits([
    'toggle-section', 
    'toggle-status', 
    'update-status', 
    'mark-present', 
    'open-note',
    'save',
    'mark-all-present',
    'mark-all-in-truck',
    'navigate-to-box'
  ]);
  
  // État pour les box développées
  const expandedBoxes = ref([]);
  
  // Vérifier si une section est ouverte
  const isOpen = (sectionKey) => {
    return props.openSections.includes(sectionKey);
  };
  
  // Ouvrir/fermer une section
  const toggleSection = (sectionKey) => {
    emit('toggle-section', sectionKey);
  };
  
  // Développer/réduire une box
  const toggleBoxExpand = (boxId) => {
    const index = expandedBoxes.value.indexOf(boxId);
    if (index === -1) {
      expandedBoxes.value.push(boxId);
    } else {
      expandedBoxes.value.splice(index, 1);
    }
  };
  
  // Naviguer vers la box parente
  const navigateToParentBox = (boxId) => {
    emit('navigate-to-box', boxId);
  };
  
  // Calcul du pourcentage de complétion d'une section
  const getSectionProgress = (sectionKey) => {
    const section = props.inventory[sectionKey];
    if (!section) return 0;
    
    let total = 0;
    let completed = 0;
    
    Object.keys(section.subsections || {}).forEach(subsectionKey => {
      const subsection = section.subsections[subsectionKey];
      
      (subsection.items || []).forEach(item => {
        if (item.status !== 'not-needed') {
          total++;
          if (item.status === 'present' || item.status === 'in-truck') {
            completed++;
          }
          
          // Count box contents too
          if (item.isBox && item.contents) {
            Object.keys(item.contents).forEach(contentSubsectionKey => {
              const contentSubsection = item.contents[contentSubsectionKey];
              (contentSubsection.items || []).forEach(contentItem => {
                if (contentItem.status !== 'not-needed') {
                  total++;
                  if (contentItem.status === 'present' || contentItem.status === 'in-truck') {
                    completed++;
                  }
                }
              });
            });
          }
        }
      });
    });
    
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };
  
  // Options de statut pour le menu déroulant
  const statusOptions = computed(() => {
    return {
      'null': props.getStatusLabel(null),
      'present': props.getStatusLabel('present'),
      'to-find': props.getStatusLabel('to-find'),
      'to-buy': props.getStatusLabel('to-buy'),
      'to-repair': props.getStatusLabel('to-repair'),
      'not-needed': props.getStatusLabel('not-needed'),
      'in-truck': props.getStatusLabel('in-truck')
    };
  });
  
  // Récupérer le nom d'une box à partir de son ID
  const getBoxName = (boxId) => {
    let foundName = '';
    let boxFound = false;
    
    // Parcourir toutes les sections et sous-sections pour trouver la box
    Object.keys(props.inventory).forEach(sectionKey => {
      const section = props.inventory[sectionKey];
      
      Object.keys(section.subsections || {}).forEach(subsectionKey => {
        const subsection = section.subsections[subsectionKey];
        
        (subsection.items || []).forEach(item => {
          if (item.isBox && item.boxId === boxId) {
            foundName = item.name;
            boxFound = true;
          }
        });
      });
    });
    
    return boxFound ? foundName : boxId;
  };
  
  // Vérifier si une box a des éléments
const hasBoxContents = (box) => {
  if (!box || !box.contents) return false;
  
  let hasItems = false;
  
  Object.keys(box.contents).forEach(subsectionKey => {
    const subsection = box.contents[subsectionKey];
    if (subsection.items && subsection.items.length > 0) {
      hasItems = true;
    }
  });

  return hasItems;
};

// Obtenir tous les éléments contenus dans une box
const getAllBoxItems = (box) => {
  if (!box || !box.contents) return [];
  
  const allItems = [];
  
  Object.keys(box.contents).forEach(subsectionKey => {
    const subsection = box.contents[subsectionKey];
    (subsection.items || []).forEach(item => {
      allItems.push(item);
    });
  });
  
  return allItems;
};

// Compter le nombre d'éléments dans une box
const getBoxItemCount = (box) => {
  return getAllBoxItems(box).length;
};

// Compter le nombre d'éléments vérifiés dans une box (présent ou dans le camion)
const getBoxCompletedCount = (box) => {
  const items = getAllBoxItems(box);
  if (!items || items.length === 0) return 0;
  
  return items.filter(item => 
    item.status === 'present' || 
    item.status === 'in-truck' || 
    item.status === 'not-needed'
  ).length;
};

// Calculer le pourcentage de complétion d'une box
const getBoxCompletionPercentage = (box) => {
  const items = getAllBoxItems(box);
  if (!items || items.length === 0) return 0;
  
  const completed = getBoxCompletedCount(box);
  return Math.round((completed / items.length) * 100);
};

// Obtenir la liste des statuts présents dans une box
const getBoxContentStatuses = (box) => {
  const items = getAllBoxItems(box);
  if (!items || items.length === 0) return [];
  
  const statuses = new Set();
  
  items.forEach(item => {
    statuses.add(item.status);
  });
  
  return Array.from(statuses);
};

// Compter le nombre d'éléments avec un statut spécifique dans une box
const getBoxContentStatusCount = (box, status) => {
  const items = getAllBoxItems(box);
  if (!items || items.length === 0) return 0;
  
  return items.filter(item => item.status === status).length;
};

// Calculer le nombre d'éléments par statut dans une box
const getBoxContentStatusCounts = (box) => {
  const counts = {
    'null': 0,
    'present': 0,
    'to-find': 0,
    'to-buy': 0,
    'to-repair': 0,
    'not-needed': 0,
    'in-truck': 0
  };
  
  const items = getAllBoxItems(box);
  if (!items || items.length === 0) return counts;
  
  items.forEach(item => {
    const status = item.status === null ? 'null' : item.status;
    counts[status] = (counts[status] || 0) + 1;
  });
  
  return counts;
};
</script>