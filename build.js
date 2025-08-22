#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Starting SLAZero.net build process...');

// Clean dist directory
if (fs.existsSync('dist')) {
    fs.removeSync('dist');
    console.log('🧹 Cleaned dist directory');
}

// Create dist structure
fs.ensureDirSync('dist/assets/css');
fs.ensureDirSync('dist/assets/js');
fs.ensureDirSync('dist/assets/images');
fs.ensureDirSync('dist/pages');

console.log('📁 Created dist directory structure');

// Copy static assets (images, fonts, etc.)
console.log('📋 Copying static assets...');
if (fs.existsSync('src/assets/images')) {
    fs.copySync('src/assets/images', 'dist/assets/images');
}

// Minify CSS
console.log('🎨 Minifying CSS...');
try {
    console.log('🔄 Processing styles.css...');
    execSync('npx cleancss -o dist/assets/css/styles.css src/assets/css/styles.css', { stdio: 'pipe' });
    console.log('✅ CSS minified successfully');
} catch (error) {
    console.error('❌ CSS minification failed:', error.message);
    console.log('🔄 Copying original CSS file...');
    // Fallback: copy original file
    fs.copySync('src/assets/css/styles.css', 'dist/assets/css/styles.css');
    console.log('✅ Original CSS file copied');
}

// Minify JavaScript files
console.log('📜 Minifying JavaScript...');
const jsFiles = [
    'src/assets/js/i18n.js',
    'src/assets/js/blog-i18n.js',
    'src/assets/js/script.js'
];

let jsMinified = 0;

// Check which JS files exist and minify them individually
for (const jsFile of jsFiles) {
    if (fs.existsSync(jsFile)) {
        const filename = path.basename(jsFile);
        try {
            console.log(`🔄 Minifying ${filename}...`);
            execSync(`npx uglifyjs ${jsFile} -o dist/assets/js/${filename} --compress --mangle`, { stdio: 'pipe' });
            console.log(`✅ ${filename} minified successfully`);
            jsMinified++;
        } catch (error) {
            console.error(`❌ ${filename} minification failed:`, error.message);
            // Try with basic minification
            try {
                console.log(`🔄 Trying basic minification for ${filename}...`);
                execSync(`npx uglifyjs ${jsFile} -o dist/assets/js/${filename}`, { stdio: 'pipe' });
                console.log(`✅ ${filename} minified with basic settings`);
                jsMinified++;
            } catch (basicError) {
                console.error(`❌ Basic minification also failed for ${filename}, copying original file`);
                fs.copySync(jsFile, `dist/assets/js/${filename}`);
            }
        }
    } else {
        console.log(`⚠️ ${jsFile} not found, skipping...`);
    }
}

console.log(`📜 JavaScript minification complete: ${jsMinified} files processed`);

// Function to minify HTML content
function minifyHtmlContent(content) {
    // Update CSS and JS references to point to minified versions
    let minifiedContent = content
        .replace(/assets\/css\/styles\.css/g, 'assets/css/styles.css')
        .replace(/assets\/js\//g, 'assets/js/');
    
    return minifiedContent;
}

// Minify HTML files
console.log('📄 Minifying HTML files...');
const htmlFiles = [
    { src: 'src/index.html', dest: 'dist/index.html' },
    { src: 'src/pages/blog.html', dest: 'dist/pages/blog.html' },
    { src: 'src/pages/404.html', dest: 'dist/pages/404.html' },
    { src: 'src/pages/500.html', dest: 'dist/pages/500.html' }
];

let htmlMinified = 0;

for (const htmlFile of htmlFiles) {
    if (fs.existsSync(htmlFile.src)) {
        try {
            console.log(`🔄 Processing ${path.basename(htmlFile.src)}...`);
            const htmlContent = fs.readFileSync(htmlFile.src, 'utf8');
            const updatedContent = minifyHtmlContent(htmlContent);
            
            // Ensure destination directory exists
            fs.ensureDirSync(path.dirname(htmlFile.dest));
            
            // Use html-minifier
            const tempFile = `temp_${Date.now()}.html`;
            fs.writeFileSync(tempFile, updatedContent);
            
            try {
                execSync(`npx html-minifier --collapse-whitespace --remove-comments --remove-optional-tags --remove-redundant-attributes --remove-script-type-attributes --remove-tag-whitespace --use-short-doctype --minify-css true --minify-js true --output ${htmlFile.dest} ${tempFile}`, { stdio: 'pipe' });
                console.log(`✅ ${path.basename(htmlFile.src)} minified successfully`);
                htmlMinified++;
            } catch (minifyError) {
                console.log(`⚠️ HTML minifier failed for ${path.basename(htmlFile.src)}, copying with basic cleanup...`);
                fs.writeFileSync(htmlFile.dest, updatedContent);
                htmlMinified++;
            }
            
            // Clean up temp file
            if (fs.existsSync(tempFile)) {
                fs.removeSync(tempFile);
            }
            
        } catch (error) {
            console.error(`❌ ${path.basename(htmlFile.src)} processing failed:`, error.message);
            // Fallback: copy original file
            fs.copySync(htmlFile.src, htmlFile.dest);
        }
    } else {
        console.log(`⚠️ ${htmlFile.src} not found, skipping...`);
    }
}

console.log(`📄 HTML processing complete: ${htmlMinified} files processed`);

// Copy other files (robots.txt, sitemap.xml, etc.)
console.log('📋 Copying additional files...');
const additionalFiles = [
    'src/robots.txt',
    'src/sitemap.xml'
];

for (const file of additionalFiles) {
    if (fs.existsSync(file)) {
        const destFile = file.replace('src/', 'dist/');
        fs.copySync(file, destFile);
        console.log(`✅ Copied ${path.basename(file)}`);
    }
}

// Generate build info
const buildInfo = {
    buildDate: new Date().toISOString(),
    version: require('./package.json').version,
    minified: true,
    environment: process.env.NODE_ENV || 'production'
};

fs.writeFileSync('dist/build-info.json', JSON.stringify(buildInfo, null, 2));
console.log('📊 Generated build info');

console.log('🎉 Build completed successfully!');
console.log('📦 Minified files are ready in the dist/ directory');

// Calculate size savings
const srcSize = getFolderSize('src');
const distSize = getFolderSize('dist');
const savings = ((srcSize - distSize) / srcSize * 100).toFixed(1);

console.log(`💾 Size reduction: ${savings}% (${formatBytes(srcSize)} → ${formatBytes(distSize)})`);

function getFolderSize(folderPath) {
    if (!fs.existsSync(folderPath)) return 0;
    
    let size = 0;
    const items = fs.readdirSync(folderPath);
    
    items.forEach(item => {
        const itemPath = path.join(folderPath, item);
        const stats = fs.statSync(itemPath);
        
        if (stats.isDirectory()) {
            size += getFolderSize(itemPath);
        } else {
            size += stats.size;
        }
    });
    
    return size;
}

function formatBytes(bytes) {
    const sizes = ['B', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 B';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
}
