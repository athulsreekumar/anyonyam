#!/usr/bin/env node
// Regenerates public/assets/Gallery/manifest.json by listing whatever image
// files actually sit in each category folder. Runs before every build/start
// (see package.json) so dropping a new photo into a folder is enough - no
// code change needed.
//
// Replaces the previous approach of calling webpack's require.context()
// directly inside the Gallery component: that's a bundler-specific API that
// doesn't exist under Jest (or any non-webpack tool), which made the
// component impossible to unit test and coupled it to a build tool that CRA
// itself no longer maintains.
const fs = require("fs");
const path = require("path");

const GALLERY_DIR = path.join(__dirname, "..", "public", "assets", "Gallery");
const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);

function listImages(categoryDir) {
  return fs
    .readdirSync(categoryDir)
    .filter((file) => IMAGE_EXTENSIONS.has(path.extname(file).toLowerCase()))
    .sort()
    .map((file) => `/assets/Gallery/${path.basename(categoryDir)}/${file}`);
}

function main() {
  const categories = fs
    .readdirSync(GALLERY_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);

  const manifest = Object.fromEntries(
    categories.map((category) => [category, listImages(path.join(GALLERY_DIR, category))])
  );

  fs.writeFileSync(
    path.join(GALLERY_DIR, "manifest.json"),
    JSON.stringify(manifest, null, 2) + "\n"
  );

  const summary = categories.map((c) => `${c} (${manifest[c].length})`).join(", ");
  console.log(`Gallery manifest written: ${summary}`);
}

main();
