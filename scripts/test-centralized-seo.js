/**
 * Test Script for Centralized SEO Implementation
 * Verifies that all pages are using the centralized SEO config
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Centralized SEO Implementation Test');
console.log('====================================\n');

// Check if pages are importing getSEOData
const pagesToCheck = [
  'src/pages/landing/Landing.jsx',
  'src/pages/auth/Login.jsx',
  'src/pages/auth/Register.jsx',
  'src/pages/auth/ForgotPassword.jsx',
  'src/pages/Pricing.jsx',
  'src/pages/legal/Terms.jsx',
  'src/pages/legal/Privacy.jsx',
  'src/pages/legal/Cookies.jsx',
  'src/pages/legal/Legal.jsx'
];

console.log('📋 Checking pages for centralized SEO usage:\n');

let allPassed = true;

pagesToCheck.forEach(pagePath => {
  const fullPath = path.join(__dirname, '..', pagePath);
  
  try {
    const content = fs.readFileSync(fullPath, 'utf8');
    
    // Check for getSEOData import
    const hasImport = content.includes("import { getSEOData } from");
    
    // Check for getSEOData usage
    const hasUsage = content.includes("getSEOData(");
    
    // Check for spread operator usage
    const hasSpread = content.includes("<PageSEO {...seoData}");
    
    const pageName = path.basename(pagePath);
    
    if (hasImport && hasUsage && hasSpread) {
      console.log(`✅ ${pageName}: Using centralized SEO config`);
    } else {
      console.log(`❌ ${pageName}: Missing centralized SEO implementation`);
      if (!hasImport) console.log(`   - Missing getSEOData import`);
      if (!hasUsage) console.log(`   - Missing getSEOData() call`);
      if (!hasSpread) console.log(`   - Not using spread operator for PageSEO`);
      allPassed = false;
    }
  } catch (error) {
    console.log(`❌ ${path.basename(pagePath)}: File not found or error reading`);
    allPassed = false;
  }
});

console.log('\n📊 Summary:');
console.log('===========');

if (allPassed) {
  console.log('✅ All pages are using centralized SEO configuration!');
  console.log('✅ SEO data is managed in: src/config/seo.js');
  console.log('\n🎉 Refactoring complete! Benefits:');
  console.log('   - Single source of truth for SEO data');
  console.log('   - Easier maintenance and updates');
  console.log('   - Consistent SEO across all pages');
  console.log('   - No duplicate hardcoded values');
} else {
  console.log('⚠️  Some pages still need to be updated');
  console.log('   Run this test again after fixing the issues');
}

console.log('\n💡 To update SEO for any page:');
console.log('   1. Edit src/config/seo.js');
console.log('   2. Find the route path (e.g., "/pricing")');
console.log('   3. Update title, description, keywords');
console.log('   4. Changes will apply automatically!');

console.log('\n====================================');