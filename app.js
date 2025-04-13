// Get Vue components
const { createApp, ref, computed, onMounted, watch } = Vue;

// Status options
const statusOptions = [
    { value: "present", label: "Présent", className: "status-present" },
    { value: "to-find", label: "À trouver", className: "status-to-find" },
    { value: "to-repair", label: "À réparer", className: "status-to-repair" },
    { value: "to-buy", label: "À acheter", className: "status-to-buy" },
    { value: "not-needed", label: "Pas besoin", className: "status-not-needed" },
    { value: "in-truck", label: "Dans le camion", className: "status-in-truck" }
];

// Create the Vue app
const app = createApp({
    setup() {
        // State
        const inventory = ref({});
        const isLoading = ref(true);
        const openSections = ref([]);
        const activeStatusDropdown = ref({ section: null, subsection: null, item: null });
        const noteModalActive = ref(false);
        const currentNote = ref('');
        const currentItem = ref({ section: null, subsection: null, item: null });
        const celebrationActive = ref(false);
        const toastActive = ref(false);
        const toastMessage = ref('');
        
        // Computed
        const overallProgress = computed(() => {
            let totalItems = 0;
            let checkedItems = 0;
            
            Object.keys(inventory.value).forEach(sectionKey => {
                const section = inventory.value[sectionKey];
                
                Object.keys(section.subsections).forEach(subKey => {
                    const subsection = section.subsections[subKey];
                    totalItems += subsection.items.length;
                    
                    checkedItems += subsection.items.filter(item => {
                        // Check if the item's status is set
                        const statusSet = item.status !== null;
                        
                        // For items with targetQuantity, also check if quantity is set properly
                        if (item.targetQuantity) {
                            return statusSet && 
                                item.currentQuantity !== null && 
                                item.currentQuantity >= item.targetQuantity;
                        }
                        
                        // For items with variableQuantity, also check if quantity is set
                        if (item.variableQuantity) {
                            return statusSet && item.currentQuantity !== null;
                        }
                        
                        // For regular items, just check status
                        return statusSet;
                    }).length;
                });
            });
            
            return totalItems > 0 ? Math.round((checkedItems / totalItems) * 100) : 0;
        });
        
        // Methods
        const toggleSection = (sectionKey) => {
            const index = openSections.value.indexOf(sectionKey);
            if (index === -1) {
                // Close all other sections first
                openSections.value = [sectionKey];
            } else {
                openSections.value.splice(index, 1);
            }
        };
        
        const toggleStatusOptions = (section, subsection, item) => {
            if (activeStatusDropdown.value.section === section && 
                activeStatusDropdown.value.subsection === subsection && 
                activeStatusDropdown.value.item === item) {
                // Close if already open
                activeStatusDropdown.value = { section: null, subsection: null, item: null };
            } else {
                // Open this dropdown
                activeStatusDropdown.value = { section, subsection, item };
            }
        };
        
        const closeStatusOptions = () => {
            activeStatusDropdown.value = { section: null, subsection: null, item: null };
        };
        
        const getStatusLabel = (status) => {
            if (!status) {
                return 'À vérifier';
            }
            
            const option = statusOptions.find(opt => opt.value === status);
            return option ? option.label : 'À vérifier';
        };
        
        const getStatusClass = (status) => {
            if (!status) {
                return '';
            }
            
            const option = statusOptions.find(opt => opt.value === status);
            return option ? option.className : '';
        };
        
        const updateItemStatus = (sectionKey, subsectionKey, itemIndex, newStatus) => {
            inventory.value[sectionKey].subsections[subsectionKey].items[itemIndex].status = newStatus;
            closeStatusOptions();
            saveInventoryData();
            
            // Check if section is complete
            checkSectionCompletion(sectionKey);
        };
        
        // Méthode rapide pour marquer comme "présent"
        const markAsPresent = (sectionKey, subsectionKey, itemIndex) => {
            inventory.value[sectionKey].subsections[subsectionKey].items[itemIndex].status = "present";
            saveInventoryData();
            
            // Check if section is complete
            checkSectionCompletion(sectionKey);
            
            // Feedback visuel temporaire
            const item = document.querySelector(`[data-item-id="${sectionKey}-${subsectionKey}-${itemIndex}"]`);
            if (item) {
                item.classList.add('flash-success');
                setTimeout(() => {
                    item.classList.remove('flash-success');
                }, 500);
            }
        };
        
        const openNoteModal = (section, subsection, item) => {
            currentItem.value = { section, subsection, item };
            currentNote.value = inventory.value[section].subsections[subsection].items[item].note || '';
            noteModalActive.value = true;
        };
        
        const closeNoteModal = () => {
            noteModalActive.value = false;
            currentItem.value = { section: null, subsection: null, item: null };
        };
        
        const saveNote = () => {
            const { section, subsection, item } = currentItem.value;
            if (section !== null) {
                inventory.value[section].subsections[subsection].items[item].note = currentNote.value;
                saveInventoryData();
                closeNoteModal();
                showToast('Note enregistrée');
            }
        };
        
        const getSectionProgress = (sectionKey) => {
            const section = inventory.value[sectionKey];
            let totalItems = 0;
            let checkedItems = 0;
            
            Object.keys(section.subsections).forEach(subKey => {
                const subsection = section.subsections[subKey];
                totalItems += subsection.items.length;
                
                checkedItems += subsection.items.filter(item => {
                    // Check if the item's status is set
                    const statusSet = item.status !== null;
                    
                    // For items with targetQuantity, also check if quantity is set properly
                    if (item.targetQuantity) {
                        return statusSet && 
                            item.currentQuantity !== null && 
                            item.currentQuantity >= item.targetQuantity;
                    }
                    
                    // For items with variableQuantity, also check if quantity is set
                    if (item.variableQuantity) {
                        return statusSet && item.currentQuantity !== null;
                    }
                    
                    // For regular items, just check status
                    return statusSet;
                }).length;
            });
            
            const progressPercent = totalItems > 0 ? Math.round((checkedItems / totalItems) * 100) : 0;
            return `${checkedItems}/${totalItems} (${progressPercent}%)`;
        };
        
        const checkSectionCompletion = (sectionKey) => {
            const section = inventory.value[sectionKey];
            let totalItems = 0;
            let checkedItems = 0;
            
            Object.keys(section.subsections).forEach(subKey => {
                const subsection = section.subsections[subKey];
                totalItems += subsection.items.length;
                
                checkedItems += subsection.items.filter(item => {
                    // Check if the item's status is set
                    const statusSet = item.status !== null;
                    
                    // For items with targetQuantity, also check if quantity is set properly
                    if (item.targetQuantity) {
                        return statusSet && 
                            item.currentQuantity !== null && 
                            item.currentQuantity >= item.targetQuantity;
                    }
                    
                    // For items with variableQuantity, also check if quantity is set
                    if (item.variableQuantity) {
                        return statusSet && item.currentQuantity !== null;
                    }
                    
                    // For regular items, just check status
                    return statusSet;
                }).length;
            });
            
            if (totalItems > 0 && checkedItems === totalItems) {
                celebrationActive.value = true;
            }
        };
        
        const closeCelebration = () => {
            celebrationActive.value = false;
        };
        
        const showToast = (message) => {
            toastMessage.value = message;
            toastActive.value = true;
            
            setTimeout(() => {
                toastActive.value = false;
            }, 3000);
        };
        
        // Data management
        const saveInventoryData = () => {
            localStorage.setItem('inventoryData', JSON.stringify(inventory.value));
        };
        
        const loadInventoryData = () => {
            isLoading.value = true;
            
            try {
                const savedData = localStorage.getItem('inventoryData');
                if (savedData) {
                    // Load from localStorage
                    inventory.value = JSON.parse(savedData);
                } else {
                    // Initialize with empty object
                    inventory.value = {};
                }
            } catch (error) {
                console.error('Error loading inventory data:', error);
                inventory.value = {};
            }
            
            isLoading.value = false;
        };
        
        const exportData = () => {
            const dataStr = JSON.stringify(inventory.value, null, 2);
            const blob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.setAttribute('href', url);
            a.setAttribute('download', `inventory-export-${new Date().toISOString().split('T')[0]}.json`);
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            
            showToast('Données exportées avec succès');
        };
        
        const importData = (event) => {
            const file = event.target.files[0];
            if (!file) {
                return;
            }
            
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const importedData = JSON.parse(e.target.result);
                    inventory.value = importedData;
                    saveInventoryData();
                    showToast('Données importées avec succès');
                } catch (error) {
                    console.error('Error importing data:', error);
                    showToast('Erreur lors de l\'importation des données');
                }
            };
            
            reader.readAsText(file);
            event.target.value = ''; // Reset the input
        };
        
        // Setup click outside listener
        onMounted(() => {
            document.addEventListener('click', (event) => {
                // Close status dropdown when clicking outside
                if (!event.target.closest('.status-dropdown')) {
                    closeStatusOptions();
                }
            });
            
            // Load inventory data
            loadInventoryData();
            
            // Open first section by default if there's data
            if (Object.keys(inventory.value).length > 0) {
                openSections.value = [Object.keys(inventory.value)[0]];
            }
        });
        
        // Initialize and return
        return {
            inventory,
            isLoading,
            openSections,
            activeStatusDropdown,
            noteModalActive,
            currentNote,
            celebrationActive,
            toastActive,
            toastMessage,
            overallProgress,
            statusOptions,
            toggleSection,
            toggleStatusOptions,
            getStatusLabel,
            getStatusClass,
            updateItemStatus,
            markAsPresent,  // Ajout de la nouvelle méthode
            openNoteModal,
            closeNoteModal,
            saveNote,
            getSectionProgress,
            closeCelebration,
            exportData,
            importData,
            saveInventoryData
        };
    }
});

// Mount the app
app.mount('#app');