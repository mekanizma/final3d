import { writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import pngToIco from "png-to-ico";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const source = resolve(root, "public/favicon-source.svg");

async function squarePng(size) {
  const density = Math.max(144, Math.round((size / 512) * 384));
  return sharp(source, { density })
    .resize(size, size, { fit: "cover" })
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
writeFileSync(resolve(root, "public/apple-icon.png"), await squarePng(180));

console.log("Professional favicon generated from public/favicon-source.svg");
