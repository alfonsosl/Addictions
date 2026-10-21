// Rasteriza los SVG del icono a PNG con Chromium (Playwright).
// Uso: NODE_PATH=$(npm root -g) node scripts/icons/render.js [ruta-de-chromium]
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const out = path.join(__dirname, 'out');
const assets = path.join(__dirname, '..', '..', 'assets');
(async () => {
  const b = await chromium.launch(process.argv[2] ? { executablePath: process.argv[2] } : {});
  const pg = await b.newPage({ viewport: { width: 1024, height: 1024 } });
  const shot = async (svgFile, png, transparent) => {
    const svg = fs.readFileSync(path.join(out, svgFile), 'utf8');
    await pg.setContent(`<html><body style="margin:0;background:transparent">${svg}</body></html>`);
    await pg.screenshot({ path: path.join(assets, png), omitBackground: transparent, clip: { x: 0, y: 0, width: 1024, height: 1024 } });
  };
  await shot('icon.svg', 'icon.png', false);
  await shot('fg.svg', 'android-icon-foreground.png', true);
  await shot('mono.svg', 'android-icon-monochrome.png', true);
  await shot('splash.svg', 'splash-icon.png', true);
  await b.close();
  console.log('ok');
})();
