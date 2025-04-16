# Inventaire GN - Technical and Functional Documentation

## Project Overview

Inventaire GN is a Vue.js web application designed to manage inventory for LARP (Live Action Role Play) events. The application is specifically designed with ADHD-friendly principles, providing clear visual feedback, structured organization, and intuitive interaction patterns to reduce cognitive load.

## Application Structure

### File Tree

src/ ├── App.vue # Main application container ├── main.js # Application entry point ├── style.css # Global CSS ├── assets/ # Static assets │ ├── main.css │ └── vue.svg ├── components/ # UI components │ ├── inventory/ # Inventory-specific components │ │ ├── actions/ # Action-related components │ │ ├── boxes/ # Box management components │ │ ├── items/ # Item-related components │ │ ├── modals/ # Modal-specific components │ │ └── sections/ # Section organization components │ └── ui/ # Shared UI components ├── composables/ # Vue composables (reusable logic) ├── router/ # Vue Router configuration ├── utils/ # Utility functions └── views/ # Page components



## ADHD-Friendly Design Principles

The application has been built with specific ADHD-friendly design principles in mind:

### Visual Design
- **Clear Status Colors**: Each status (present, to-find, to-buy, etc.) has a distinct, consistent color throughout the application
- **High Contrast**: Strong visual distinction between interactive and static elements
- **Progress Visualization**: Clear progress bars and completion indicators at multiple levels (item, box, section)
- **Chunked Information**: Information is broken down into manageable sections with clear hierarchy
- **Reduced Clutter**: Information is displayed progressively, showing only what is necessary at each level

### Interaction Design
- **Immediate Feedback**: Every action provides immediate visual feedback through status changes and toast notifications
- **Progressive Disclosure**: Complex information (like box contents) is revealed progressively through expandable sections
- **Consistent Patterns**: Similar actions work the same way throughout the application
- **Forgiving Design**: Actions can be easily reversed or changed

### Cognitive Support
- **Task Chunking**: Large inventory tasks are broken into smaller, manageable steps
- **Visual Hierarchies**: Clear organization from sections to subsections to items
- **Status Tracking**: Easy to track progress through multiple visualization methods
- **Context Preservation**: Current context is always clearly indicated (what section, box, etc.)

## Tech Stack

- **Frontend Framework**: Vue.js 3 with Composition API
- **Build Tool**: Vite
- **CSS Framework**: Tailwind CSS
- **Routing**: Vue Router
- **State Management**: Vue Composition API + Composables
- **Storage**: LocalStorage for persistence
- **Language**: JavaScript/Vue

## Core Components

### Views
- **InventoryView.vue**: Main view for inventory management
- **TruckLoadingView.vue**: Specialized view for tracking items loaded into the truck

### Inventory Management
- **InventoryManager.vue**: Main component orchestrating the inventory functionality
- **TruckLoadingManager.vue**: Specialized component for truck loading workflow
- **ProgressSection.vue**: Displays overall progress with visual indicators
- **StatusFilter.vue**: Filters items by status for focused work

### Section Management
- **InventorySections.vue**: Organizes inventory into collapsible sections
- **SectionHeader.vue**: Header for each section with progress indicators
- **SubSectionList.vue**: Manages subsections within a section

### Item Management
- **InventoryItem.vue**: Core component displaying individual inventory items
- **ItemHeader.vue**: Displays item name and basic information
- **ItemControls.vue**: Action buttons for individual items
- **ItemQuantity.vue**: Manages item quantities
- **ItemNote.vue**: Displays and manages item notes
- **StatusDropdown.vue**: Dropdown menu for changing item status

### Box Management
- **BoxContent.vue**: Container for box contents with expanded/collapsed states
- **BoxExpandedView.vue**: Expanded view of box contents with detailed information
- **BoxCollapsedView.vue**: Collapsed summary view of box contents
- **BoxContentSections.vue**: Organizes content within boxes into sections
- **BoxContentItem.vue**: Individual item within a box

### UI Components
- **Toast.vue**: Non-intrusive notifications
- **CelebrationModal.vue**: Positive reinforcement for completed tasks
- **NoteModal.vue**: Modal for editing notes
- **ConfirmModal.vue**: Confirmation dialogs for important actions
- **BoxContentsModal.vue**: Alternative modal view for box contents

