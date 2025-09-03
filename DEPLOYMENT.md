# Careless-Canvas-NML Deployment Guide

## Production Build v1.0.0-rc.1

### Quick Start
The `build` folder contains the complete production-ready application. Simply serve the contents with any static web server.

### Deployment Options

#### Option 1: Static File Server
```bash
# Using Node.js serve package
npx serve -s build -p 3000

# Using Python's built-in server (Python 3)
cd build
python -m http.server 3000

# Using PHP's built-in server
cd build
php -S localhost:3000
```

#### Option 2: Web Server Configuration

**Apache (.htaccess)**
```apache
Options -MultiViews
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^ index.html [QR,L]
```

**Nginx**
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/build;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Optional: Enable gzip compression
    gzip on;
    gzip_types text/css application/javascript application/json;
}
```

#### Option 3: CDN/Cloud Hosting

**Netlify**
1. Drag and drop the `build` folder to Netlify
2. Configure redirects: `/* /index.html 200`

**Vercel**
1. Deploy the `build` folder
2. No additional configuration needed

**AWS S3 + CloudFront**
1. Upload `build` contents to S3 bucket
2. Configure bucket for static website hosting
3. Set error document to `index.html`
4. Add CloudFront distribution for global CDN

**GitHub Pages**
1. Copy `build` contents to repository
2. Enable GitHub Pages in repository settings
3. Set source to main branch

### Build Contents
```
build/
├── static/
│   ├── css/
│   │   ├── main.e24330ae.css       # Main styles (3.97 kB)
│   │   └── main.e24330ae.css.map   # Source map
│   └── js/
│       ├── main.33f4b4d8.js        # Main bundle (164.57 kB)
│       ├── main.33f4b4d8.js.map    # Source map
│       ├── main.33f4b4d8.js.LICENSE.txt
│       ├── 453.aa9d3931.chunk.js   # Vendor chunk (1.77 kB)
│       └── 453.aa9d3931.chunk.js.map
├── index.html                      # Main entry point
├── favicon.ico                     # App icon
├── logo192.png                     # PWA icon (192x192)
├── logo512.png                     # PWA icon (512x512)
├── manifest.json                   # PWA manifest
├── robots.txt                      # Search engine directives
└── asset-manifest.json             # Build metadata
```

### Environment Variables
No environment variables are required for the production build. All configuration is built into the static files.

### Performance Optimizations
- **Code Splitting**: Vendor libraries are split into separate chunks
- **Compression**: Enable gzip/brotli compression on your server
- **Caching**: Set appropriate cache headers for static assets
  ```
  /static/css/* - Cache for 1 year
  /static/js/*  - Cache for 1 year
  index.html    - No cache or short cache (5 minutes)
  ```

### Browser Compatibility
- Chrome (last 1 version)
- Firefox (last 1 version) 
- Safari (last 1 version)
- Edge (Chromium-based)
- Internet Explorer: Not supported

### Security Considerations
- Serve over HTTPS in production
- Set appropriate Content Security Policy headers
- The app runs entirely client-side - no server-side processing required

### Health Check
After deployment, verify the application by:
1. Loading the main page
2. Creating a test page with Ctrl+V
3. Saving an NML file
4. Loading the saved file
5. Checking the browser console for errors

### Troubleshooting
- **Blank Page**: Ensure `index.html` is served for all routes
- **Asset Loading Errors**: Check that static files are accessible
- **CORS Errors**: Ensure proper server configuration for file uploads
- **Cache Issues**: Clear browser cache or use hard refresh (Ctrl+F5)

### Build Information
- **Build Date**: January 4, 2025
- **Version**: 1.0.0-rc.1
- **Node Version**: Compatible with Node.js 16+
- **Build Tool**: Create React App
- **Bundle Analyzer**: Use `npm install --save-dev webpack-bundle-analyzer` for detailed analysis

---
For technical support, refer to the RELEASE-NOTES.md file or project documentation.
