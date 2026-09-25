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
-   **Export/Import Data**:
    -   Securely download your current CV data as a JSON file.
    -   Import previously saved JSON files to restore your progress and continue editing.
-   **Smart Page Breaks**:
    -   **Section Level**: Force major sections (e.g., "Projects") to start on a new page.
    -   **Item Level**: Insert page breaks after specific items to avoid awkward splits.
    -   **Visual Indicators**: See exactly where page breaks occur in the preview (hidden during print).
-   **Responsive UI**: A modern, split-screen interface that adapts to tablets and mobile devices.

## Tech Stack

-   **Frontend**: React, CSS
-   **Build Tool**: Vite
-   **Hosting**: Netlify (Edge Functions + Functions + Blobs for the login gate, Resend for OTP email)
-   **Styling**: Custom CSS with responsive design

## Getting Started

### Prerequisites

-   Node.js (v14 or higher)
-   npm (v6 or higher)

### Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    cd cv-by-html
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

## Usage

### Running Locally

1. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser to `http://localhost:5173`.

### Running Locally with the Login Gate

`npm run dev` runs plain Vite with **no** login. To run the edge gate and the `/api/*` functions locally:

1. Copy `.env.example` to `.env` and fill in the values.
2. Start Netlify Dev (proxies Vite on `http://localhost:8888`):
   ```bash
   npm run dev:netlify
   ```

## Deployment (Netlify)

Production deploys automatically on every push to `master` — no manual deploy step.

### One-time setup

1. **Resend** — sign up at [resend.com](https://resend.com) with the email that should receive OTPs (without a verified domain, Resend only delivers to the account owner's address). Create an API key.
2. **Netlify** — *Add new site → Import an existing project → GitHub* → pick this repo. Set the production branch to `master`; build settings are read from `netlify.toml`.
3. **Environment variables** — in *Site configuration → Environment variables*, add every variable from `.env.example`:

   | Variable | Value |
   |---|---|
   | `AUTH_USERNAME` | The fixed username typed on the login page |
   | `AUTH_EMAIL` | Inbox that receives the OTP |
   | `RESEND_API_KEY` | Resend API key (mark as secret) |
   | `RESEND_FROM` | Sender, e.g. `CV Builder <onboarding@resend.dev>` |
   | `SESSION_SECRET` | Random string, `openssl rand -hex 32` (mark as secret) |

4. Trigger a deploy (or push to `master`). Changing env vars requires a redeploy.

### How the login works

- `netlify/edge-functions/auth-gate.js` runs on every request. Without a valid `cv_session` cookie, page loads redirect to `/login/` and every other file (JS bundle, images) returns 401.
- `/login/` asks for the username → `POST /api/request-otp` emails a 6-digit code (valid 5 minutes, one request per 60 s).
- `POST /api/verify-otp` checks the code (5 attempts max) and sets an HttpOnly session cookie valid for 7 days.
- The 🚪 button in the toolbar (`/api/logout`) clears the cookie.
- Rotating `SESSION_SECRET` signs out every session.

### Building Your CV

1.  **Personal Info**: Update your name, title, contact details, and upload your avatar.
2.  **Sections**: Fill in your Summary, Experience, Projects, etc.
    -   Use the **"Add"** buttons to create new entries.
    -   Use the **"Remove"** buttons to delete entries.
3.  **Page Layout**:
    -   Check **"Start on New Page"** next to a section header to push it to the next page.
    -   Check **"Page Break After"** inside an item to force a break after that specific entry.
4.  **Export/Import**:
    -   Click **"Export JSON"** to download your data for backup.
    -   Click **"Import JSON"** to load a saved file back into the editor.
5.  **Save as PDF**:
    -   Click the green **"Print / Save as PDF"** button.
    -   In the print dialog, choose **"Save as PDF"**.
    -   Ensure **"Background graphics"** is unchecked (unless you want to print the visual page break lines, which are hidden by default).

## Project Structure

-   `src/components/CVForm.jsx`: The input form for editing data.
-   `src/components/CVPreview.jsx`: The A4 preview component.
-   `src/App.jsx`: Main state management and layout.
-   `src/CVPreview.css`: Styles specific to the CV print layout.
-   `src/App.css`: Styles for the application UI.
-   `vite.config.js`: Vite configuration, including the custom avatar upload middleware.
-   `netlify.toml`: Netlify build, dev and redirect settings.
-   `netlify/edge-functions/auth-gate.js`: Blocks all requests without a session cookie.
-   `netlify/functions/`: `/api/request-otp`, `/api/verify-otp`, `/api/logout`.
-   `public/login/`: The login page (plain HTML/JS, served without the app bundle).

## Troubleshooting

### Login Issues

#### No OTP email arrives
- Check the function log in Netlify (*Logs → Functions → request-otp*). `Resend responded 403` usually means `AUTH_EMAIL` isn't the Resend account email and no domain is verified.
- A wrong username still shows the code step (by design, to avoid confirming usernames) — double-check `AUTH_USERNAME`.

#### Redirected back to `/login/` after entering the code
- `SESSION_SECRET` must be set for both functions and edge functions (scope "All" in Netlify env vars), then redeploy.

## License

[MIT](LICENSE)
