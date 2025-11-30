# CV by HTML

A professional CV/Resume project featuring both a static HTML version and an interactive React-based CV builder application.

## 📋 Project Overview

This repository contains two implementations of a professional CV:

1. **Static HTML CV** - A clean, print-ready CV built with pure HTML and CSS
2. **CV Builder App** - An interactive React application for creating and customizing CVs with live preview

## 🚀 Features

### Static HTML CV
- **Print-optimized** - Configured for A4 paper size with proper margins
- **Custom typography** - Uses BergenText, WorkSans, and AndaleMono fonts
- **Responsive design** - Adapts to different screen sizes
- **Professional styling** - Clean, modern design with custom color scheme
- **Sections included**:
  - Personal information with avatar
  - Professional summary
  - Work experience
  - Projects portfolio
  - Education
  - Skills & Tools
  - Languages

### CV Builder App
- **Live preview** - See changes in real-time as you edit
- **Interactive form** - Easy-to-use interface for editing CV content
- **Print/PDF export** - Generate PDF directly from the browser
- **Customizable sections** - Toggle visibility of different CV sections
- **Modern tech stack** - Built with React 19 and Vite

## 📁 Project Structure

```
cv-by-html/
├── cv.html              # Static HTML CV
├── style.css            # Styles for static CV
├── fonts/               # Custom font files
│   ├── BergenText-Regular.otf
│   ├── BergenText-SemiBold.otf
│   ├── WorkSans-Light.ttf
│   ├── WorkSans-SemiBold.ttf
│   ├── AndaleMono-Regular.ttf
│   └── AndaleMono-Bold.otf
├── images/              # Icons and avatar
└── cv-builder/          # React CV builder application
    ├── src/
    │   ├── App.jsx
    │   ├── components/
    │   │   ├── CVForm.jsx
    │   │   └── CVPreview.jsx
    │   └── ...
    ├── package.json
    └── vite.config.js
```

## 🛠️ Getting Started

### Static HTML CV

Simply open `cv.html` in your web browser:

```bash
# Option 1: Direct file open
open cv.html

# Option 2: Using a local server (recommended)
python -m http.server 8000
# Then navigate to http://localhost:8000/cv.html
```

To print or save as PDF:
1. Open `cv.html` in your browser
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

## 🎨 Customization

### Static HTML CV

Edit `cv.html` to update your personal information, experience, projects, etc.
Modify `style.css` to change colors, fonts, and layout.

### CV Builder App

The CV data is stored in the component state in `src/App.jsx`. You can:
- Edit default values in the initial state
- Modify the form fields in `src/components/CVForm.jsx`
- Customize the preview layout in `src/components/CVPreview.jsx`

## 🎯 Color Scheme

The project uses a professional color palette defined in CSS variables:

- **Primary Blue**: `#017BFE`
- **Semi Black**: `#334155`
- **Gray**: `#7B7B7B`
- **Geyser**: `#CBD5E1`
- **Catskill White**: `#f1f5f9`
