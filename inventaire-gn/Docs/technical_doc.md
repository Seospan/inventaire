# Inventaire GN - Technical Documentation

## Project Overview

Inventaire GN is a Vue.js web application designed to manage inventory for LARP (Live Action Role Play) events. Built with ADHD-friendly design principles, it provides clear visual feedback, structured organization, and intuitive interaction patterns to reduce cognitive load.

## ADHD-Friendly Design Principles

### Visual Design
- **Clear Status Colors**: Each status has a distinct, consistent color throughout the application
- **High Contrast**: Strong visual distinction between interactive and static elements
- **Progress Visualization**: Clear progress bars and completion indicators
- **Chunked Information**: Information is broken down into manageable sections
- **Reduced Clutter**: Only necessary information is shown at once

### Interaction Design
- **Immediate Feedback**: Every action has immediate visual feedback
- **Celebration Moments**: Accomplishments are acknowledged with celebration modals
- **Progressive Disclosure**: Complex information is revealed progressively
- **Consistent Patterns**: Similar actions work the same way throughout
- **Forgiving Design**: Easy to undo actions and correct mistakes

### Cognitive Support
- **Task Chunking**: Large tasks are broken into smaller, manageable steps
- **Visual Hierarchies**: Clear organization of information importance
- **Status Tracking**: Easy to track progress and remaining tasks
- **Context Preservation**: Current context is always clearly indicated
- **Memory Aids**: Important information is always visible or easily accessible

## Tech Stack

- **Framework**: Vue.js 3 with Composition API
- **Build Tool**: Vite
- **CSS Framework**: Tailwind CSS
- **Storage**: LocalStorage
- **Language**: JavaScript/Vue

## Project Structure
```
📦src 
┣ 📜App.vue 
┣ 📜main.js 
┣ 📜style.css 
┣ 📂assets 
┃ ┣ 📜main.css 
┃ ┗ 📜vue.svg 
┣ 📂components 
┃ ┣ 📜HelloWorld.vue 
┃ ┣ 📂inventory 
┃ ┃ ┣ 📜FilteredView.vue 
┃ ┃ ┣ 📜InventoryManager.vue 
┃ ┃ ┣ 📜ProgressSection.vue 
┃ ┃ ┣ 📜StatusFilter.vue 
┃ ┃ ┣ 📂actions 
┃ ┃ ┃ ┣ 📜ActionButtons.vue 
┃ ┃ ┃ ┣ 📜ExportButton.vue 
┃ ┃ ┃ ┣ 📜ImportButton.vue 
┃ ┃ ┃ ┗ 📜ResetButton.vue 
┃ ┃ ┣ 📂boxes 
┃ ┃ ┃ ┣ 📜BoxCollapsedView.vue 
┃ ┃ ┃ ┣ 📜BoxContent.vue 
┃ ┃ ┃ ┣ 📜BoxContentItem.vue 
┃ ┃ ┃ ┣ 📜BoxContentSections.vue 
┃ ┃ ┃ ┗ 📜BoxExpandedView.vue 
┃ ┃ ┣ 📂items 
┃ ┃ ┃ ┣ 📜InventoryItem.vue 
┃ ┃ ┃ ┣ 📜ItemControls.vue 
┃ ┃ ┃ ┣ 📜ItemHeader.vue 
┃ ┃ ┃ ┣ 📜ItemList.vue 
┃ ┃ ┃ ┗ 📜StatusDropdown.vue 
┃ ┃ ┣ 📂modals 
┃ ┃ ┃ ┗ 📜ModalContainer.vue 
┃ ┃ ┗ 📂sections 
┃ ┃ ┣ 📜InventorySections.vue 
┃ ┃ ┣ 📜SectionHeader.vue 
┃ ┃ ┣ 📜SectionItem.vue 
┃ ┃ ┣ 📜SubsectionHeader.vue 
┃ ┃ ┗ 📜SubSectionList.vue 
┃ ┗ 📂ui 
┃ ┣ 📜BoxContentsModal.vue 
┃ ┣ 📜CelebrationModal.vue 
┃ ┣ 📜NoteModal.vue 
┃ ┣ 📜ThemeToggle.vue 
┃ ┗ 📜Toast.vue 
┣ 📂composables 
┃ ┣ 📜useBoxManagement.js 
┃ ┣ 📜useInventory.js 
┃ ┣ 📜useStorage.js 
┃ ┗ 📜useTheme.js 
┗ 📂utils 
  ┗ 📜initData.js
```

