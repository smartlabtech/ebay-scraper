#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const DOMAIN = 'https://brandbanda.com';
const OUTPUT_PATH = path.join(__dirname, '../public/sitemap.xml');

// Define your routes with their properties
// Only include PUBLIC pages in sitemap (no authenticated routes)
const routes = [
  // Main Public Pages
  { path: '/', priority: 1.0, changefreq: 'weekly' },
  { path: '/pricing', priority: 0.9, changefreq: 'monthly' },
  
  // Auth Pages (public access)
  { path: '/auth/login', priority: 0.8, changefreq: 'monthly' },
  { path: '/auth/forgot-password', priority: 0.5, changefreq: 'yearly' },
  
  // Legal Pages (important for SEO and user trust)
  { path: '/terms', priority: 0.7, changefreq: 'yearly' },
  { path: '/privacy', priority: 0.7, changefreq: 'yearly' },
  { path: '/cookies', priority: 0.6, changefreq: 'yearly' },
  { path: '/legal', priority: 0.6, changefreq: 'yearly' },
  
  // Authenticated pages are excluded from sitemap
  // (dashboard, projects, brand-messages, copies, products, analytics, settings)
  // These require login and shouldn't be indexed by search engines
];

// You can also dynamically import routes from your routes config
// const { routeConfig } = require('../src/config/routes');

function generateSitemap() {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
  
  // Build XML content
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  
  // Add each route
  routes.forEach(route => {
    // Skip dynamic routes (those with parameters)
    if (route.path.includes(':')) return;
    
    xml += '  <url>\n';
    xml += `    <loc>${DOMAIN}${route.path}</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += `    <changefreq>${route.changefreq}</changefreq>\n`;
    xml += `    <priority>${route.priority}</priority>\n`;
    xml += '  </url>\n';
  });
  
  xml += '</urlset>';
  
  // Write to file
  fs.writeFileSync(OUTPUT_PATH, xml, 'utf8');
  console.log(`✅ Sitemap generated successfully at: ${OUTPUT_PATH}`);
  console.log(`📝 Total URLs: ${routes.filter(r => !r.path.includes(':')).length}`);
}

// Advanced version that reads from routes config
async function generateSitemapFromConfig() {
  try {
    const { routeConfig } = await import('../src/config/routes.js');
    const today = new Date().toISOString().split('T')[0];
    
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    
    // Priority mapping based on route depth and type
    const getPriority = (path) => {
      if (path === '/') return 1.0;
      if (path === '/pricing') return 0.9;
      if (path.startsWith('/auth/')) return path === '/auth/login' ? 0.8 : 0.5;
      if (path.startsWith('/dashboard')) return 0.8;
      if (path.includes('/edit') || path.includes('/new') || path.includes('/create')) return 0.4;
      if (path.startsWith('/settings')) return 0.5;
      if (path.startsWith('/payment')) return 0.3;
      
      const depth = path.split('/').filter(Boolean).length;
      return Math.max(0.3, 0.8 - (depth * 0.1));
    };
    
    // Changefreq mapping
    const getChangefreq = (path) => {
      if (path === '/') return 'weekly';
      if (path.startsWith('/auth/')) return path.includes('forgot') ? 'yearly' : 'monthly';
      if (path.startsWith('/dashboard') || path.includes('analytics')) return 'daily';
      if (path.startsWith('/settings') || path === '/pricing') return 'monthly';
      return 'weekly';
    };
    
    // List of authenticated routes that shouldn't be in sitemap
    const authenticatedRoutes = [
      '/dashboard', '/projects', '/brand-messages', '/copies', '/products',
      '/analytics', '/settings', '/payment'
    ];
    
    Object.keys(routeConfig).forEach(path => {
      // Skip dynamic routes
      if (path.includes(':')) return;
      
      // Skip authenticated routes
      if (authenticatedRoutes.some(route => path.startsWith(route))) return;
      
      xml += '  <url>\n';
      xml += `    <loc>${DOMAIN}${path}</loc>\n`;
      xml += `    <lastmod>${today}</lastmod>\n`;
      xml += `    <changefreq>${getChangefreq(path)}</changefreq>\n`;
      xml += `    <priority>${getPriority(path).toFixed(1)}</priority>\n`;
      xml += '  </url>\n';
    });
    
    xml += '</urlset>';
    
    fs.writeFileSync(OUTPUT_PATH, xml, 'utf8');
    console.log(`✅ Sitemap generated from route config at: ${OUTPUT_PATH}`);
    console.log(`📝 Total URLs: ${Object.keys(routeConfig).filter(p => !p.includes(':')).length}`);
    
  } catch (error) {
    console.log('⚠️  Could not read route config, using static routes instead');
    generateSitemap();
  }
}

// Run the generation
if (import.meta.url === `file://${process.argv[1]}`) {
  // Try to use config first, fallback to static
  generateSitemapFromConfig().catch(() => {
    console.log('⚠️  Using static routes');
    generateSitemap();
  });
}

export { generateSitemap, generateSitemapFromConfig };