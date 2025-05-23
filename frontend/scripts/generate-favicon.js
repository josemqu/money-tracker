const fs = require('fs');
const { execSync } = require('child_process');
const sharp = require('sharp');

const publicDir = '../public';
const iconSizes = [16, 32, 48, 64, 96, 128, 192, 256, 384, 512];

// Create favicon.ico
async function generateFavicon() {
  console.log('Generating favicon.ico...');
  await sharp(`${publicDir}/icon.svg`)
    .resize(32, 32)
    .toFile(`${publicDir}/favicon.ico`);
}

// Create app icons
async function generateAppIcons() {
  console.log('Generating app icons...');
  
  // Create manifest file
  const manifest = {
    name: 'Money Tracker',
    short_name: 'Money',
    icons: [],
    start_url: '.',
    display: 'standalone',
    background_color: '#4CAF50',
    theme_color: '#4CAF50',
  };

  // Generate each icon size
  for (const size of iconSizes) {
    const iconName = `icon-${size}x${size}.png`;
    await sharp(`${publicDir}/icon.svg`)
      .resize(size, size)
      .toFile(`${publicDir}/${iconName}`);
    
    if ([192, 512].includes(size)) {
      manifest.icons.push({
        src: iconName,
        sizes: `${size}x${size}`,
        type: 'image/png',
        purpose: 'any maskable'
      });
    }
  }

  // Write manifest file
  fs.writeFileSync(
    `${publicDir}/site.webmanifest`,
    JSON.stringify(manifest, null, 2)
  );

  console.log('Icons generated successfully!');
}

// Run the generation
async function main() {
  try {
    await generateFavicon();
    await generateAppIcons();
    
    // Update index.html with the necessary meta tags
    const indexPath = `${publicDir}/index.html`;
    let html = fs.readFileSync(indexPath, 'utf8');
    
    const faviconLinks = `
    <link rel="icon" href="/favicon.ico" sizes="any" />
    <link rel="icon" href="/icon.svg" type="image/svg+xml" />
    <link rel="apple-touch-icon" href="/icon-192x192.png" />
    <link rel="manifest" href="/site.webmanifest" />
    <meta name="theme-color" content="#4CAF50" />
    `;
    
    // Insert the favicon links before the closing head tag
    if (!html.includes('favicon.ico')) {
      html = html.replace('</head>', `    ${faviconLinks}\n  </head>`);
      fs.writeFileSync(indexPath, html, 'utf8');
      console.log('Updated index.html with favicon links');
    }
  } catch (error) {
    console.error('Error generating favicon and app icons:', error);
    process.exit(1);
  }
}

main();
