# Project File Structure Analysis

## Audio Forge - Voice Cloning Platform

This document provides a comprehensive overview of the project's file structure, with importance indicators and dependency relationships.

### Legend
- 🟢 **High Importance**: Core application files, frequently imported
- 🟡 **Medium Importance**: Supporting files, occasionally imported  
- 🔴 **Low Importance**: Configuration or utility files, rarely imported directly

---

## Root Level Files

```
audio-replicate-forge/
├── .gitignore                    🔴 Git ignore rules for build artifacts and env files
├── README.md                     🟡 Basic project documentation and setup instructions
├── components.json               🟡 shadcn/ui configuration for component installation
├── eslint.config.js             🔴 ESLint configuration for code quality and style
├── index.html                    🟢 Main HTML entry point, loads React application
├── package.json                  🟢 Project dependencies, scripts, and metadata
├── package-lock.json             🔴 Locked dependency versions (auto-generated)
├── postcss.config.js             🔴 PostCSS configuration for Tailwind CSS processing
├── tailwind.config.ts            🟢 Tailwind CSS configuration with custom theme
├── tsconfig.json                 🔴 TypeScript compiler configuration (root)
├── tsconfig.app.json             🔴 TypeScript configuration for application code
├── tsconfig.node.json            🔴 TypeScript configuration for Node.js scripts
└── vite.config.ts                🟡 Vite bundler configuration with path aliases
```

---

## Source Code Structure

```
src/
├── main.tsx                      🟢 React application entry point and root rendering
├── vite-env.d.ts                 🔴 Vite environment type definitions
├── index.css                     🟢 Global styles and cyberpunk design system tokens
├── App.tsx                       🟢 Main app component with routing and providers
├── App.css                       🔴 Additional app-specific styles (minimal usage)
│
├── components/                   📁 Reusable UI components
│   ├── AudioVisualizer.tsx       🟢 Real-time audio waveform visualization component
│   ├── TextToSpeech.tsx          🟢 Text-to-speech synthesis interface
│   ├── VoiceCloner.tsx           🟢 Voice cloning upload and processing interface
│   │
│   └── ui/                       📁 shadcn/ui component library
│       ├── accordion.tsx          🟡 Collapsible content sections
│       ├── alert-dialog.tsx       🟡 Modal dialog for alerts and confirmations
│       ├── alert.tsx              🟡 Inline alert messages and notifications
│       ├── aspect-ratio.tsx       🔴 Responsive aspect ratio container
│       ├── avatar.tsx             🔴 User profile image component
│       ├── badge.tsx              🔴 Small status or category indicators
│       ├── breadcrumb.tsx         🔴 Navigation breadcrumb trail
│       ├── button.tsx             🟢 Primary interactive button component
│       ├── calendar.tsx           🔴 Date picker and calendar interface
│       ├── card.tsx               🟢 Content container with styling
│       ├── carousel.tsx           🔴 Image/content slideshow component
│       ├── chart.tsx              🔴 Data visualization charts
│       ├── checkbox.tsx           🟡 Form checkbox input
│       ├── collapsible.tsx        🔴 Expandable content sections
│       ├── command.tsx            🔴 Command palette and search interface
│       ├── context-menu.tsx       🔴 Right-click context menu
│       ├── dialog.tsx             🟡 Modal dialog component
│       ├── drawer.tsx             🔴 Slide-out drawer panel
│       ├── dropdown-menu.tsx      🔴 Dropdown menu component
│       ├── form.tsx               🟡 Form field wrapper and validation
│       ├── hover-card.tsx         🔴 Hover-triggered content card
│       ├── input.tsx              🟢 Text input form field
│       ├── input-otp.tsx          🔴 One-time password input
│       ├── label.tsx              🟡 Form field labels
│       ├── menubar.tsx            🔴 Application menu bar
│       ├── navigation-menu.tsx    🔴 Site navigation menu
│       ├── pagination.tsx         🔴 Page navigation controls
│       ├── popover.tsx            🔴 Floating content popover
│       ├── progress.tsx           🟡 Progress bar indicator
│       ├── radio-group.tsx        🔴 Radio button group
│       ├── resizable.tsx          🔴 Resizable panel container
│       ├── scroll-area.tsx        🔴 Custom scrollable container
│       ├── select.tsx             🟡 Dropdown select input
│       ├── separator.tsx          🔴 Visual content divider
│       ├── sheet.tsx              🔴 Side panel overlay
│       ├── sidebar.tsx            🔴 Navigation sidebar
│       ├── skeleton.tsx           🟡 Loading placeholder component
│       ├── slider.tsx             🔴 Range slider input
│       ├── sonner.tsx             🟡 Toast notification system
│       ├── switch.tsx             🔴 Toggle switch input
│       ├── table.tsx              🔴 Data table component
│       ├── tabs.tsx               🟡 Tab navigation interface
│       ├── textarea.tsx           🟢 Multi-line text input
│       ├── toast.tsx              🟡 Toast notification component
│       ├── toaster.tsx            🟡 Toast notification provider
│       ├── toggle.tsx             🔴 Toggle button component
│       ├── toggle-group.tsx       🔴 Group of toggle buttons
│       ├── tooltip.tsx            🔴 Hover tooltip component
│       └── use-toast.ts           🟡 Toast hook re-export
│
├── hooks/                        📁 Custom React hooks
│   ├── use-mobile.tsx             🔴 Mobile device detection hook
│   ├── use-toast.ts               🟡 Toast notification management
│   └── useClonedVoices.ts         🟢 Voice cloning data fetching and caching
│
├── integrations/                 📁 External service integrations
│   └── supabase/
│       ├── client.ts              🟢 Supabase client configuration and setup
│       └── types.ts               🟡 Generated database type definitions
│
├── lib/                          📁 Utility libraries
│   └── utils.ts                   🟢 Utility functions (cn for className merging)
│
└── pages/                        📁 Application pages/routes
    ├── Index.tsx                  🟢 Landing page with voice cloning interface
    └── NotFound.tsx               🔴 404 error page component
```

