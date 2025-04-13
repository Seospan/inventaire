<template>
  <div>
    <!-- Section progrès -->
    <ProgressSection 
      :overallProgress="overallProgress"
      :toFindCount="toFindCount"
      :toBuyCount="toBuyCount"
      :toRepairCount="toRepairCount"
    />
    
    <!-- Options d'import/export -->
    <div class="export-import">
      <button class="export-btn" @click="exportData">Exporter les données</button>
      <label class="import-btn">
        Importer les données
        <input type="file" class="import-input" @change="importData" accept=".json">
      </label>
    </div>
    
    <!-- Filtres par statut -->
    <StatusFilter 
      :currentFilter="currentFilter"
      :toFindCount="toFindCount"
      :toBuyCount="toBuyCount"
      :toRepairCount="toRepairCount"
      @change-filter="setFilter"
    />
    
    <!-- Loader -->
    <div v-if="isLoading" class="loader">
      <div></div><div></div><div></div>
    </div>
    
    <!-- Vue filtrée -->
    <FilteredView 
      v-else-if="currentFilter !== 'all'"
      :filteredItems="getFilteredItems()"
      :currentFilter="currentFilter"
      :getStatusLabel="getStatusLabel"
      @mark-item="markItemInFilteredView"
      @change-status="openStatusModalForFilteredItem"
      @reset-filter="setFilter('all')"
    />
    
    <!-- Vue normale (tous les éléments) -->
    <InventorySections 
      v-else
      :inventory="inventory"
      :openSections="openSections"
      :getStatusLabel="getStatusLabel"
      :getStatusClass="getStatusClass"
      :activeStatusDropdown="activeStatusDropdown"
      :getBoxProgress="getBoxProgress"
      @toggle-section="toggleSection"
      @toggle-status="toggleStatusOptions"
      @update-status="updateItemStatus"
      @mark-present="markAsPresent"
      @open-note="openNoteModal"
      @open-box-contents="openBoxContents"
    />
    
    <!-- Modals -->
    <NoteModal
      :active="noteModalActive"
      :note="currentNote"
      @close="closeNoteModal"
      @save="saveNote"
    />
    
    <CelebrationModal
      :active="celebrationActive"
      @close="closeCelebration"
    />
    
    <Toast 
      :active="toastActive"
      :message="toastMessage"
    />
  </div>
</template>

<script>
import ProgressSection from './ProgressSection.vue'
import StatusFilter from './StatusFilter.vue'
import FilteredView from './FilteredView.vue'
import InventorySections from './InventorySections.vue'
import NoteModal from '../ui/NoteModal.vue'
import CelebrationModal from '../ui/CelebrationModal.vue'
import Toast from '../ui/Toast.vue'

