# Careless-Canvas-NML v1.0.0-rc.1 Distribution Package

## What's Included

This distribution package contains the complete production build of Careless-Canvas-NML, ready for deployment.

### Package Contents
- `build/` - Complete production build (deploy this folder)
- `RELEASE-NOTES.md` - Detailed release information and features
- `DEPLOYMENT.md` - Comprehensive deployment guide
- `README-DISTRIBUTION.md` - This file

### Quick Deployment
1. **Extract** the `build` folder to your web server
2. **Serve** the files with any static web server
3. **Test** by opening `index.html` in a browser

### Minimum Server Setup
```bash
# Using Node.js (if available)
npx serve -s build -p 3000

# Using Python 3
cd build && python -m http.server 3000

# Access at: http://localhost:3000
```

### Application Features
- Interactive NML document canvas
- Drag-and-drop page creation
- Visual connection system
- Import/Export NML v2.0 files
- Responsive design
- No backend required

### System Requirements
- **Browser**: Modern browser with JavaScript enabled
- **Server**: Any static file server (Apache, Nginx, CDN)
- **Storage**: ~170 kB total bundle size

### Support Files
- **RELEASE-NOTES.md**: Complete feature list and technical specs
- **DEPLOYMENT.md**: Detailed deployment options and configurations

### Version Information
- **Release**: v1.0.0-rc.1 (Release Candidate 1)
- **Build Date**: January 4, 2025
- **Bundle Size**: 164.57 kB (gzipped)
- **Framework**: React 19.1.1 with TypeScript

### Next Steps
1. Read `DEPLOYMENT.md` for detailed setup instructions
2. Deploy the `build` folder contents to your server
3. Configure your server for single-page application routing
4. Test the application functionality

---
**Careless-Canvas-NML** - Interactive canvas for creating and managing NML documents  
**License**: Private/Proprietary  
**Build**: Production-ready static files
