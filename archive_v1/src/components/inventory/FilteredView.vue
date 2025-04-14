<template>
    <div class="filtered-view">
      <h3 class="filtered-view-title">Éléments {{ getStatusLabel(currentFilter).toLowerCase() }}</h3>
      
      <div v-if="filteredItems.length === 0" class="empty-filter-message">
        Aucun élément avec ce statut
      </div>
      
      <div v-else class="filtered-items">
        <div v-for="(item, index) in filteredItems" :key="index" class="filtered-item">
          <div class="filtered-item-header">
            <div class="filtered-item-name">{{ item.name }}</div>
            <div class="filtered-item-section">{{ item.sectionTitle }} > {{ item.subsectionTitle }}</div>
          </div>
          
          <div class="filtered-item-details">
            <div v-if="item.targetQuantity" class="filtered-item-quantity">
              Quantité: {{ item.targetQuantity }}{{ item.isMinimumQuantity ? '+' : '' }}
              <span v-if="item.currentQuantity !== null">(Actuel: {{ item.currentQuantity }})</span>
            </div>
            
            <div v-if="item.variableQuantity && item.currentQuantity !== null" class="filtered-item-quantity">
              Quantité: {{ item.currentQuantity }}
            </div>
            
            <div v-if="item.note" class="filtered-item-note">
              <strong>Note:</strong> {{ item.note }}
            </div>
          </div>
          
          <div class="filtered-item-actions">
            <button 
              class="quick-ok-btn" 
              @click="$emit('mark-item', item, 'present')"
            >
              Marquer présent
            </button>
            <button 
              class="change-status-btn" 
              @click="$emit('change-status', item)"
            >
              Changer statut
            </button>
          </div>
        </div>
      </div>
      
      <button class="back-to-all-btn" @click="$emit('reset-filter')">
        Retour à l'inventaire complet
      </button>
    </div>
  </template>
  
  <script>
  export default {
    name: 'FilteredView',
    props: {
      filteredItems: {
        type: Array,
        required: true
      },
      currentFilter: {
        type: String,
        required: true
      },
      getStatusLabel: {
        type: Function,
        required: true
      }
    }
  }
  </script>