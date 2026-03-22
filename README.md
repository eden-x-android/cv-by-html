# CV Builder

A powerful, React-based application designed to help you build, preview, and export a professional CV with ease. This tool provides a real-time preview of your resume as you edit, ensuring it looks perfect for print or PDF export.

## Features

-   **Real-Time Preview**: See changes instantly as you type.
-   **Print-Ready Layout**: Optimized for A4 paper size with precise margins and styling.
-   **Dynamic Content**: Easily add, remove, or reorder Experience, Projects, Education, Skills, Tools, and Languages.
-   **Avatar Management**:
    -   Upload your profile picture directly within the app.
    -   Automatic validation ensures images are square.
    -   Auto-renaming prevents filename conflicts.
-   **Smart Page Breaks**:
    -   **Section Level**: Force major sections (e.g., "Projects") to start on a new page.
    -   **Item Level**: Insert page breaks after specific items to avoid awkward splits.
    -   **Visual Indicators**: See exactly where page breaks occur in the preview (hidden during print).
-   **Responsive UI**: A modern, split-screen interface that adapts to tablets and mobile devices.

## Tech Stack

-   **Frontend**: React, CSS
-   **Build Tool**: Vite
-   **Styling**: Custom CSS with responsive design

## Getting Started

### Prerequisites

-   Node.js (v14 or higher)
-   npm (v6 or higher)

### Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    cd cv-builder
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

## Usage

### Running the Application

Start the development server:

```bash
npm run dev
```

Open your browser and navigate to `http://localhost:5173`.

### Building Your CV

1.  **Personal Info**: Update your name, title, contact details, and upload your avatar.
2.  **Sections**: Fill in your Summary, Experience, Projects, etc.
    -   Use the **"Add"** buttons to create new entries.
    -   Use the **"Remove"** buttons to delete entries.
3.  **Page Layout**:
    -   Check **"Start on New Page"** next to a section header to push it to the next page.
    -   Check **"Page Break After"** inside an item to force a break after that specific entry.
4.  **Export**:
    -   Click the green **"Print / Save as PDF"** button.
    -   In the print dialog, choose **"Save as PDF"**.
    -   Ensure **"Background graphics"** is unchecked (unless you want to print the visual page break lines, which are hidden by default).

## Project Structure

-   `cv-builder/src/components/CVForm.jsx`: The input form for editing data.
-   `cv-builder/src/components/CVPreview.jsx`: The A4 preview component.
-   `cv-builder/src/App.jsx`: Main state management and layout.
-   `cv-builder/src/CVPreview.css`: Styles specific to the CV print layout.
-   `cv-builder/src/App.css`: Styles for the application UI.
-   `cv-builder/vite.config.js`: Vite configuration, including the custom avatar upload middleware.

## Troubleshooting

### Firebase Deployment Issues

#### Error: Cannot find module 'vite' (During `firebase init`)
**Cause:** Firebase CLI attempts to auto-detect Vite but the `node_modules` directory is missing.
**Solution:** Ensure you install dependencies before initializing Firebase:
```bash
npm install
firebase init
```

#### HTTP Error: 500, Internal error encountered (During `firebase deploy`)
**Cause:** This is an internal error on Google's Firebase servers, not an error with your code.
**Solution:** 
1. **Wait and Retry:** Often, this is a temporary hiccup. Wait a few minutes and run `firebase deploy` again.
2. **Accept Terms:** If this is a new Firebase project, open the [Firebase Console](https://console.firebase.google.com/), select your project, and check if you need to accept any Terms of Service.
3. **Re-authenticate:** Refresh your CLI access tokens by running:
   ```bash
   firebase logout
   firebase login
   ```

## License

[MIT](LICENSE)
