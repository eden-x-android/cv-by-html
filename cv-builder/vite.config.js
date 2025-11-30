import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import fs from 'fs'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'configure-server',
      configureServer(server) {
        // API endpoint to save CV data
        server.middlewares.use('/api/save-cv', async (req, res, next) => {
          if (req.method === 'POST') {
            let body = '';
            req.on('data', chunk => {
              body += chunk.toString();
            });
            req.on('end', () => {
              try {
                const cvData = JSON.parse(body);
                const cvDataPath = path.resolve(__dirname, '../cv-data.json');
                fs.writeFileSync(cvDataPath, JSON.stringify(cvData, null, 2));
                
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, message: 'CV data saved successfully' }));
              } catch (err) {
                console.error('Save error:', err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: err.message }));
              }
            });
          } else {
            next();
          }
        });

        // API endpoint to load CV data
        server.middlewares.use('/api/load-cv', async (req, res, next) => {
          if (req.method === 'GET') {
            try {
              const cvDataPath = path.resolve(__dirname, '../cv-data.json');
              const cvData = fs.readFileSync(cvDataPath, 'utf-8');
              
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(cvData);
            } catch (err) {
              console.error('Load error:', err);
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ success: false, error: err.message }));
            }
          } else {
            next();
          }
        });

        // API endpoint to upload avatar
        server.middlewares.use('/api/upload-avatar', async (req, res, next) => {
          if (req.method === 'POST') {
            let body = '';
            req.on('data', chunk => {
              body += chunk.toString();
            });
            req.on('end', () => {
              try {
                const { image, filename } = JSON.parse(body);
                const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
                const buffer = Buffer.from(base64Data, 'base64');

                // Save to public/images directory (parent directory)
                const imagesDir = path.resolve(__dirname, '../images');
                if (!fs.existsSync(imagesDir)) {
                  fs.mkdirSync(imagesDir, { recursive: true });
                }

                const filePath = path.join(imagesDir, filename);
                fs.writeFileSync(filePath, buffer);

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, path: `/images/${filename}` }));
              } catch (err) {
                console.error('Upload error:', err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: err.message }));
              }
            });
          } else {
            next();
          }
        });
      }
    }
  ],
  publicDir: 'public',
  server: {
    fs: {
      allow: ['..']
    }
  }
});
