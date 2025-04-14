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
                  <!-- Nom de l'élément -->
                  <div class="flex-grow mr-2">
                    <div class="font-medium">
                      {{ item.name }}
                      <span v-if="item.isBox" class="ml-1 text-xs px-1 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-sm">
                        Box
                      </span>
                      <span v-if="item.boxId" class="ml-1 text-xs px-1 py-0.5 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-sm cursor-pointer" @click.stop="showBoxContents(item.boxId)">
                        Dans: {{ getBoxName(item.boxId) }}
                      </span>
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
                  
                  <!-- Actions -->
                  <div class="flex items-center space-x-2">
                    <!-- Bouton OK pour marquer comme présent -->
                    <button 
                      v-if="!item.status"
                      @click="$emit('mark-present', item)"
                      class="px-2 py-1 bg-status-present text-white rounded-md text-sm"
                    >
                      OK
                    </button>
                    
                    <!-- Bouton pour ouvrir la modale de note -->
                    <button 
                      @click="$emit('open-note', item)"
                      class="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                      title="Ajouter une note"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    
                    <!-- Bouton pour afficher le contenu de la box si c'est une box -->
                    <button 
                      v-if="item.isBox && getBoxContents(item.boxId).length > 0"
                      @click.stop="showBoxContents(item.boxId)"
                      class="p-1 text-blue-500 hover:text-blue-700 dark:hover:text-blue-300"
                      title="Voir le contenu"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                    
                    <!-- Menu de statut -->
                    <div class="relative">
                      <button 
                        @click.stop="$emit('toggle-status', item)"
                        class="p-1 rounded-md"
                        :class="item.status ? getStatusClass(item.status) : 'bg-gray-200 dark:bg-gray-700'"
                      >
                        <span class="text-xs text-white px-1">
                          {{ getStatusLabel(item.status).substring(0, 3) }}...
                        </span>
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
                
                <!-- Si c'est une Box, afficher un résumé de son contenu -->
                <div v-if="item.isBox && item.boxId">
                  <div 
                    v-if="getBoxContents(item.boxId).length > 0" 
                    class="mt-2 pl-2 border-t border-gray-200 dark:border-gray-700 pt-2"
                  >
                    <div class="text-xs text-gray-500 dark:text-gray-400 flex justify-between items-center">
                      <span>{{ getBoxContents(item.boxId).length }} élément(s) dans cette box</span>
                      <button 
                        @click.stop="showBoxContents(item.boxId)"
                        class="text-blue-500 hover:text-blue-700 dark:hover:text-blue-300 underline"
                      >
                        Voir le détail
                      </button>
                    </div>
                    <div class="flex flex-wrap gap-1 mt-1">
                      <span 
                        v-for="(status, index) in getBoxContentStatus(item.boxId)" 
                        :key="index"
                        class="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs"
                        :class="getStatusClass(status)"
                      >
                        {{ getBoxContentStatusCount(item.boxId, status) }}
                      </span>
                    </div>
                  </div>
                  <div v-else class="mt-2 text-xs text-gray-500 dark:text-gray-400 italic">
                    Aucun élément associé à cette box
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue';
  
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
    'show-box-contents'
  ]);
  
  // Vérifier si une section est ouverte
  const isOpen = (sectionKey) => {
    return props.openSections.includes(sectionKey);
  };
  
  // Ouvrir/fermer une section
  const toggleSection = (sectionKey) => {
    emit('toggle-section', sectionKey);
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
          if (item.boxId === boxId) {
            foundName = item.name;
            boxFound = true;
          }
        });
      });
    });
    
    return boxFound ? foundName : boxId;
  };
  
  // Obtenir tous les éléments contenus dans une box spécifique
  const getBoxContents = (boxId) => {
    if (!boxId) return [];
    
    const contents = [];
    
    // Parcourir toutes les sections et sous-sections
    Object.keys(props.inventory).forEach(sectionKey => {
      const section = props.inventory[sectionKey];
      
      Object.keys(section.subsections || {}).forEach(subsectionKey => {
        const subsection = section.subsections[subsectionKey];
        
        (subsection.items || []).forEach(item => {
          if (item.boxId === boxId) {
            contents.push(item);
          }
        });
      });
    });
    
    return contents;
  };
  
  // Obtenir la liste des statuts présents dans une box
  const getBoxContentStatus = (boxId) => {
    if (!boxId) return [];
    
    const contents = getBoxContents(boxId);
    if (!contents || contents.length === 0) return [];
    
    const statuses = new Set();
    
    contents.forEach(item => {
      if (item.status !== undefined) {
        statuses.add(item.status);
      }
    });
    
    return Array.from(statuses);
  };
  
  // Compter le nombre d'éléments avec un statut spécifique dans une box
  const getBoxContentStatusCount = (boxId, status) => {
    if (!boxId) return 0;
    
    const contents = getBoxContents(boxId);
    if (!contents || contents.length === 0) return 0;
    
    return contents.filter(item => item.status === status).length;
  };
  
  // Montrer le contenu d'une box
  const showBoxContents = (boxId) => {
    emit('show-box-contents', boxId, getBoxName(boxId), getBoxContents(boxId));
  };
  </script>