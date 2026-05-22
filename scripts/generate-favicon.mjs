import { writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import pngToIco from "png-to-ico";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const logo = resolve(root, "public/logo.png");
const bg = { r: 10, g: 6, b: 24, alpha: 1 };

async function squarePng(size) {
  return sharp(logo)
    .resize(size, size, { fit: "contain", background: bg })
    .png()
    .toBuffer();
}

const icoSizes = [16, 32, 48];
const icoBuffers = await Promise.all(icoSizes.map((s) => squarePng(s)));
const faviconIco = await pngToIco(icoBuffers);

writeFileSync(resolve(root, "src/app/favicon.ico"), faviconIco);
writeFileSync(resolve(root, "src/app/icon.png"), await squarePng(512));
writeFileSync(resolve(root, "src/app/apple-icon.png"), await squarePng(180));
writeFileSync(resolve(root, "public/favicon.ico"), faviconIco);

console.log("favicon.ico, icon.png, apple-icon.png, public/favicon.ico updated");