---

## Backend Structure

```
supabase/
├── config.toml                   🟡 Supabase project configuration
└── functions/                    📁 Edge functions
    └── voice-clone/
        └── index.ts               🟢 Voice cloning API endpoint
```

---

## Public Assets

```
public/
├── robots.txt                    🔴 Search engine crawler instructions
└── placeholder.svg               🔴 Default placeholder image
```

---

## Key Dependencies and Relationships

### Core Application Flow
```
main.tsx → App.tsx → Index.tsx → [VoiceCloner.tsx, TextToSpeech.tsx, AudioVisualizer.tsx]
```

### Component Dependencies
- **VoiceCloner.tsx**: Uses `useClonedVoices` hook, Button, Card, Input components
- **TextToSpeech.tsx**: Uses Button, Card, Textarea, Select components  
- **AudioVisualizer.tsx**: Standalone component for waveform visualization
- **Index.tsx**: Orchestrates all main components and layout

### State Management
- **React Query**: Used in `useClonedVoices.ts` for server state management
- **Supabase**: Database integration through `client.ts`
- **Local State**: Component-level state with React hooks

### Styling Architecture
- **Design System**: Defined in `index.css` with cyberpunk theme tokens
- **Tailwind Config**: Extended in `tailwind.config.ts` with custom colors
- **Component Styles**: Applied through shadcn/ui components and custom classes

### Build Process
```
vite.config.ts → tailwind.config.ts → index.css → Component Styles
```

---

## Import Frequency Analysis

### Most Imported Files (🟢 High Usage)
1. `@/components/ui/button` - Used across all interactive components
2. `@/components/ui/card` - Primary layout component
3. `@/lib/utils` - Utility functions used throughout
4. `@/hooks/use-toast` - Notification system
5. `@/integrations/supabase/client` - Database operations

### Moderately Imported Files (🟡 Medium Usage)
1. `@/components/ui/input` - Form components
2. `@/components/ui/textarea` - Text input areas  
3. `@/components/ui/dialog` - Modal interactions
4. `@/hooks/useClonedVoices` - Voice data management

### Rarely Imported Files (🔴 Low Usage)
- Configuration files (tsconfig, eslint, etc.)
- Specialized UI components (calendar, charts, etc.)
- Utility components (skeleton, avatar, etc.)