// src/composables/useBoxManagement.js
import { ref } from 'vue';

export function useBoxManagement() {
  const expandedBoxes = ref([]);
  
  // Toggle box expansion
  const toggleBoxExpand = (boxId) => {
    const index = expandedBoxes.value.indexOf(boxId);
    if (index === -1) {
      expandedBoxes.value.push(boxId);
    } else {
      expandedBoxes.value.splice(index, 1);
    }
  };
  
  // Check if a box has any items
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
  
  // Get all items from a box
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
  
  // Count items in a box
  const getBoxItemCount = (box) => {
    return getAllBoxItems(box).length;
  };
  
  // Count completed items in a box
  const getBoxCompletedCount = (box) => {
    const items = getAllBoxItems(box);
    if (!items || items.length === 0) return 0;
    
    return items.filter(item => 
      item.status === 'present' || 
      item.status === 'in-truck' || 
      item.status === 'not-needed'
    ).length;
  };
  
  // Calculate box completion percentage
  const getBoxCompletionPercentage = (box) => {
    const items = getAllBoxItems(box);
    if (!items || items.length === 0) return 0;
    
    const completed = getBoxCompletedCount(box);
    return Math.round((completed / items.length) * 100);
  };
  
  return {
    expandedBoxes,
    toggleBoxExpand,
    hasBoxContents,
    getAllBoxItems,
    getBoxItemCount,
    getBoxCompletedCount,
    getBoxCompletionPercentage
  };
}