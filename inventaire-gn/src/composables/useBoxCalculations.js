// src/composables/useBoxCalculations.js
import { computed } from 'vue';

export function useBoxCalculations(inventory) {
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

  const getBoxItemCount = (box) => {
    return getAllBoxItems(box).length;
  };

  const getBoxCompletedCount = (box) => {
    const items = getAllBoxItems(box);
    if (!items || items.length === 0) return 0;
    
    return items.filter(item => 
      item.status === 'present' || 
      item.status === 'in-truck' || 
      item.status === 'not-needed'
    ).length;
  };

  const getBoxCompletionPercentage = (box) => {
    const items = getAllBoxItems(box);
    if (!items || items.length === 0) return 0;
    
    const completed = getBoxCompletedCount(box);
    return Math.round((completed / items.length) * 100);
  };

  const getSectionProgress = (sectionKey) => {
    if (!inventory) return 0;
    const section = inventory[sectionKey];
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
            const boxItems = getAllBoxItems(item);
            boxItems.forEach(contentItem => {
              if (contentItem.status !== 'not-needed') {
                total++;
                if (contentItem.status === 'present' || contentItem.status === 'in-truck') {
                  completed++;
                }
              }
            });
          }
        }
      });
    });
    
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  return {
    getAllBoxItems,
    getBoxItemCount,
    getBoxCompletedCount,
    getBoxCompletionPercentage,
    getSectionProgress
  };
}