Each component and file has a specific responsibility:

### Core Components
- `InventoryManager.vue`: Main component orchestrating the application
- `FilteredView.vue`: Displays filtered items by status
- `ProgressSection.vue`: Shows overall progress
- `StatusFilter.vue`: Interface for filtering by status

#### Sections Components
- `sections/InventorySections.vue`: Main sections container
- `sections/SectionHeader.vue`: Section title and progress
- `sections/SectionItem.vue`: Individual section
- `sections/SubsectionHeader.vue`: Subsection title
- `sections/SubSectionList.vue`: List of subsections

#### Items Components
- `items/InventoryItem.vue`: Main item component
- `items/ItemControls.vue`: Item action buttons
- `items/ItemHeader.vue`: Item title and basic info
- `items/ItemList.vue`: List of items
- `items/StatusDropdown.vue`: Status selection dropdown

#### Boxes Components
- `boxes/BoxContent.vue`: Main box content container
- `boxes/BoxCollapsedView.vue`: Collapsed state of box content
- `boxes/BoxExpandedView.vue`: Expanded state of box content
- `boxes/BoxContentItem.vue`: Individual box item display
- `boxes/BoxContentSections.vue`: Sections within a box

#### Actions Components
- `actions/ActionButtons.vue`: Container for all action buttons
- `actions/ExportButton.vue`: Handles inventory export
- `actions/ImportButton.vue`: Manages inventory import
- `actions/ResetButton.vue`: Handles inventory reset

#### Modals
- `modals/ModalContainer.vue`: Orchestrates all modals

### UI Components
- `BoxContentsModal.vue`: Modal for displaying and managing box contents
- `CelebrationModal.vue`: Displays completion celebrations
- `NoteModal.vue`: Modal for managing item notes
- `ThemeToggle.vue`: Handles theme switching
- `Toast.vue`: Manages notifications

### Composables
- `useInventory.js`: Core inventory management logic
- `useStorage.js`: LocalStorage management
- `useBoxManagement.js`: Box-specific operations
- `useTheme.js`: Theme management logic

### Utils
- `initData.js`: Initial data setup and validation

## Data Structure

### Inventory Item Schema
```javascript
{
  name: String,                // Item name
  isBox: Boolean,             // Whether item is a container
  boxId: String,              // Unique ID if item is a box
  status: String,             // Current status
  inTruck: Boolean,           // Whether item is loaded
  note: String,               // Optional notes
  currentQuantity: Number,    // Current quantity
  targetQuantity: Number,     // Target quantity
  isMinimumQuantity: Boolean, // If quantity is minimum
  variableQuantity: Boolean   // If quantity can vary
}
```

### Status Types and Their ADHD-Friendly Implementation
```javascript
const STATUS = {
  NULL: null,        // Visual: Gray - Neutral state requiring attention
  PRESENT: 'present',// Visual: Green - Clear positive completion
  TO_FIND: 'to-find',// Visual: Yellow - Requires attention but not urgent
  TO_BUY: 'to-buy',  // Visual: Orange - Action required
  TO_REPAIR: 'to-repair', // Visual: Red - Urgent attention needed
  NOT_NEEDED: 'not-needed', // Visual: Blue - Can be ignored
  IN_TRUCK: 'in-truck'    // Visual: Purple - Different completion state
}
```

## Key Components and Their ADHD-Friendly Features

### InventoryManager.vue

Main orchestrator component with:

- **Clear Section Organization**: Hierarchical structure reduces cognitive load
- **Visual Progress Tracking**: Always visible progress indicators
- **Consistent Navigation**: Predictable layout and interaction patterns
- **Status Filtering**: Ability to focus on specific tasks

```javascript
// Example of status tracking implementation
const metrics = computed(() => {
  // Calculations providing immediate feedback on progress
  return {
    total: calculateTotal(),
    present: countByStatus('present'),
    toFind: countByStatus('to-find'),
    // ... other metrics
  }
});
```

