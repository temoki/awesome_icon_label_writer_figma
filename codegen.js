'use strict';
const fs = require('fs');

async function conv(name, url) {
    const res = await fetch(url);
    if (!res.ok) {
        throw new Error(`Failed to fetch ${url}: ${res.status}`);
    }
    const json = await res.json();
    let output = `export const icons = new Map<string,string>([`;
    for (const iconName of Object.keys(json)) {
        const unicode = json[iconName].unicode;
        output += `["${unicode}","${iconName}"],`;
    }
    output += '])';
    fs.writeFileSync(`./src/icons_${name}.ts`, output);
}

Promise.all([
    conv("fa6", "https://github.com/FortAwesome/Font-Awesome/raw/6.x/metadata/icons.json"),
    conv("fa5", "https://github.com/FortAwesome/Font-Awesome/raw/5.x/metadata/icons.json"),
]).catch((err) => {
    console.error(err);
    process.exit(1);
});