export default {
  name: 'InventoryManager',
  components: {
    ProgressSection,
    StatusFilter,
    FilteredView,
    InventorySections,
    NoteModal,
    CelebrationModal,
    Toast
  },
  data() {
    return {
      inventory: {},
      isLoading: true,
      openSections: [],
      activeStatusDropdown: { section: null, subsection: null, item: null },
      noteModalActive: false,
      currentNote: '',
      currentItem: { section: null, subsection: null, item: null },
      celebrationActive: false,
      toastActive: false,
      toastMessage: '',
      currentFilter: 'all',
      currentFilteredItem: null,
      statusOptions: [
        { value: "present", label: "Présent", className: "status-present" },
        { value: "to-find", label: "À trouver", className: "status-to-find" },
        { value: "to-repair", label: "À réparer", className: "status-to-repair" },
        { value: "to-buy", label: "À acheter", className: "status-to-buy" },
        { value: "not-needed", label: "Pas besoin", className: "status-not-needed" },
        { value: "in-truck", label: "Dans le camion", className: "status-in-truck" }
      ]
    }
  },
  computed: {
    overallProgress() {
      let totalItems = 0;
      let presentItems = 0;
      
      Object.keys(this.inventory).forEach(sectionKey => {
        const section = this.inventory[sectionKey];
        
        Object.keys(section.subsections).forEach(subKey => {
          const subsection = section.subsections[subKey];
          totalItems += subsection.items.length;
          
          presentItems += subsection.items.filter(item => {
            const statusPresent = item.status === "present";
            
            if (item.targetQuantity) {
              return statusPresent && 
                item.currentQuantity !== null && 
                item.currentQuantity >= item.targetQuantity;
            }
            
            if (item.variableQuantity) {
              return statusPresent && item.currentQuantity !== null;
            }
            
            return statusPresent;
          }).length;
        });
      });
      
      return totalItems > 0 ? Math.round((presentItems / totalItems) * 100) : 0;
    },
    toFindCount() {
      let count = 0;
      
      Object.keys(this.inventory).forEach(sectionKey => {
        const section = this.inventory[sectionKey];
        
        Object.keys(section.subsections).forEach(subKey => {
          const subsection = section.subsections[subKey];
          count += subsection.items.filter(item => item.status === "to-find").length;
        });
      });
      
      return count;
    },
    toBuyCount() {
      let count = 0;
      
      Object.keys(this.inventory).forEach(sectionKey => {
        const section = this.inventory[sectionKey];
        
        Object.keys(section.subsections).forEach(subKey => {
          const subsection = section.subsections[subKey];
          count += subsection.items.filter(item => item.status === "to-buy").length;
        });
      });
      
      return count;
    },
    toRepairCount() {
      let count = 0;
      
      Object.keys(this.inventory).forEach(sectionKey => {
        const section = this.inventory[sectionKey];
        
        Object.keys(section.subsections).forEach(subKey => {
          const subsection = section.subsections[subKey];
          count += subsection.items.filter(item => item.status === "to-repair").length;
        });
      });
      
      return count;
    }
  },
  methods: {
    // Navigation et filtres
    toggleSection(sectionKey) {
      const index = this.openSections.indexOf(sectionKey);
      if (index === -1) {
        this.openSections = [sectionKey];
      } else {
        this.openSections.splice(index, 1);
      }
    },
    
    setFilter(filter) {
      this.currentFilter = filter;
    },
    
    // Gestion des status
    toggleStatusOptions(section, subsection, item) {
      if (this.activeStatusDropdown.section === section && 
          this.activeStatusDropdown.subsection === subsection && 
          this.activeStatusDropdown.item === item) {
        this.activeStatusDropdown = { section: null, subsection: null, item: null };
      } else {
        this.activeStatusDropdown = { section, subsection, item };
      }
    },
    
    closeStatusOptions() {
      this.activeStatusDropdown = { section: null, subsection: null, item: null };
    },
    
    getStatusLabel(status) {
      if (!status) {
        return 'À vérifier';
      }
      
      const option = this.statusOptions.find(opt => opt.value === status);
      return option ? option.label : 'À vérifier';
    },
    
    getStatusClass(status) {
      if (!status) {
        return '';
      }
      
      const option = this.statusOptions.find(opt => opt.value === status);
      return option ? option.className : '';
    },
    
    updateItemStatus(sectionKey, subsectionKey, itemIndex, newStatus) {
      this.inventory[sectionKey].subsections[subsectionKey].items[itemIndex].status = newStatus;
      this.closeStatusOptions();
      this.saveInventoryData();
      
      this.checkSectionCompletion(sectionKey);
    },
    
    markAsPresent(sectionKey, subsectionKey, itemIndex) {
      this.inventory[sectionKey].subsections[subsectionKey].items[itemIndex].status = "present";
      this.saveInventoryData();
      
      this.checkSectionCompletion(sectionKey);
      
      const item = document.querySelector(`[data-item-id="${sectionKey}-${subsectionKey}-${itemIndex}"]`);
      if (item) {
        item.classList.add('flash-success');
        setTimeout(() => {
          item.classList.remove('flash-success');
        }, 500);
      }
    },
    
    // Gestion des notes
    openNoteModal(section, subsection, item) {
      this.currentItem = { section, subsection, item };
      this.currentNote = this.inventory[section].subsections[subsection].items[item].note || '';
      this.noteModalActive = true;
    },
    
    closeNoteModal() {
      this.noteModalActive = false;
      this.currentItem = { section: null, subsection: null, item: null };
    },
    
    saveNote() {
      const { section, subsection, item } = this.currentItem;
      if (section !== null) {
        this.inventory[section].subsections[subsection].items[item].note = this.currentNote;
        this.saveInventoryData();
        this.closeNoteModal();
        this.showToast('Note enregistrée');
      }
    },
    
    // Progression et complétion
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
    
    // Dans InventoryManager.vue
    getBoxProgress(boxId) {
      console.log('Calcul progression pour boxId:', boxId);
      
      // Chercher la section de contenu correspondante
      const contentSection = Object.entries(this.inventory).find(([key, section]) => 
        key === `${boxId}_contents`
      );
      
      if (!contentSection) {
        console.log('Pas de section trouvée pour:', boxId);
        return 0;
      }

      const section = contentSection[1];
      console.log('Section trouvée:', section);

      let totalItems = 0;
      let checkedItems = 0;
      
      Object.values(section.subsections).forEach(subsection => {
        subsection.items.forEach(item => {
          totalItems++;
          const statusPresent = item.status === "present";
          
          if (item.targetQuantity) {
            if (statusPresent && item.currentQuantity !== null && 
                item.currentQuantity >= item.targetQuantity) {
              checkedItems++;
            }
          } else if (item.variableQuantity) {
            if (statusPresent && item.currentQuantity !== null) {
              checkedItems++;
            }
          } else if (statusPresent) {
            checkedItems++;
          }
        });
      });

      console.log(`Progression pour ${boxId}: ${checkedItems}/${totalItems}`);
      return totalItems > 0 ? Math.round((checkedItems / totalItems) * 100) : 0;
    },
    
    checkSectionCompletion(sectionKey) {
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

      if (totalItems > 0 && checkedItems === totalItems) {
        this.celebrationActive = true;
      }
    },
    
    closeCelebration() {
      this.celebrationActive = false;
    },
    
    // Vue filtrée
    getFilteredItems() {
      const filteredItems = [];

      Object.keys(this.inventory).forEach(sectionKey => {
        const section = this.inventory[sectionKey];

        Object.keys(section.subsections).forEach(subsectionKey => {
          const subsection = section.subsections[subsectionKey];

          subsection.items.forEach((item, itemIndex) => {
            if (item.status === this.currentFilter) {
              filteredItems.push({
                ...item,
                sectionKey,
                subsectionKey,
                itemIndex,
                sectionTitle: section.title,
                subsectionTitle: subsection.title
              });
            }
          });
        });
      });

      return filteredItems;
    },
    
    markItemInFilteredView(item, status) {
      this.inventory[item.sectionKey].subsections[item.subsectionKey].items[item.itemIndex].status = status;
          this.saveInventoryData();
      this.showToast(`Élément marqué comme "${this.getStatusLabel(status)}"`);
  },

    openStatusModalForFilteredItem(item) {
      this.currentFilteredItem = item;
      const newStatus = prompt(
        `Choisir un nouveau statut pour "${item.name}" :\n1. Présent\n2. À trouver\n3. À réparer\n4. À acheter\n5. Pas besoin\n6. Dans le camion`,
        "1"
      );

      if (newStatus) {
        let status;
        switch(newStatus) {
          case "1": status = "present"; break;
          case "2": status = "to-find"; break;
          case "3": status = "to-repair"; break;
          case "4": status = "to-buy"; break;
          case "5": status = "not-needed"; break;
          case "6": status = "in-truck"; break;
          default: return;
      }

        this.markItemInFilteredView(item, status);
      }
    },
    
    // Notifications
    showToast(message) {
      this.toastMessage = message;
      this.toastActive = true;

      setTimeout(() => {
        this.toastActive = false;
      }, 3000);
    },

    // Gestion des données
    saveInventoryData() {
      localStorage.setItem('inventoryData', JSON.stringify(this.inventory));
    },

    loadInventoryData() {
      this.isLoading = true;

      try {
        const savedData = localStorage.getItem('inventoryData');
        if (savedData) {
          this.inventory = JSON.parse(savedData);
        } else {
          this.inventory = {};
  }
      } catch (error) {
        console.error('Error loading inventory data:', error);
        this.inventory = {};
}

      this.isLoading = false;
    },

    exportData() {
      const dataStr = JSON.stringify(this.inventory, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.setAttribute('href', url);
      a.setAttribute('download', `inventory-export-${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      this.showToast('Données exportées avec succès');
    },

    importData(event) {
      const file = event.target.files[0];
      if (!file) {
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target.result);
          this.inventory = importedData;
          this.saveInventoryData();
          this.showToast('Données importées avec succès');
        } catch (error) {
          console.error('Error importing data:', error);
          this.showToast('Erreur lors de l\'importation des données');
        }
      };

      reader.readAsText(file);
      event.target.value = '';
    },
    
    openBoxContents(sectionKey) {
    // Ouvrir la section si elle existe
    if (this.inventory[sectionKey]) {
      this.openSections = [sectionKey];
      
      // Faire défiler jusqu'à la section
      setTimeout(() => {
        const element = document.querySelector(`[data-section-id="${sectionKey}"]`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }
  },
  mounted() {
    document.addEventListener('click', (event) => {
      if (!event.target.closest('.status-dropdown')) {
        this.closeStatusOptions();
      }
    });

    this.loadInventoryData();

    if (Object.keys(this.inventory).length > 0) {
      this.openSections = [Object.keys(this.inventory)[0]];
    }
  },
}
</script>