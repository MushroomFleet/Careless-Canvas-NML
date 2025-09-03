import { PageData, ConnectionData, NMLDocument, NMLPage, NMLLink } from '../types';

// Convert app state to NML v2.0 XML format
export const exportToNML = (
  pages: Map<string, PageData>,
  connections: ConnectionData[],
  title: string = 'Canvas Document'
): string => {
  const now = new Date().toISOString();
  
  // Convert pages to NML format
  const nmlPages: NMLPage[] = Array.from(pages.values()).map(page => ({
    id: page.id,
    x: page.x,
    y: page.y,
    width: page.width,
    height: page.height,
    color: page.color,
    created: page.created.toISOString(),
    title: page.title,
    content: page.content,
    tags: page.tags.join(',')
  }));

  // Convert connections to NML format
  const nmlLinks: NMLLink[] = connections.map(conn => ({
    from: conn.from,
    to: conn.to,
    type: conn.type,
    label: conn.label
  }));

  // Create NML document structure
  const nmlDoc: NMLDocument = {
    version: '2.0',
    meta: {
      title,
      created: now,
      author: 'Careless-Canvas-NML User'
    },
    canvas: {
      zoom: 1.0,
      centerX: 0,
      centerY: 0,
      grid: true
    },
    pages: nmlPages,
    links: nmlLinks
  };

  // Generate XML
  return generateXML(nmlDoc);
};

// Generate XML string from NML document
const generateXML = (doc: NMLDocument): string => {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += `<nml version="${doc.version}">\n`;
  
  // Meta section
  xml += '  <meta\n';
  xml += `    title="${escapeXML(doc.meta.title)}"\n`;
  xml += `    created="${doc.meta.created}"\n`;
  if (doc.meta.author) {
    xml += `    author="${escapeXML(doc.meta.author)}"\n`;
  }
  if (doc.meta.tags) {
    xml += `    tags="${escapeXML(doc.meta.tags)}"\n`;
  }
  xml += '  />\n\n';

  // Canvas section
  xml += '  <canvas\n';
  xml += `    zoom="${doc.canvas.zoom}"\n`;
  xml += `    center-x="${doc.canvas.centerX}"\n`;
  xml += `    center-y="${doc.canvas.centerY}"\n`;
  if (doc.canvas.grid !== undefined) {
    xml += `    grid="${doc.canvas.grid}"\n`;
  }
  if (doc.canvas.theme) {
    xml += `    theme="${doc.canvas.theme}"\n`;
  }
  xml += '  />\n\n';

  // Pages section
  xml += '  <pages>\n';
  doc.pages.forEach(page => {
    xml += '    <page\n';
    xml += `      id="${escapeXML(page.id)}"\n`;
    xml += `      x="${page.x}"\n`;
    xml += `      y="${page.y}"\n`;
    xml += `      width="${page.width}"\n`;
    xml += `      height="${page.height}"\n`;
    xml += `      color="${page.color}"\n`;
    xml += `      created="${page.created}"\n`;
    xml += '    >\n';
    
    if (page.title) {
      xml += `      <title>${escapeXML(page.title)}</title>\n`;
    }
    
    xml += '      <content><![CDATA[\n';
    xml += page.content;
    xml += '\n      ]]></content>\n';
    
    if (page.tags) {
      xml += `      <tags>${escapeXML(page.tags)}</tags>\n`;
    }
    
    xml += '    </page>\n\n';
  });
  xml += '  </pages>\n\n';

  // Links section
  xml += '  <links>\n';
  doc.links.forEach(link => {
    xml += `    <link from="${escapeXML(link.from)}" to="${escapeXML(link.to)}" type="${link.type}"`;
    if (link.label) {
      xml += ` label="${escapeXML(link.label)}"`;
    }
    xml += ' />\n';
  });
  xml += '  </links>\n';

  xml += '</nml>';
  
  return xml;
};

// Parse NML XML and convert to app state
export const importFromNML = (xmlContent: string): {
  pages: Map<string, PageData>;
  connections: ConnectionData[];
  title: string;
} => {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlContent, 'text/xml');
    
    // Check for parsing errors
    const errorNode = doc.querySelector('parsererror');
    if (errorNode) {
      throw new Error('Invalid XML format');
    }

    const nmlElement = doc.querySelector('nml');
    if (!nmlElement) {
      throw new Error('Invalid NML format: missing <nml> root element');
    }

    // Parse meta information
    const metaElement = doc.querySelector('meta');
    const title = metaElement?.getAttribute('title') || 'Imported Document';

    // Parse pages
    const pages = new Map<string, PageData>();
    const pageElements = doc.querySelectorAll('pages > page');
    
    pageElements.forEach(pageEl => {
      const id = pageEl.getAttribute('id');
      const x = parseFloat(pageEl.getAttribute('x') || '0');
      const y = parseFloat(pageEl.getAttribute('y') || '0');
      const width = parseFloat(pageEl.getAttribute('width') || '300');
      const height = parseFloat(pageEl.getAttribute('height') || '200');
      const color = pageEl.getAttribute('color') as any || 'gray';
      const createdStr = pageEl.getAttribute('created') || new Date().toISOString();
      
      const titleEl = pageEl.querySelector('title');
      const contentEl = pageEl.querySelector('content');
      const tagsEl = pageEl.querySelector('tags');
      
      if (id && contentEl) {
        const pageData: PageData = {
          id,
          x,
          y,
          width,
          height,
          color,
          title: titleEl?.textContent || undefined,
          content: contentEl.textContent || '',
          tags: tagsEl?.textContent ? tagsEl.textContent.split(',').map(t => t.trim()) : [],
          created: new Date(createdStr)
        };
        
        pages.set(id, pageData);
      }
    });

    // Parse connections
    const connections: ConnectionData[] = [];
    const linkElements = doc.querySelectorAll('links > link');
    
    linkElements.forEach((linkEl, index) => {
      const from = linkEl.getAttribute('from');
      const to = linkEl.getAttribute('to');
      const type = linkEl.getAttribute('type') as any || 'relates';
      const label = linkEl.getAttribute('label') || undefined;
      
      if (from && to) {
        connections.push({
          id: `connection-${index + 1}`,
          from,
          to,
          type,
          label
        });
      }
    });

    return { pages, connections, title };
    
  } catch (error) {
    console.error('Error parsing NML:', error);
    throw new Error(`Failed to parse NML file: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Utility function to escape XML special characters
const escapeXML = (str: string): string => {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
};

// Download function to save file
export const downloadNMLFile = (content: string, filename: string = 'canvas-document.nml'): void => {
  const blob = new Blob([content], { type: 'application/xml' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// File upload function
export const uploadNMLFile = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.nml,.xml';
    
    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (!file) {
        reject(new Error('No file selected'));
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        resolve(content);
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    };

    input.click();
  });
};
