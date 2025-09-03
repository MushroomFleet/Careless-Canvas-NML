# Careless-Canvas-NML

An interactive canvas application for creating, editing, and managing NML (Nested Markup Language) documents with a visual drag-and-drop interface.

![Version](https://img.shields.io/badge/version-1.0.0--rc.1-blue)
![React](https://img.shields.io/badge/React-19.1.1-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-4.9.5-3178c6)
![License](https://img.shields.io/badge/license-Proprietary-red)

## 🎯 What is Careless-Canvas-NML?

Careless-Canvas-NML is a modern web application that provides an intuitive visual interface for working with NML (Nested Markup Language) documents. It transforms the traditional text-based approach to NML into an interactive canvas where users can create, organize, and connect content pages visually.

Built on the [NML v2.0 specification](https://github.com/MushroomFleet/NML--Nested-Markup-Language), this application bridges the gap between structured document creation and visual thinking, making it easy to build complex, interconnected content systems.

## ✨ What It Does

### Core Features
- **🎨 Interactive Canvas**: Drag-and-drop interface for creating and organizing content pages
- **📄 Dynamic Page Creation**: Paste content (Ctrl+V) to instantly create new pages
- **🔗 Visual Connections**: Connect pages with typed relationships (explores, leads-to, relates, contradicts, supports, questions)
- **🎨 Color-Coded Organization**: Organize content with color-coded pages (red, blue, green, yellow, purple, gray)
- **💾 NML v2.0 Support**: Full import/export support for NML format specification
- **📱 Responsive Design**: Clean, modern interface that works on desktop and mobile
- **⚡ Real-time Updates**: Immediate visual feedback for all interactions

### Use Cases
- **Knowledge Management**: Build interconnected knowledge bases
- **Content Planning**: Organize complex content structures visually
- **Documentation**: Create linked documentation systems
- **Research**: Map relationships between concepts and ideas
- **Storytelling**: Plan narrative structures with branching paths

## 🛠 Installation

### Prerequisites
- **Node.js** (version 16 or higher)
- **npm** (comes with Node.js)

### Quick Start
1. **Clone or download** the project
2. **Navigate** to the project directory:
   ```bash
   cd canvas-app-simple
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Start the development server**:
   ```bash
   npm start
   ```
5. **Open your browser** to `http://localhost:3000`

### Production Build
To create a production build:
```bash
npm run build
```
This creates a `build` folder with optimized static files ready for deployment.

## 🚀 How to Use

### Getting Started
1. **Launch the application** - Open in your web browser
2. **Create your first page** - Press `Ctrl+V` to paste content and create a new page
3. **Organize visually** - Drag pages around the canvas to arrange them
4. **Connect pages** - Drag from one page to another to create relationships
5. **Save your work** - Click "Save" to download your NML document

### Page Management
- **Create Pages**: Press `Ctrl+V` anywhere on the canvas to paste content and create a new page
- **Edit Pages**: Double-click any page to edit its content
- **Move Pages**: Drag pages around the canvas to reorganize
- **Delete Pages**: Select a page and press `Delete`
- **Change Colors**: Right-click pages to change their color category

### Connections & Relationships
- **Create Connections**: Drag from the edge of one page to another
- **Relationship Types**: Choose from explores, leads-to, relates, contradicts, supports, questions
- **Visual Feedback**: Connections show the relationship type and direction
- **Delete Connections**: Select and delete unwanted connections

### File Operations
- **Save**: Click "Save" button to export as NML file
- **Load**: Click "Load" button to import existing NML files
- **Format**: Files are saved in NML v2.0 XML format

### Keyboard Shortcuts
- `Ctrl+V` - Create new page with clipboard content
- `ESC` - Exit edit mode
- `Delete` - Delete selected page or connection
- `Ctrl+S` - Quick save (if browser supports)

## 🏗 Technical Architecture

### Built With
- **Frontend Framework**: React 19.1.1 with TypeScript
- **Canvas Library**: @xyflow/react 12.8.4 for interactive flow diagrams
- **State Management**: Zustand 5.0.8 for lightweight state management
- **Styling**: Tailwind CSS for modern, responsive design
- **Markdown Support**: react-markdown 10.1.0 for rich text rendering
- **Build Tool**: Create React App with optimized production builds

### Project Structure
```
src/
├── components/
│   ├── Canvas.tsx          # Main canvas component
│   └── PageNode.tsx        # Individual page component
├── stores/
│   └── canvasStore.ts      # Zustand state management
├── types/
│   └── index.ts            # TypeScript type definitions
├── utils/
│   └── nmlFormat.ts        # NML import/export utilities
├── App.tsx                 # Main application component
└── index.css               # Global styles
```

### Performance
- **Bundle Size**: 164.57 kB (gzipped) - optimized for fast loading
- **Code Splitting**: Automatic code splitting for efficient loading
- **Production Ready**: Optimized builds with minification and compression

## 📋 NML Standard Integration

This application implements the **NML v2.0 specification** for document structure and interchange.

### NML Resources
- **📚 Official NML Standard**: [GitHub Repository](https://github.com/MushroomFleet/NML--Nested-Markup-Language)
- **📖 Format Specification**: Full NML v2.0 XML schema support
- **🔄 Import/Export**: Seamless compatibility with other NML tools

### NML Features Supported
- ✅ Pages with position, size, and color attributes
- ✅ Rich content with markdown support
- ✅ Typed connections between pages
- ✅ Metadata and document properties
- ✅ Canvas state preservation
- ✅ Tags and categorization

## 🚀 Deployment

### Static Hosting
The application builds to static files and can be deployed to:
- **Netlify** - Drag and drop the `build` folder
- **Vercel** - Connect your repository for automatic deploys
- **GitHub Pages** - Upload build files to your repository
- **AWS S3 + CloudFront** - For scalable static hosting
- **Any web server** - Apache, Nginx, or any static file server

### Server Configuration
For single-page applications, ensure your server redirects all routes to `index.html`.

**Example Nginx configuration**:
```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

## 🤝 Contributing

This project implements the NML standard. For contributions to the NML specification itself, please visit the [official NML repository](https://github.com/MushroomFleet/NML--Nested-Markup-Language).

## 📄 License

Proprietary - All rights reserved

## 🔗 Related Projects

- **[NML Standard](https://github.com/MushroomFleet/NML--Nested-Markup-Language)** - Official NML specification and documentation
- **NML Ecosystem** - Additional tools and libraries for working with NML documents

## 📞 Support

For technical support or questions:
- Review the documentation in this repository
- Check the [NML standard documentation](https://github.com/MushroomFleet/NML--Nested-Markup-Language)
- File issues for bugs or feature requests

---

**Careless-Canvas-NML** - Making NML document creation visual and intuitive.
