# Careless-Canvas-NML v1.0.0-rc.1 Release Notes

## Release Candidate 1 - January 4, 2025

### Overview
This is the first release candidate for Careless-Canvas-NML, an interactive canvas application for creating and managing NML (Node Markup Language) documents.

### Features
- **Interactive Canvas**: Drag-and-drop interface for creating and organizing content pages
- **NML v2.0 Support**: Full import/export support for NML format specification
- **Page Management**: Create, edit, and connect pages with various relationship types
- **Visual Connections**: Connect pages with typed relationships (explores, leads-to, relates, contradicts, supports, questions)
- **Multiple Page Colors**: Organize content with color-coded pages (red, blue, green, yellow, purple, gray)
- **State Management**: Robust state management with Zustand
- **Responsive Design**: Clean, modern interface with Tailwind CSS

### Technical Specifications
- **Framework**: React 19.1.1 with TypeScript
- **Build Tool**: Create React App with React Scripts 5.0.1
- **Canvas Library**: @xyflow/react 12.8.4
- **State Management**: Zustand 5.0.8
- **Styling**: Tailwind CSS (via index.css)
- **Markdown Support**: react-markdown 10.1.0

### Build Information
- **Bundle Size**: 164.57 kB (gzipped)
- **CSS Size**: 3.97 kB (gzipped)
- **Chunk Size**: 1.77 kB (gzipped)
- **Production Ready**: Optimized build with code splitting

### Installation & Deployment
This is a static React application that can be deployed to any web server or CDN.

**Requirements:**
- Modern web browser with JavaScript enabled
- Static file server (Apache, Nginx, CDN, etc.)

**Deployment:**
1. Extract the build folder contents to your web server
2. Serve the files with a static file server
3. Ensure the server is configured to serve `index.html` for client-side routing

### Known Limitations
- Development dependencies contain some security vulnerabilities (webpack-dev-server, @svgr/webpack) - these do not affect the production build
- File uploads are handled via browser file picker
- No server-side storage (files are downloaded to user's device)

### Next Steps
- Address development dependency vulnerabilities
- Add more export formats
- Implement additional page layouts
- Enhanced keyboard shortcuts

### Support
For issues and feedback, please refer to the project documentation.

---
**Build Date**: January 4, 2025  
**Version**: 1.0.0-rc.1  
**Build Hash**: 33f4b4d8