## Composables (Shared Logic)

The application uses several composables to manage shared functionality:

### useInventory.js
Core inventory management logic including:
- Loading and saving inventory data
- Status management
- Progress tracking
- Filtering
- Toast notifications

### useBoxManagement.js
Box-specific operations:
- Expanding/collapsing boxes
- Getting box contents
- Navigating between boxes
- Box item management

### useBoxCalculations.js
Calculations related to boxes:
- Box completion percentage
- Section progress
- Item counting by status
- Box status determination based on content

### useStorage.js
LocalStorage management:
- Saving inventory data
- Loading saved data
- Data export/import
- Data clearing

### useTheme.js
Theme management (light/dark mode):
- Theme detection
- Theme switching
- Theme persistence

## Data Structure

### Inventory Structure

```javascript
{
  [sectionKey]: {              // e.g., "kitchen", "props", etc.
    title: String,             // Section title
    subsections: {
      [subsectionKey]: {       // e.g., "utensils", "cookware", etc.
        title: String,         // Subsection title
        items: [               // Array of items in this subsection
          {
            name: String,      // Item name
            isBox: Boolean,    // Whether this item is a container
            boxId: String,     // Unique ID if this is a box
            status: String,    // Current status (see STATUS enum)
            inTruck: Boolean,  // Whether item is loaded in truck
            note: String,      // Optional notes
            currentQuantity: Number,    // Current quantity
            targetQuantity: Number,     // Target quantity
            isMinimumQuantity: Boolean, // If quantity is minimum
            variableQuantity: Boolean,  // If quantity can vary
            contents: {         // Only present if isBox is true
              [contentSubsectionKey]: {
                title: String,
                items: [/* same structure as above */]
              }
            }
          }
        ]
      }
    }
  }
}
```

### Status types

```javascript
const STATUS = {
  NULL: null,                  // Undetermined (gray)
  PRESENT: 'present',          // Item is present (green)
  TO_FIND: 'to-find',          // Item needs to be found (yellow)
  TO_BUY: 'to-buy',            // Item needs to be purchased (orange)
  TO_REPAIR: 'to-repair',      // Item needs repairs (red)
  NOT_NEEDED: 'not-needed',    // Item is not needed (blue)
  IN_TRUCK: 'in-truck'         // Item is loaded in the truck (purple)
}
```

# Inventaire GN - Technical and Functional Documentation (Part 4)

## Key Features

### Inventory Management
- Hierarchical organization (sections → subsections → items)
- Status tracking with visual indicators
- Progress visualization at all levels
- Note-taking for individual items
- Quantity tracking

### Box Management
- Items can be designated as boxes (containers)
- Boxes can contain other items organized in subsections
- Box status is derived from the status of contained items
- Expandable/collapsible box views
- Box contents can be navigated in-line or in a modal

### Truck Loading
- Specialized view for loading items into the truck
- Items can be marked as loaded/unloaded
- Tracking of loading progress

### Data Persistence
- All data is saved to LocalStorage
- Import/export functionality for data backup
- Reset functionality for starting fresh

### Visual Status Tracking
- Clear color-coding for all statuses
- Progress bars at section, subsection, and box levels
- Completion celebration for positive reinforcement
- Status filtering for focused work

## Component Relationships and Data Flow

### Main Component Flow
1. **App.vue** → Router → **Views** (InventoryView/TruckLoadingView)
2. Views → **Manager Components** (InventoryManager/TruckLoadingManager)
3. Manager Components → **Section Components** → **Item Components**

### Box Content Flow
1. **InventoryItem.vue** (for boxes) → **BoxContent.vue**
2. **BoxContent.vue** → **BoxExpandedView.vue** or **BoxCollapsedView.vue**
3. **BoxExpandedView.vue** → **BoxContentSections.vue** → **BoxContentItem.vue**

### Status Management Flow
1. User interaction with **ItemControls.vue** or **StatusDropdown.vue**
2. Status change triggers `updateItemStatus` in **useInventory.js**
3. For boxes, status updates trigger updates to contained items
4. Status changes update progress indicators and trigger visual feedback

