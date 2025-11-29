const fs = require('fs');
const path = require('path');
const glob = require('glob');

const SRC_PATH = path.join(__dirname, '../src');
const OUTPUT_FILE = path.join(__dirname, '../src/i18n/allKeys.json');

const KEY_REGEX = /t\(['"]([^'"]+)['"]\)/g;

function extractKeys() {
  const keys = new Set();
  const files = glob.sync(`${SRC_PATH}/**/*.{js,jsx}`);

  files.forEach((file) => {
    const content = fs.readFileSync(file, 'utf8');
    let match;
    while ((match = KEY_REGEX.exec(content)) !== null) {
      keys.add(match[1]);
    }
  });

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify([...keys], null, 2));
  console.log(`Successfully extracted ${keys.size} keys to ${OUTPUT_FILE}`);
}

extractKeys();
