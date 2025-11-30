# CV by HTML

A professional CV/Resume project featuring both a static HTML version and an interactive React-based CV builder application with **synchronized data and styles**.

## 📋 Project Overview

This repository contains two implementations of a professional CV that **share the same data source and CSS styles**:

1. **Static HTML CV** - A clean, print-ready CV that loads data from JSON
2. **CV Builder App** - An interactive React application for editing and customizing CVs with live preview

**Key Feature**: Both versions use `cv-data.json` as the single source of truth, ensuring changes made in the CV builder automatically appear in the static HTML version.

## 🚀 Features

### Shared Features
- **Synchronized data** - Both versions read from the same `cv-data.json` file
- **Consistent styling** - Shared CSS ensures identical appearance
- **Print-optimized** - Configured for A4 paper size with proper margins
- **Custom typography** - Uses BergenText, WorkSans, and AndaleMono fonts
- **Professional design** - Clean, modern aesthetic with custom color scheme

### Static HTML CV
- **Dynamic data loading** - Fetches content from JSON file
- **Responsive design** - Adapts to different screen sizes
- **Requires local server** - Must be served via HTTP (not file://)

### CV Builder App
- **Live preview** - See changes in real-time as you edit
- **Interactive form** - Easy-to-use interface for editing CV content
- **Data persistence** - Save changes back to JSON file
- **Print/PDF export** - Generate PDF directly from the browser
- **Customizable sections** - Toggle visibility and page breaks

## 📁 Project Structure

```
cv-by-html/
├── cv-data.json         # 🔄 SHARED: Single source of truth for CV data
├── cv.html              # Static HTML CV (loads from cv-data.json)
├── style.css            # 🔄 SHARED: Main stylesheet
├── server.py            # Simple HTTP server for static CV
├── fonts/               # 🔄 SHARED: Custom font files
├── images/              # 🔄 SHARED: Icons and avatar
└── cv-builder/          # React CV builder application
    ├── src/
    │   ├── App.jsx      # Main app with data loading/saving
    │   ├── components/
    │   │   ├── CVForm.jsx
    │   │   └── CVPreview.jsx
    │   └── CVPreview.css # CV preview styles (imports shared fonts)
    ├── public/
    │   ├── fonts/       # Copy of shared fonts
    │   ├── images/      # Copy of shared images
    │   └── style.css    # Copy of shared styles
    ├── package.json
    └── vite.config.js   # API endpoints for data persistence
```

## 🛠️ Getting Started

### Static HTML CV

The static HTML CV requires a local server to load the JSON data. Use the provided server script:

```bash
# Start the server
python3 server.py

# Then open in your browser:
# http://localhost:8000/cv.html
```

To print or save as PDF:
1. Open `cv.html` in your browser (via the server)
2. Press `Cmd+P` (Mac) or `Ctrl+P` (Windows/Linux)
3. Select "Save as PDF" as the destination

### CV Builder App

Navigate to the cv-builder directory and install dependencies:

```bash
cd cv-builder
npm install
```

Run the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or another port if 5173 is in use).

## 📦 Available Scripts (CV Builder)

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## 🔄 How Synchronization Works

1. **Single Data Source**: `cv-data.json` contains all CV content
2. **CV Builder**: 
   - Loads data from `/api/load-cv` endpoint on startup
   - Saves changes to `/api/save-cv` endpoint (updates `cv-data.json`)
3. **Static HTML**: 
   - Fetches data from `cv-data.json` on page load
   - Dynamically renders content using JavaScript
4. **Workflow**:
   - Edit CV in the builder app → Click "Save Changes"
   - Refresh static HTML → See updated content

## 🎨 Customization

### Editing CV Content

**Recommended**: Use the CV Builder app for the best editing experience.

1. Start the CV builder: `cd cv-builder && npm run dev`
2. Edit your information in the form
3. Click "Save Changes" to persist to `cv-data.json`
4. Changes automatically appear in both versions

**Alternative**: Directly edit `cv-data.json` (requires manual JSON editing)

### Customizing Styles

Edit `style.css` to change colors, fonts, and layout. The changes will apply to both versions.

**Important**: After editing `style.css`, copy it to the cv-builder:
```bash
cp style.css cv-builder/public/
```

Similarly, if you update fonts or images:
```bash
cp -r fonts images cv-builder/public/
```

## 🎯 Color Scheme

The project uses a professional color palette defined in CSS variables:

- **Primary Blue**: `#017BFE`
- **Semi Black**: `#334155`
- **Gray**: `#7B7B7B`
- **Geyser**: `#CBD5E1`
- **Catskill White**: `#f1f5f9`
