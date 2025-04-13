// Create the Vue app
const app = Vue.createApp({
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
            currentFilter: 'all', // Valeur par défaut : afficher tout
            currentFilteredItem: null, // Pour stocker l'élément actuellement modifié en vue filtrée
            statusOptions: [
                { value: "present", label: "Présent", className: "status-present" },
                { value: "to-find", label: "À trouver", className: "status-to-find" },
                { value: "to-repair", label: "À réparer", className: "status-to-repair" },
                { value: "to-buy", label: "À acheter", className: "status-to-buy" },
                { value: "not-needed", label: "Pas besoin", className: "status-not-needed" },
                { value: "in-truck", label: "Dans le camion", className: "status-in-truck" }
            ]
        };
    },
    
    computed: {
        // Calcul de la progression globale basée uniquement sur les éléments "présents"
        overallProgress() {
            let totalItems = 0;
            let presentItems = 0;
            
            Object.keys(this.inventory).forEach(sectionKey => {
                const section = this.inventory[sectionKey];
                
                Object.keys(section.subsections).forEach(subKey => {
                    const subsection = section.subsections[subKey];
                    totalItems += subsection.items.length;
                    
                    presentItems += subsection.items.filter(item => {
                        // Uniquement compter les éléments marqués comme "présent"
                        const statusPresent = item.status === "present";
                        
                        // Pour items avec targetQuantity, vérifier aussi la quantité
                        if (item.targetQuantity) {
                            return statusPresent && 
                                item.currentQuantity !== null && 
                                item.currentQuantity >= item.targetQuantity;
                        }
                        
                        // Pour items avec variableQuantity, vérifier aussi la quantité
                        if (item.variableQuantity) {
                            return statusPresent && item.currentQuantity !== null;
                        }
                        
                        // Pour les items standards, juste vérifier le statut "présent"
                        return statusPresent;
                    }).length;
                });
            });
            
            return totalItems > 0 ? Math.round((presentItems / totalItems) * 100) : 0;
        },
        
        // Compteur d'éléments à trouver
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
        
        // Compteur d'éléments à acheter
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
        
        // Compteur d'éléments à réparer
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
                // Close all other sections first
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
                // Close if already open
                this.activeStatusDropdown = { section: null, subsection: null, item: null };
            } else {
                // Open this dropdown
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
            
            // Check if section is complete
            this.checkSectionCompletion(sectionKey);
        },
        
        // Méthode rapide pour marquer comme "présent"
        markAsPresent(sectionKey, subsectionKey, itemIndex) {
            this.inventory[sectionKey].subsections[subsectionKey].items[itemIndex].status = "present";
            this.saveInventoryData();
            
            // Check if section is complete
            this.checkSectionCompletion(sectionKey);
            
            // Feedback visuel temporaire
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
        },
        
        checkSectionCompletion(sectionKey) {
            const section = this.inventory[sectionKey];
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
                            // Créer une copie de l'item avec des infos de section
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
            // Ici, vous pourriez implémenter une modal pour changer le statut
            // Pour l'instant, utilisez une solution simple
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
                    // Load from localStorage
                    this.inventory = JSON.parse(savedData);
                } else {
                    // Initialize with empty object
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
            event.target.value = ''; // Reset the input
        }
    },
    
    mounted() {
        // Setup click outside listener
        document.addEventListener('click', (event) => {
            // Close status dropdown when clicking outside
            if (!event.target.closest('.status-dropdown')) {
                this.closeStatusOptions();
            }
        });
        
        // Load inventory data
        this.loadInventoryData();
        
        // Open first section by default if there's data
        if (Object.keys(this.inventory).length > 0) {
            this.openSections = [Object.keys(this.inventory)[0]];
        }
    }
});

// Mount the app
app.mount('#app');