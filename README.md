# İnşaat Kalıp Yerleştirme - Construction Panel Placement Tool

## Overview

This is a Turkish construction panel placement optimization tool that helps construction professionals efficiently arrange form panels (kalıp panelleri) within designated construction areas. The application calculates optimal panel positioning using bin packing algorithms and provides visual feedback through canvas-based diagrams. Users can input panel dimensions, specify construction area constraints, and receive placement recommendations with efficiency metrics and exportable visualizations.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Single Page Application (SPA)**: Built entirely with vanilla HTML, CSS, and JavaScript without framework dependencies for maximum portability and minimal overhead
- **Class-based JavaScript Architecture**: Uses ES6 class structure (`PanelPlacementApp`) to encapsulate state management, DOM manipulation, and business logic
- **Canvas-based Visualization System**: Leverages HTML5 Canvas API for real-time rendering of panel placements with color-coded visual feedback
- **Responsive CSS Grid Layout**: Mobile-first design using CSS Grid and Flexbox for adaptive user interface across devices
- **Client-side Data Persistence**: Browser localStorage implementation for maintaining panel configurations between user sessions

### Core Algorithm Components
- **Bin Packing Algorithm**: Implements optimal panel placement calculations to maximize area utilization within construction site constraints
- **Panel Management System**: Handles dynamic addition, removal, and validation of panel dimensions with real-time UI updates
- **Placement Optimization Engine**: Calculates efficiency metrics, remaining area calculations, and placement feasibility analysis
- **Visual Rendering Engine**: Canvas-based drawing system with predefined color palette for panel differentiation and area representation

### User Interface Patterns
- **Progressive Workflow Design**: Step-by-step interface guiding users from panel input through area specification to calculation results
- **Real-time Validation System**: Immediate feedback for input validation and constraint checking
- **Toast Notification Framework**: Non-intrusive user feedback system for actions, errors, and success states
- **Empty State Management**: Clear messaging and visual cues when no data is present in each application section

### Data Management
- **In-memory State Management**: JavaScript arrays maintaining panel definitions and placement results
- **Color Assignment System**: Automatic color allocation from predefined palette for visual panel identification
- **Export Functionality**: Canvas-to-image conversion enabling users to save placement diagrams for documentation

## External Dependencies

### CDN Resources
- **Font Awesome 6.0.0**: Icon library providing construction-themed UI elements and visual enhancement (`https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css`)

### Browser APIs
- **HTML5 Canvas API**: Core rendering and drawing functionality for visualization components
- **Web Storage API (localStorage)**: Client-side data persistence for panel configurations
- **File API**: Canvas export capabilities for saving placement diagrams as downloadable images

### Architecture Benefits
- **Zero Server Dependencies**: Complete client-side operation eliminates hosting requirements and enables offline functionality
- **Framework Independence**: Vanilla JavaScript approach ensures long-term maintainability and minimal technical debt
- **Mobile Compatibility**: Responsive design patterns support field use on construction sites via mobile devices