### InventoryItem.vue
Individual item component featuring:

- **Clear Status Indication**: Prominent visual status indicators
- **Direct Actions**: One-click status changes
- **Contextual Information**: Related information grouped together
- **Progressive Disclosure**: Complex features revealed on demand

```javascript
// Example of immediate feedback implementation
const updateStatus = (newStatus) => {
  item.status = newStatus;
  showToast(`Item marked as ${getStatusLabel(newStatus)}`);
  checkCompletion();
};
```

### BoxContentsModal.vue

Modal for box contents with:

- **Summary View**: Quick overview of contents
- **Grouped Actions**: Related actions clustered together
- **Clear Progress**: Visual indication of completion
- **Easy Navigation**: Direct links to related items

## ADHD-Friendly UI Components

### Toast Notifications

Provides immediate, non-intrusive feedback:

```javascript
const showToast = (message, type = 'info', duration = 3000) => {
  toastMessage.value = message;
  toastType.value = type;
  toastActive.value = true;
  
  setTimeout(() => {
    toastActive.value = false;
  }, duration);
};
```

### Progress Indicators
Clear visual feedback on task completion:

```javascript
<template>
  <div class="progress-bar">
    <div 
      class="progress-fill"
      :style="{ width: `${progress}%` }"
      :class="getProgressClass(progress)"
    ></div>
    <div class="progress-label">
      {{ progress }}% Complete
    </div>
  </div>
</template>
```

### Status Filters

Help focus on specific tasks:

```javascript
<template>
  <div class="status-filters">
    <button 
      v-for="status in STATUS"
      :key="status"
      :class="['filter-button', { active: currentFilter === status }]"
      @click="setFilter(status)"
    >
      {{ getStatusLabel(status) }}
      <span class="count">{{ getStatusCount(status) }}</span>
    </button>
  </div>
</template>
```

## Development Guidelines for ADHD-Friendly Features
### Visual Feedback
- Always provide immediate feedback for user actions
- Use consistent color coding for statuses
- Implement clear progress indicators
- Show completion states prominently
### Interaction Design
- Keep actions reversible
- Provide clear confirmation for important actions
- Implement progressive disclosure for complex features
- Maintain consistent interaction patterns

### State Management
```javascript
// Example of state management with clear feedback
const updateItemState = async (item, newState) => {
  // Show loading state
  item.loading = true;
  
  try {
    // Update state
    await updateState(item, newState);
    
    // Show success feedback
    showToast('Item updated successfully');
    
    // Update progress
    recalculateProgress();
  } catch (error) {
    // Clear error feedback
    showToast('Failed to update item', 'error');
  } finally {
    // Clear loading state
    item.loading = false;
  }
};
```

## Working with the Code
### Adding New Features
1. Consider ADHD-friendly design principles
2. Implement clear visual feedback
3. Maintain consistent patterns
4. Test with different focus states
5. Document accessibility features

### Common Tasks
### Adding a New Status
```javascript
// 1. Add to STATUS enum
const STATUS = {
  ...existingStatuses,
  NEW_STATUS: 'new-status'
};

// 2. Add to status classes
const statusClasses = {
  'new-status': 'bg-new-status text-white',
};

// 3. Add to status labels
const statusLabels = {
  'new-status': 'New Status Label',
};
```

## Build and Deploy

```javascript
# Install dependencies
npm install

# Development server
npm run dev

# Production build
npm run build
```

## Testing Considerations for ADHD-Friendly Features

1. Visual Clarity Testing

- Test color contrast
- Verify status visibility
- Check feedback clarity

2. Interaction Testing

- Verify immediate feedback
- Test error states
- Check recovery paths

3. Focus Management

- Test keyboard navigation
- Verify focus indicators
- Check tab order

4. State Management

- Test state persistence
- Verify undo functionality
- Check error recovery

## Future Improvements

1. Additional ADHD Support Features
- Task timing aids
- Focus mode
- Customizable organization
- Technical Enhancements

2. Automated testing
- Backend integration
- Offline capabilities

3. UI/UX Improvements
- More visual aids
- Enhanced progress tracking
- Customizable interfaces