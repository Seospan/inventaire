<template>
    <div>
      <div v-for="(section, sectionKey) in inventory" :key="sectionKey" class="section" :data-section-id="sectionKey">
        <div class="section-header" @click="$emit('toggle-section', sectionKey)">
          <h2>{{ section.title }}</h2>
          <span class="section-progress">{{ getSectionProgress(sectionKey) }}</span>
        </div>
        
        <div :class="['section-content', { open: openSections.includes(sectionKey) }]">
          <div v-for="(subsection, subsectionKey) in section.subsections" :key="`${sectionKey}-${subsectionKey}`" class="subsection">
            <div class="subsection-title">{{ subsection.title }}</div>
            
            <div v-for="(item, itemIndex) in subsection.items"
                 :key="`${sectionKey}-${subsectionKey}-${itemIndex}`"
                 class="item"
                 :class="{ 'item-box': item.isBox }"
                 :data-item-id="`${sectionKey}-${subsectionKey}-${itemIndex}`">

              <!-- Si c'est une caisse -->
              <template v-if="item.isBox">
                <div class="item-name">
                  <div class="box-container">
                    <div class="box-header">
                      📦 {{ item.name }}
                      <button 
                        class="view-contents-btn" 
                        @click.stop="openBoxContents(item.boxId)"
                        title="Voir le contenu"
                      >
                        📂 Ouvrir
                      </button>
                    </div>
                    <div v-if="item.boxId" class="box-progress-container">
                      <div class="box-progress-bar">
                        <div
                          class="box-progress-fill"
                          :style="{ width: `${getBoxProgress(item.boxId)}%` }"
                          :class="getProgressClass(getBoxProgress(item.boxId))"
                        >
                          {{ getBoxProgress(item.boxId) }}%
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </template>

              <!-- Si c'est un item normal -->
              <template v-else>
                <div class="item-content">
                  <div class="item-main">
                    <div class="item-name">
                      {{ item.name }}
                <span v-if="item.targetQuantity" class="item-target-quantity">
                  ({{ item.targetQuantity }}{{ item.isMinimumQuantity ? '+' : '' }})
                </span>
              </div>
              
              <div v-if="item.targetQuantity || item.variableQuantity"
                         class="item-quantity-container">
                <label v-if="item.targetQuantity">Qté:</label>
                <label v-else>Nb:</label>
                <input
                  type="number"
                  class="quantity-input"
                  v-model="item.currentQuantity"
                  min="0"
                  :class="{
                    'quantity-ok': item.targetQuantity && item.currentQuantity >= item.targetQuantity,
                    'quantity-low': item.targetQuantity && item.currentQuantity !== null && item.currentQuantity < item.targetQuantity
                  }"
                  @change="saveChanges()"
                />
              </div>
                  </div>

                  <div class="item-actions">
                    <button
                      class="quick-ok-btn"
                      @click="$emit('mark-present', sectionKey, subsectionKey, itemIndex)"
                      :class="{ 'selected': item.status === 'present' }"
                    >
                      OK
                    </button>

                    <div class="status-dropdown">
                      <div
                        :class="['item-status', getStatusClass(item.status)]"
                        @click="$emit('toggle-status', sectionKey, subsectionKey, itemIndex)"
                      >
                        {{ getStatusLabel(item.status) }}
            </div>
                      <div v-if="isStatusDropdownOpen(sectionKey, subsectionKey, itemIndex)" class="status-options active">
                        <div
                          v-for="option in statusOptions"
                          :key="option.value"
                          class="status-option"
                          @click="$emit('update-status', sectionKey, subsectionKey, itemIndex, option.value)"
                        >
                          {{ option.label }}
                        </div>
                      </div>
                    </div>

                    <div class="note-icon"
                         @click="$emit('open-note', sectionKey, subsectionKey, itemIndex)">
                      📝
    </div>
                  </div>
                </div>
  </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'InventorySections',
    props: {
      inventory: {
        type: Object,
        required: true
      },
      openSections: {
        type: Array,
        required: true
      },
      getStatusLabel: {
        type: Function,
        required: true
      },
      getStatusClass: {
        type: Function,
        required: true
      },
      activeStatusDropdown: {
      type: Object,
      required: true
      },
      getBoxProgress: {
        type: Function,
        required: true
      }
    },
    data() {
      return {
        statusOptions: [
          { value: "present", label: "Présent", className: "status-present" },
          { value: "to-find", label: "À trouver", className: "status-to-find" },
          { value: "to-repair", label: "À réparer", className: "status-to-repair" },
          { value: "to-buy", label: "À acheter", className: "status-to-buy" },
          { value: "not-needed", label: "Pas besoin", className: "status-not-needed" },
          { value: "in-truck", label: "Dans le camion", className: "status-in-truck" }
        ],
        activeDropdown: { section: null, subsection: null, item: null }
      };
    },
    methods: {
      getSectionProgress(sectionKey) {
        const section = this.inventory[sectionKey];
        let totalItems = 0;
        let checkedItems = 0;
        
        Object.keys(section.subsections).forEach(subKey => {
          const subsection = section.subsections[subKey];
          totalItems += subsection.items.length;
          
          checkedItems += subsection.items.filter(item => {
            const statusSet = item.status !== null;
            
            if (item.targetQuantity) {
              return statusSet && 
                item.currentQuantity !== null && 
                item.currentQuantity >= item.targetQuantity;
            }
            
            if (item.variableQuantity) {
              return statusSet && item.currentQuantity !== null;
            }
            
            return statusSet;
          }).length;
        });
        
        const progressPercent = totalItems > 0 ? Math.round((checkedItems / totalItems) * 100) : 0;
        return `${checkedItems}/${totalItems} (${progressPercent}%)`;
      },
      isStatusDropdownOpen(section, subsection, item) {
        return this.activeStatusDropdown.section === section && 
          this.activeStatusDropdown.subsection === subsection && 
          this.activeStatusDropdown.item === item;
      },
      saveChanges() {
        this.$emit('save');
      },
      getProgressClass(progress) {
        if (progress >= 100) return 'progress-complete';
        if (progress >= 75) return 'progress-good';
        if (progress >= 50) return 'progress-medium';
        return 'progress-low';
      },
      openBoxContents(boxId) {
        const sectionKey = `${boxId}_contents`;
        this.$emit('open-box-contents', sectionKey);
      }
    },
  }
  </script>