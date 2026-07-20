import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        {
            name: 'avatar-upload-server',
            configureServer(server) {
                server.middlewares.use('/api/upload-avatar', (req, res, next) => {
                    if (req.method === 'POST') {
                        let body = '';
                        req.on('data', chunk => {
                            body += chunk.toString();
                        });
                        req.on('end', () => {
                            try {
                                const { image, filename } = JSON.parse(body);
                                // Remove header "data:image/jpeg;base64,"
                                const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
                                const buffer = Buffer.from(base64Data, 'base64');

                                // Save to public/images
                                const targetPath = path.join(__dirname, 'public', 'images', filename);
                                console.log('Saving image to:', targetPath);
                                fs.writeFileSync(targetPath, buffer);
                                console.log('Image saved successfully');

                                res.setHeader('Content-Type', 'application/json');
                                res.end(JSON.stringify({ success: true, path: `/images/${filename}` }));
                            } catch (err) {
                                console.error('Error saving image:', err);
                                res.statusCode = 500;
                                res.end(JSON.stringify({ error: err.message }));
                            }
                        });
                    } else {
                        next();
                    }
                });
            }
        }
    ],
})