## Recent Refactoring Changes

The application has recently undergone significant refactoring to improve component organization:

1. **Component Extraction**: Large components were broken down into smaller, focused ones:
   - `InventoryItem.vue` was split into `ItemHeader.vue`, `ItemControls.vue`, etc.
   - Box management was refactored into dedicated components

2. **Box Status Handling**: Box status is now derived from contained items rather than set directly:
   - Box status controls are removed for boxes with contents
   - Box status is automatically calculated based on contained item statuses

3. **Composable Organization**: Business logic was moved from components to composables:
   - `useBoxCalculations.js` was created for box-specific calculations
   - Status management logic was consolidated in `useInventory.js`

4. **Prop Chain Optimization**: The prop drilling was reduced by:
   - Using composables for shared functionality
   - Structuring components with clearer responsibilities

## Implementation Details

### Box Calculation Logic
Box status and progress are calculated based on the status of contained items:

```javascript
// From useBoxCalculations.js
const getBoxCompletionPercentage = (box) => {
  const items = getAllBoxItems(box);
  if (!items || items.length === 0) return 0;
  
  const completed = getBoxCompletedCount(box);
  return Math.round((completed / items.length) * 100);
};
```

### Status updates

```javascript
// From useInventory.js
const updateItemStatus = (item, status) => {
  item.status = status;
  
  // Update truck loading status
  if (status === STATUS.IN_TRUCK) {
    item.inTruck = true;
  } else if (status === STATUS.PRESENT) {
    item.inTruck = false;
  }
  
  // Save changes
  saveInventory();
  
  // Show feedback
  showToast(`Statut mis à jour : ${getStatusLabel(status)}`);
  
  // Update related items and recalculate metrics
  // ...
};```

### Progressive disclosure

```javascript
<!-- From BoxContent.vue -->
<template>
  <div>
    <div v-if="expandedView">
      <BoxExpandedView ... />
    </div>
    <div v-else>
      <BoxCollapsedView ... />
    </div>
  </div>
</template>
```


# Inventaire GN - Technical and Functional Documentation (Part 6)

## Development Guidelines

### Adding New Components

1. **Maintain ADHD-Friendly Principles**:
   - Provide clear visual feedback
   - Follow established patterns
   - Keep the interface predictable

2. **Component Organization**:
   - Place components in the appropriate subdirectory
   - Follow the established naming conventions
   - Maintain the component hierarchy

3. **Composable Usage**:
   - Use existing composables for shared functionality
   - Create new composables for significant shared logic
   - Avoid duplicating business logic across components

### Adding New Features

1. **Status Types**:
   - Add new status to the STATUS enum in `useInventory.js`
   - Add corresponding class in the `getStatusClass` function
   - Add label in the `getStatusLabel` function
   - Update any filtering logic in `StatusFilter.vue`

2. **New Section Types**:
   - Update the inventory data structure in `initData.js`
   - Ensure compatibility with existing components

3. **UI Enhancements**:
   - Maintain consistent color schemes and patterns
   - Consider ADHD-friendly design principles

## Deployment

The application is built using Vite and can be deployed as a static website:

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

The built application will be in the dist directory and can be deployed to any static hosting service.

## Data persistance

All data is currently stored in the browser's LocalStorage. There is no backend server:

- Data is automatically saved after any change
- Data persists between browser sessions
- Data is device-specific and not shared across devices
- Import/export functionality allows for manual backup and sharing

## Future improvements

1. Backend Integration:

- Add a server for data persistence across devices
- Implement user accounts and sharing

2. Enhanced ADHD Support:
- Task timing aids
- Focus mode to reduce distractions
- Customizable organization

3. Additional Features:
- Barcode/QR code scanning for physical items
- Timeline view of inventory changes
- Team collaboration features

4. Technical Enhancements:
- Full TypeScript integration
- Automated testing
- Offline mode with synchronization

# Conclusion
Inventaire GN is a specialized tool designed with ADHD-friendly principles for managing LARP event inventory. Its component-based architecture, clear visual design, and focus on reducing cognitive load make it an effective tool for organizing complex inventory tasks. The recent refactoring has improved component organization and code maintainability, setting the foundation for future enhancements.