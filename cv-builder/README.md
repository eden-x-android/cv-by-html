# CV Builder

An interactive React-based CV builder application with live preview and data persistence. Part of the synchronized CV system that shares data with the static HTML version.

## Features

- **Live Preview** - See your CV update in real-time as you edit
- **Data Persistence** - Save changes to shared `cv-data.json` file
- **Interactive Forms** - Easy-to-use interface for all CV sections
- **Print/PDF Export** - Generate PDF directly from browser
- **Synchronized Data** - Changes sync with static HTML CV
- **Page Break Control** - Customize pagination for printing
- **Avatar Upload** - Upload and manage your profile picture

## Tech Stack

- **React 19** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **Custom API** - Built-in endpoints for data persistence
- **CSS Variables** - Consistent styling with shared design system

## Getting Started

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173` (or another port if 5173 is in use).

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## How It Works

### Data Synchronization

The CV builder uses a shared `cv-data.json` file located in the parent directory:

1. **On Load**: Fetches data from `/api/load-cv` endpoint
2. **On Save**: Posts data to `/api/save-cv` endpoint
3. **Shared Source**: Both this app and the static HTML CV read from the same JSON file

### API Endpoints

Configured in `vite.config.js`:

- `GET /api/load-cv` - Load CV data from JSON file
- `POST /api/save-cv` - Save CV data to JSON file  
- `POST /api/upload-avatar` - Upload avatar image

### Workflow

1. Edit your CV using the form on the left
2. See live preview on the right
3. Click "Save Changes" to persist to `cv-data.json`
4. Changes automatically appear in static HTML version after refresh

## Project Structure

```
cv-builder/
├── src/
│   ├── App.jsx           # Main app with data loading/saving
│   ├── App.css           # App layout and UI styles
│   ├── components/
│   │   ├── CVForm.jsx    # Interactive form for editing
│   │   └── CVPreview.jsx # Live CV preview
│   ├── CVPreview.css     # CV styling (matches static HTML)
│   └── main.jsx          # Entry point
├── public/
│   ├── fonts/            # Shared custom fonts
│   ├── images/           # Shared icons and images
│   └── style.css         # Shared base styles
├── vite.config.js        # Vite config with API endpoints
└── package.json
```

## Customization

### Editing CV Content

Use the interactive form to edit all sections:
- Personal Information
- Summary
- Social Links
- Work Experience
- Projects
- Education
- Skills
- Tools
- Languages

### Styling

The CV preview uses shared styles from:
- `public/style.css` - Base styles (copied from parent)
- `src/CVPreview.css` - CV-specific styles with fonts and variables
- `src/App.css` - App layout and form styles

### Adding New Sections

1. Update the data structure in `cv-data.json`
2. Add form fields in `CVForm.jsx`
3. Add preview rendering in `CVPreview.jsx`
4. Update the static HTML template if needed

## Print/PDF Export

Click the "Print / Save as PDF" button to:
1. Open browser print dialog
2. Select "Save as PDF" as destination
3. Adjust settings if needed
4. Save your professional CV

## Synchronization with Static HTML

This app shares data with the static HTML CV in the parent directory:

```
Parent Directory/
├── cv-data.json          # ← Shared data source
├── cv.html               # Static HTML version
├── style.css             # Shared styles
└── cv-builder/           # This React app
```

**To see changes in static HTML:**
1. Make edits in this CV builder
2. Click "Save Changes"
3. Run `python3 server.py` in parent directory
4. Open `http://localhost:8000/cv.html`
5. Your changes will be reflected!

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Hot Module Replacement

Vite provides fast HMR for instant feedback during development. Changes to components update immediately without full page reload.

## Troubleshooting

**Data not loading?**
- Check that `../cv-data.json` exists in parent directory
- Verify the dev server is running
- Check browser console for errors

**Save not working?**
- Ensure you have write permissions to parent directory
- Check that `cv-data.json` is not read-only
- Verify API endpoints in `vite.config.js`

**Styles not matching static HTML?**
- Ensure fonts and images are copied to `public/` directory
- Run: `cp -r ../fonts ../images ../style.css public/`
- Restart dev server after copying files

## License

Part of the CV by HTML project. Free for personal and commercial use.
